import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0009_alter_form_slug'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='FormView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='views_records', to='forms.form')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='form_views', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('form', 'user')},
            },
        ),
    ]