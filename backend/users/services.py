import ipaddress
import logging
from django.contrib.gis.geoip2 import GeoIP2
from geoip2.errors import AddressNotFoundError

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
        except Exception as e:
            logger.error(f"GeoIP crash for IP {ip_address}: {e}")
            return default_data
