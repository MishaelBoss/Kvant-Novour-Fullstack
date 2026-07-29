from celery import shared_task
from datetime import timedelta
from django.utils import timezone


@shared_task
def clean_old_notifications(user_id, notif_type):
    from .models import Notification

    kept_ids = Notification.objects.filter(
        user=user_id, 
        type=notif_type
    ).order_by('-created_at')[:10].values_list('id', flat=True)

    Notification.objects.filter(
        user_id=user_id, 
        type=notif_type
    ).exclude(id__in=list(kept_ids)).delete()


@shared_task
def cleanup_old_notifications():
    from .models import Notification

    cutoff = timezone.now() - timedelta(days=30)
    deleted, _ = Notification.objects.filter(created_at__lt=cutoff).delete()
    return f"Удалены уведомления {deleted} старше 30 дней"
