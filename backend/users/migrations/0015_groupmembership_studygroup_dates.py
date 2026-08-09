from django.db import migrations, models


def seed_memberships(apps, schema_editor):
    StudyGroup = apps.get_model('users', 'StudyGroup')
    GroupMembership = apps.get_model('users', 'GroupMembership')

    for group in StudyGroup.objects.all().iterator():
        for student in group.students.all():
            GroupMembership.objects.get_or_create(
                group=group,
                student=student,
                defaults={'status': 'active'},
            )


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_studygroup_module_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='studygroup',
            name='start_date',
            field=models.DateField(blank=True, null=True, verbose_name='Дата начала занятий'),
        ),
        migrations.AddField(
            model_name='studygroup',
            name='end_date',
            field=models.DateField(blank=True, null=True, verbose_name='Дата окончания занятий'),
        ),
        migrations.CreateModel(
            name='GroupMembership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('active', 'Активен'), ('completed', 'Прошёл модуль'), ('left', 'Покинул')], default='active', max_length=10)),
                ('joined_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('group', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='memberships', to='users.studygroup')),
                ('student', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='group_memberships', to='auth.user')),
            ],
            options={
                'ordering': ['-joined_at'],
            },
        ),
        migrations.AlterUniqueTogether(
            name='groupmembership',
            unique_together={('group', 'student')},
        ),
        migrations.RunPython(seed_memberships, migrations.RunPython.noop),
    ]
