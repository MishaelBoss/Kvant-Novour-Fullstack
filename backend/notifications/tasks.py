from celery import shared_task
from datetime import timedelta
from django.utils import timezone


@shared_task(bind=True, default_retry_delay=5, max_retries=3)
def clean_old_notifications(self, user_id, notif_type):
    from .models import Notification

    try:
        kept_ids = Notification.objects.filter(
            user_id=user_id, 
            type=notif_type
        ).order_by('-created_at')[:10].values_list('id', flat=True)

        Notification.objects.filter(
            user_id=user_id, 
            type=notif_type
        ).exclude(id__in=list(kept_ids)).delete()
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, default_retry_delay=5, max_retries=3)
def cleanup_old_notifications(self):
    from .models import Notification

    try:
        cutoff = timezone.now() - timedelta(days=30)
        deleted, _ = Notification.objects.filter(created_at__lt=cutoff).delete()
        return f"Удалены уведомления {deleted} старше 30 дней"
    except Exception as exc:
        raise self.retry(exc=exc)
