import ipaddress
import logging
from django.contrib.gis.geoip2 import GeoIP2
from geoip2.errors import AddressNotFoundError
from .models import UserSession
from django.utils import timezone
from notifications.models import Notification

logger = logging.getLogger(__name__)

class GeolocationService:
    @staticmethod
    def get_client_ip(request) -> str:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    @classmethod
    def get_geo_by_request(cls, request) -> dict:
        ip = cls.get_client_ip(request)
        return cls.get_geo_by_ip(ip)

    @staticmethod
    def get_geo_by_ip(ip_address: str) -> dict:
        default_data = {"country": "Unknown", "city": "Unknown", "country_code": "US"}

        if not ip_address:
            return default_data

        try:
            ip_obj = ipaddress.ip_address(ip_address)
            if ip_obj.is_private or ip_obj.is_loopback:
                return {"country": "Local Network", "city": "Local", "country_code": "LOCAL"}

            g = GeoIP2()
            city_info = g.city(ip_address)
            
            return {
                "country": city_info.get("country_name", "Unknown"),
                "city": city_info.get("city", "Unknown"),
                "country_code": city_info.get("country_code", "US")
            }

        except ValueError:
            return default_data
        except AddressNotFoundError:
            return default_data
        except Exception as ex:
            logger.error(f"GeoIP crash for IP {ip_address}: {ex}")
            return default_data


class SessionService:
    @staticmethod
    def get_location_string(ip, geo_data):
        if ip in ('127.0.0.1', '::1') or geo_data.get('country_code') == 'LOCAL':
            return "Локальная сеть"
        elif geo_data.get('city') != 'Unknown':
            return f"{geo_data.get('city')}, {geo_data.get('country')}"
        return "Не удалось определить город"
    @classmethod
    def create_or_update_session(cls, user, access_jti, request, get_user_agent, GeolocationService):
        ip = GeolocationService.get_client_ip(request)
        geo_data = GeolocationService.get_geo_by_ip(ip)
        location = cls.get_location_string(ip, geo_data)

        user_agent = get_user_agent(request)
        browser = f"{user_agent.browser.family} (версия {user_agent.browser.version_string})"
        os_platform = user_agent.os.family
        user_agent_string = str(user_agent)

        existing_session = UserSession.objects.filter(
            user=user,
            user_agent_string=user_agent_string
        ).first()

        is_new_device = existing_session is None

        if not is_new_device:
            existing_session.jti = access_jti
            existing_session.ip_address = ip
            existing_session.location = location
            existing_session.save()
        else :
            UserSession.objects.create(
                user=user,
                jti=access_jti,
                ip_address=ip,
                location=location,
                browser=browser,
                os=os_platform,
                user_agent_string=user_agent_string
            )

        return is_new_device, {
            "browser": browser,
            "os": os_platform,
            "location": location,
            "ip": ip
        }

    @staticmethod
    def send_login_notification(user, device_info, is_new_device):
        current_time = timezone.localtime(timezone.now()).strftime('%d.%m.%Y %H:%M MSK')

        title = 'Вход с нового устройства' if is_new_device else 'Вход в аккаунт'

        description_text = (
            f"Выполнен вход. Браузер {device_info['browser']} на {device_info['os']}.\n"
            f"Город: {device_info['location']}, IP {device_info['ip']}.\n"
            f"Дата и время: {current_time}.\n"
            f"Если это были не вы — завершите сеанс в настройках аккаунта."
        )

        Notification.objects.create(
            user=user,
            type='system',
            title=title,
            description=description_text
        )
