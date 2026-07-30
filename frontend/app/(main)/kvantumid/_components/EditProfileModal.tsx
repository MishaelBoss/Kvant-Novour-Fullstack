"use client";
import { InputWithClear } from "@/app/components/InputWithClear";
import { useAuth } from "@/app/context/AuthContext";
import { editProfile } from "@/app/lib/api";
import { IEditProfile, IUser } from "@/app/types/user.interface";
import { Dialog, Button, Flex, Callout } from "@radix-ui/themes";
import { Mail, Phone, User } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
    children: React.ReactNode;
}

export function EditProfileModal({children}: Props){
    const { user, updateUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<IEditProfile>({
        defaultValues: {
            username: user?.username || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            middle_name: user?.middle_name || '',
            phone: user?.phone || '',
            email: user?.email || ''
        }
    }); 

    const onSubmit = async (data: IEditProfile) => {
        setIsLoading(true);
        setError('');

        try {
            await editProfile(data);
            
            updateUser(data);

            setOpen(false);
            toast.success("Данные успешно сохранены");
        } catch(error: unknown) {
            const isApiError = (err: any): err is ApiError => {
                return err instanceof ApiError || (err && err.isApiError === true);
            };

            if (isApiError(error)) {
                toast.error(error.message);
                setError(error.message);
            } else { 
                toast.error("Произошла непредвиденная ошибка на клиенте");
                setError("Не удалось сохранить изменения");
            }

            console.error("Ошибка при загрузке:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Личные данные</Dialog.Title>
                <Dialog.Description size="2" mb="3" color="gray">Здесь вы можете изменить свои личные данные</Dialog.Description>

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
                            />

                            <InputWithClear 
                                label="Имя пользователя" 
                                name="first_name" 
                                placeholder="Введите имя"
                                rules={{ required: "Обязательно" }}
                                icon={<User size={16} />} 
                            />

                            <InputWithClear 
                                label="Фамилия пользователя" 
                                name="last_name" 
                                placeholder="Введите фамилию"
                                rules={{ required: "Обязательно" }}
                                icon={<User size={16} />} 
                            />

                            <InputWithClear 
                                label="Отчество пользователя" 
                                name="middle_name" 
                                placeholder="Введите отчество (если есть)"
                                icon={<User size={16} />} 
                            />

                            <InputWithClear 
                                label="Телефон" 
                                name="phone" 
                                placeholder="Введите телефон"
                                rules={{ required: "Обязательно" }}
                                icon={<Phone size={16} />} 
                            />

                            <InputWithClear 
                                label="Почта" 
                                name="email" 
                                placeholder="Введите почту"
                                icon={<Mail size={16} />} 
                            />
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
                                {isLoading ? 'Загрузка...' : 'Сохранить'}
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    );
}