"use client";
import { InputWithClear } from "@/app/components/InputWithClear";
import { createStudyGroup, getListUsers } from "@/app/lib/api";
import { IUser } from "@/app/types/user.interface";
import { Dialog, Button, Flex, Box, Text } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Select, { MultiValue, SingleValue } from "react-select";
import { Users } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";

interface Props {
    children: React.ReactNode;
    fetch: () => Promise<void>;
}

interface TeacherOption {
    value: number;
    label: string;
}

interface StudentOption {
    value: number;
    label: string;
}

interface GroupFormValues {
    name: string;
    teacher_id: number | null;
    students_ids: number[];
}

export default function CreateStudyGroupModal({ children, fetch }: Props) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [teachers, setTeachers] = useState<IUser[]>([]);
    const [students, setStudents] = useState<IUser[]>([]);
    
    const methods = useForm<GroupFormValues>({
        defaultValues: {
            name: '',
            teacher_id: null,
            students_ids: [],
        }
    });

    useEffect(() => {
        if (!open) return;

        const loadUsers = async () => {
            try {
                const res = await getListUsers();
                setTeachers(res.results.filter((u) => u.role === 'teacher'));
                setStudents(res.results.filter((u) => u.role === 'user'));
            } catch (error) {
                const isApiError = (err: any): err is ApiError =>
                    err instanceof ApiError || (err && err.isApiError === true);

                if (isApiError(error)) toast.error(error.message);
                else toast.error("Произошла непредвиденная ошибка на клиенте");

                console.error("Ошибка при загрузке пользователей:", error);
            }
        };
        loadUsers();
    }, [open]);

    const onOpenChange = (value: boolean) => {
        setOpen(value);
        if (!value) {
            methods.reset();
        }
    };

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
            await createStudyGroup({
                id: 0,
                name: data.name,
                teacher: '',
                teacher_id: data.teacher_id,
                students_ids: data.students_ids,
            });

            toast.success("Группа успешно создана");
            setOpen(false);
            methods.reset();
            await fetch();
        } catch (error) {
            const isApiError = (err: any): err is ApiError =>
                err instanceof ApiError || (err && err.isApiError === true);

            if (isApiError(error)) toast.error(error.message);
            else toast.error("Произошла непредвиденная ошибка на клиенте");

            console.error("Ошибка при создании группы:", error);
        } finally {
            setSaving(false);
        }
    };
    
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger>{children}</Dialog.Trigger>

            <Dialog.Content maxWidth="420px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Создать группу</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Новая учебная группа для занятий
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
                                {saving ? "Создание..." : "Создать"}
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    )
};