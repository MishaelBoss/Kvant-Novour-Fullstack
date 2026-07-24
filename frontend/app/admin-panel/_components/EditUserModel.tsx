"use client";
import { InputWithClear } from "@/app/components/InputWithClear";
import { updateUserByAdmin } from "@/app/lib/api";
import { IUser } from "@/app/types/user.interface";
import { Button, Callout, Dialog, Flex } from "@radix-ui/themes";
import { Mail, Phone, User, ShieldCheck } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { RadioGroup } from "radix-ui";
import { useEffect, useState } from "react";

interface Props {
    children: React.ReactNode;
    user: IUser | null;
}

const ROLES = [
    { value: 'user', label: 'Пользователь' },
    { value: 'teacher', label: 'Преподаватель' },
    { value: 'admin', label: 'Администратор' },
];

export function EditUserModel({ children, user }: Props) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<IUser>({
        defaultValues: {
            username: user?.username || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            middle_name: user?.middle_name || '',
            phone: user?.phone || '',
            email: user?.email || '',
            role: user?.role || 'user'
        }
    });

    useEffect(() => {
        if (user) {
            methods.reset({
                username: user?.username || '',
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                middle_name: user?.middle_name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                role: user?.role || 'user'
            });
        }
    }, [user, methods]);
    
    const onSubmit = async (data: IUser) => {
        if (!user?.id) return;

        setIsLoading(true);
        setError('');

        try {
            const success = await updateUserByAdmin(user.id, {
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                middle_name: data.middle_name || '',
                phone: data.phone || '',
                email: data.email || '',
                role: data.role,
            });

            if (success) {
                setOpen(false);
                setError('');
            }
        } catch (error: unknown) {
            let errorMessage = 'Произошла ошибка. Попробуйте снова.';

            const axiosError = error as { response?: { data?: Record<string, unknown> } };
            const responseData = axiosError?.response?.data;

            if (responseData) {
                const errorValues = Object.values(responseData).flat() as string[];
                if (errorValues.length > 0 && typeof errorValues[0] === 'string') errorMessage = errorValues[0];
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            <Dialog.Content maxWidth="420px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Редактировать пользователя</Dialog.Title>
                <Dialog.Description size="2" mb="3" color="gray">
                    {user?.last_name || user?.first_name
                        ? `${user.last_name || ''} ${user.first_name || ''}`
                        : user?.username}
                </Dialog.Description>

                {error && (
                    <Callout.Root color="red" size="1" mb="4" style={{ borderRadius: '8px' }}>
                        <Callout.Text>{error}</Callout.Text>
                    </Callout.Root>
                )}

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            <InputWithClear
                                label="Логин"
                                name="username"
                                placeholder="Введите логин"
                                rules={{ required: "Обязательно" }}
                                icon={<User size={16} />}
                                type="text"
                            />
                            <InputWithClear
                                label="Имя"
                                name="first_name"
                                placeholder="Введите имя"
                                rules={{ required: "Обязательно" }}
                                icon={<User size={16} />}
                                type="text"
                            />
                            <InputWithClear
                                label="Фамилия"
                                name="last_name"
                                placeholder="Введите фамилию"
                                rules={{ required: "Обязательно" }}
                                icon={<User size={16} />}
                                type="text"
                            />
                            <InputWithClear
                                label="Отчество"
                                name="middle_name"
                                placeholder="Введите отчество (если есть)"
                                icon={<User size={16} />}
                                type="text"
                            />
                            <InputWithClear
                                label="Телефон"
                                name="phone"
                                placeholder="Введите телефон"
                                icon={<Phone size={16} />}
                                type="tel"
                            />
                            <InputWithClear
                                label="Почта"
                                name="email"
                                placeholder="Введите почту"
                                icon={<Mail size={16} />}
                                type="email"
                            />

                            <div>
                                <p className="text-[13px] font-medium mb-2 flex items-center gap-1.5">
                                    <ShieldCheck size={14} />
                                    Роль
                                </p>
                                <Controller name="role" control={methods.control} render={({ field }) => (
                                    <RadioGroup.Root value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-4">
                                        {ROLES.map((role) => (
                                            <Flex align="center" gap="2" key={role.value}>
                                            <RadioGroup.Item
                                                value={role.value}
                                                className="w-4 h-4 rounded-full border border-gray-400 bg-white"
                                                style={{ flexShrink: 0 }} 
                                            >
                                                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full after:content-[''] after:w-2 after:h-2 after:rounded-full after:bg-blue-500" />
                                            </RadioGroup.Item>
                                            <label className="text-sm">{role.label}</label>
                                            </Flex>
                                        ))}
                                    </RadioGroup.Root>
                                )} />
                            </div>
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
                                disabled={isLoading}
                                variant="solid"
                                color="indigo"
                                size="3"
                                style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    )
};