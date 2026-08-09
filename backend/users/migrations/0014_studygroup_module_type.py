from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_studygroup_max_students'),
    ]

    operations = [
        migrations.AddField(
            model_name='studygroup',
            name='module_type',
            field=models.CharField(blank=True, choices=[('intro', 'Вводный модуль'), ('advanced', 'Углублённый модуль'), ('project', 'Проектный модуль')], default='', max_length=20, verbose_name='Тип модуля'),
        ),
    ]
