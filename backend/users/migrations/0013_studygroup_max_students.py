from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_alter_studygroup_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='studygroup',
            name='max_students',
            field=models.PositiveIntegerField(null=True, blank=True, default=10, verbose_name='Максимум участников (0 — без лимита)'),
        ),
    ]
