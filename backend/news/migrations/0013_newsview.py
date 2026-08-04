import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0012_remove_news_form_slug_news_slug'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='NewsView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('news', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='views_records', to='news.news')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='news_views', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('news', 'user')},
            },
        ),
    ]