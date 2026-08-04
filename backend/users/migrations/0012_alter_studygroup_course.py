from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_userprofile_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='studygroup',
            name='course',
            field=models.CharField(
                blank=True,
                default='',
                help_text='',
                max_length=100,
                verbose_name='Курс (слаг направления)',
            ),
        ),
    ]