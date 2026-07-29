from celery import shared_task

# Create your tests here.
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