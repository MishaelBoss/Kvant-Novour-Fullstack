"use client";

import { InputWithClear } from "@/app/components/InputWithClear";
import { editProfile } from "@/app/lib/api";
import { IEditProfile, IUser } from "@/app/types/user.interface";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface EditProfileModalProps {
    children: React.ReactNode;
    user: IUser | null;
}

export function EditProfileModal({children, user}: EditProfileModalProps){
    const [open, setOpen] = useState(false);

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

    useEffect(() => {
        if (user) {
            methods.reset({
                username: user.username || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                middle_name: user.middle_name || '',
                phone: user?.phone || '',
                email: user?.email || ''
            });
        }
    }, [user, methods]);

    const onSubmit = async (data: IEditProfile) => {
        const isSuccess = await editProfile(data);

        if(isSuccess){
            setOpen(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Личные данные</Dialog.Title>
                <Dialog.Description size="2" mb="3" color="gray">Здесь вы можете изменить свои личные данные</Dialog.Description>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            <InputWithClear 
                                label="Логин" 
                                name="username" 
                                placeholder="Введите логин"
                                rules={{ required: "Обязательно" }}
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
                            />

                            <InputWithClear 
                                label="Имя пользователя" 
                                name="first_name" 
                                placeholder="Введите имя"
                                rules={{ required: "Обязательно" }}
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
                            />

                            <InputWithClear 
                                label="Фамилия пользователя" 
                                name="last_name" 
                                placeholder="Введите фамилию"
                                rules={{ required: "Обязательно" }}
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
                            />

                            <InputWithClear 
                                label="Отчество пользователя" 
                                name="middle_name" 
                                placeholder="Введите отчество (если есть)"
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
                            />

                            <InputWithClear 
                                label="Телефон" 
                                name="phone" 
                                placeholder="Введите телефон"
                                rules={{ required: "Обязательно" }}
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                            />

                            <InputWithClear 
                                label="Почта" 
                                name="email" 
                                placeholder="Введите почту"
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} 
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
                                variant="solid" 
                                color="indigo" 
                                size="3" 
                                style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                            >
                                Сохранить
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    );
}