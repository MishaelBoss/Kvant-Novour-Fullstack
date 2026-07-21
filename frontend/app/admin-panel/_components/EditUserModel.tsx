"use client";

import { InputWithClear } from "@/app/components/InputWithClear";
import { editProfile } from "@/app/lib/api";
import { IEditProfile, IUser } from "@/app/types/user.interface";
import { Button, Callout, Dialog, Flex } from "@radix-ui/themes";
import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface Props {
    children: React.ReactNode;
    user: IUser | null;
}

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
                role: user?.role || 'user'
            });
        }
    }, [user, methods]);
    
    const onSubmit = async (data: IUser) => {
        setIsLoading(true);

        try {
            // await editProfile(data);
            
            setOpen(false);
            setError('');
            setIsLoading(false);
        } catch(error) {
            let errorMessage = 'Произошла ошибка. Попробуйте снова.';
            const responseData = (error as as)?.response?.data;
            
            if (responseData) {
                if (responseData.username?.[0]) errorMessage = responseData.username[0];
                else if (responseData.email?.[0]) errorMessage = responseData.email[0];
                else if (responseData.non_field_errors?.[0]) errorMessage = responseData.non_field_errors[0];
            }
            
            setError(errorMessage);
            setIsLoading(false);
        }
    };
    
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            <Dialog.Content maxWidth="400px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Личные данные пользователя {user?.username}</Dialog.Title>
                <Dialog.Description size="2" mb="3" color="gray">Здесь вы можете изменить личные данные пользователя</Dialog.Description>

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
    )
};