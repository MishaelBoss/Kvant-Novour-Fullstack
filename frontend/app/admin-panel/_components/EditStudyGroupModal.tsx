"use client";
import { InputWithClear } from "@/app/components/InputWithClear";
import { getListUsers, getStudyGroup, updateStudyGroup } from "@/app/lib/api";
import { IUser } from "@/app/types/user.interface";
import { IGroup } from "@/app/types/group.interface";
import { Dialog, Button, Flex, Box, Text, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select, { MultiValue, SingleValue } from "react-select";
import { Users, BookOpen } from "lucide-react";
import { IApiError } from "@/app/types/api-error.interface";
import toast from "react-hot-toast";

const COURSE_OPTIONS = [
    { value: '', label: 'Без направления' },
    { value: 'it', label: 'IT' },
    { value: 'chess', label: 'Chess' },
    { value: 'hi-tech', label: 'Hi-Tech' },
    { value: 'english', label: 'English' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'prom', label: 'Prom' },
    { value: 'vr-ar', label: 'VR/AR' },
];

const MODULE_OPTIONS = [
    { value: '', label: 'Без модуля' },
    { value: 'intro', label: 'Вводный модуль' },
    { value: 'advanced', label: 'Углублённый модуль' },
    { value: 'project', label: 'Проектный модуль' },
];

interface Props {
    group: IGroup;
    children: React.ReactNode;
    fetch: () => Promise<void>;
}

interface TeacherOption { value: number; label: string; }
interface StudentOption { value: number; label: string; }

interface GroupFormValues {
    name: string;
    course: string;
    module_type: string;
    teacher_id: number | null;
    students_ids: number[];
    max_students: number | null;
}

export default function EditStudyGroupModal({ group, children, fetch }: Props) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [teachers, setTeachers] = useState<IUser[]>([]);
    const [students, setStudents] = useState<IUser[]>([]);

    const methods = useForm<GroupFormValues>({
        defaultValues: {
            name: group.name,
            course: group.course ?? '',
            module_type: group.module_type ?? '',
            teacher_id: group.teacher_id ?? null,
            students_ids: group.students_ids ?? [],
            max_students: group.max_students ?? null,
        }
    });

    useEffect(() => {
        if (!open) return;

        const loadUsers = async () => {
            try {
                const [res, detail] = await Promise.all([
                    getListUsers(),
                    getStudyGroup(group.id),
                ]);
                setTeachers(res.results.filter((u) => u.role === 'teacher'));
                setStudents(res.results.filter((u) => u.role === 'user'));

                methods.reset({
                    name: detail.name,
                    course: detail.course ?? '',
                    module_type: detail.module_type ?? '',
                    teacher_id: detail.teacher_id ?? null,
                    students_ids: detail.students_ids ?? [],
                    max_students: detail.max_students ?? null,
                });
            } catch (error) {
                const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

                if (hasApiMarker) {
                    const apiError = error as IApiError;
                    toast.error(apiError.message);
                } else toast.error("Произошла непредвиденная ошибка на клиенте");

                console.error("Ошибка", error);
            }
        };
        loadUsers();
    }, [open, group.id, methods]);

    const onOpenChange = (value: boolean) => setOpen(value);

    const teacherOptions: TeacherOption[] = teachers.map((t) => ({
        value: t.id,
        label: `${t.last_name || ''} ${t.first_name || ''} ${t.middle_name || ''}`.trim() || (t.username || `Пользователь #${t.id}`),
    }));

    const studentOptions: StudentOption[] = students.map((s) => ({
        value: s.id,
        label: `${s.last_name || ''} ${s.first_name || ''} ${s.middle_name || ''}`.trim() || (s.username || `Пользователь #${s.id}`),
    }));

    const selectStyles = {
        control: (base: any) => ({
            ...base,
            borderRadius: '12px',
            padding: '2px',
            borderColor: 'var(--gray-6)',
        }),
    };

    const onSubmit = async (data: GroupFormValues) => {
        if (!data.teacher_id) {
            toast.error("Выберите преподавателя");
            return;
        }

        setSaving(true);
        try {
            await updateStudyGroup(group.id, {
                name: data.name,
                course: data.course,
                module_type: data.module_type,
                teacher_id: data.teacher_id,
                students_ids: data.students_ids,
                max_students: data.max_students ?? null,
            });

            toast.success("Группа успешно обновлена");
            setOpen(false);
            methods.reset();
            await fetch();
        } catch (error) {
            const hasApiMarker = error !== null && typeof error === 'object' && 'isApiError' in error;

            if (hasApiMarker) {
                const apiError = error as IApiError;
                toast.error(apiError.message);
            } else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger>{children}</Dialog.Trigger>

            <Dialog.Content maxWidth="420px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Редактировать группу</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Изменение учебной группы
                </Dialog.Description>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            <InputWithClear
                                label="Название группы"
                                name="name"
                                placeholder="Например: Группа 1"
                                rules={{ required: "Обязательно" }}
                                icon={<Users size={16} />}
                            />

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Направление (курс)</Text>
                                <Controller
                                    name="course"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Box
                                            style={{
                                                position: 'relative',
                                                borderRadius: '12px',
                                                border: '1px solid var(--gray-6)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <select
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="w-full px-3 py-2.5 text-sm bg-transparent cursor-pointer outline-none appearance-none"
                                            >
                                                {COURSE_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <BookOpen
                                                size={16}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                    color: 'var(--gray-9)',
                                                }}
                                            />
                                        </Box>
                                    )}
                                />
                            </Box>

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Тип модуля</Text>
                                <Controller
                                    name="module_type"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Box
                                            style={{
                                                position: 'relative',
                                                borderRadius: '12px',
                                                border: '1px solid var(--gray-6)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <select
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="w-full px-3 py-2.5 text-sm bg-transparent cursor-pointer outline-none appearance-none"
                                            >
                                                {MODULE_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <BookOpen
                                                size={16}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                    color: 'var(--gray-9)',
                                                }}
                                            />
                                        </Box>
                                    )}
                                />
                            </Box>

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Преподаватель</Text>
                                <Controller
                                    name="teacher_id"
                                    control={methods.control}
                                    rules={{ required: "Обязательно" }}
                                    render={({ field }) => (
                                        <Select<TeacherOption, false>
                                            options={teacherOptions}
                                            value={teacherOptions.find((o) => o.value === field.value) || null}
                                            onChange={(option: SingleValue<TeacherOption>) => field.onChange(option?.value ?? null)}
                                            placeholder="Выберите преподавателя..."
                                            isClearable
                                            noOptionsMessage={() => "Преподаватели не найдены"}
                                            styles={selectStyles}
                                        />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Ученики</Text>
                                <Controller
                                    name="students_ids"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Select<StudentOption, true>
                                            isMulti
                                            options={studentOptions}
                                            value={studentOptions.filter((o) => field.value.includes(o.value))}
                                            onChange={(newValue: MultiValue<StudentOption>) =>
                                                field.onChange(newValue.map((o) => o.value))
                                            }
                                            placeholder="Выберите учеников..."
                                            noOptionsMessage={() => "Ученики не найдены"}
                                            styles={selectStyles}
                                        />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Text as="div" size="2" mb="1" weight="bold">Максимум участников</Text>
                                <Controller
                                    name="max_students"
                                    control={methods.control}
                                    rules={{ min: { value: 0, message: "Не может быть отрицательным" } }}
                                    render={({ field }) => (
                                        <TextField.Root
                                            type="number"
                                            size="3"
                                            placeholder="Например: 10"
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                        >
                                            <TextField.Slot>
                                                <Users size={16} />
                                            </TextField.Slot>
                                        </TextField.Root>
                                    )}
                                />
                                <Text as="div" size="1" color="gray" mt="1">
                                    0 — без лимита. Всем будет видно заполненность группы (например, 2/10).
                                </Text>
                            </Box>
                        </Flex>

                        <Flex direction="row" gap="3" mt="6" width="100%">
                            <Button
                                type="button"
                                variant="soft"
                                color="indigo"
                                size="3"
                                style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                                onClick={() => setOpen(false)}
                            >
                                Отмена
                            </Button>

                            <Button
                                type="submit"
                                variant="solid"
                                color="indigo"
                                size="3"
                                disabled={saving}
                                style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                            >
                                {saving ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    )
};