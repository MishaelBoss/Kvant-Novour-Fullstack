'use client';
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login, register as registerApi } from "@/app/lib/api";
import { UserLogin } from "@/app/types/user_login.interface";
import { useRouter } from "next/navigation";
import { PAGES } from "@/app/config/page";

export function AuthModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false); 
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const isLogin = mode === 'login';
    const router = useRouter();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data: UserLogin) => {
        if (isLogin) {
            const isSuccess = await login(data);

            if(isSuccess) {
                setOpen(false);
                router.push(PAGES.MY_PROFILE());
            }
        } else {
            const isSuccess = await registerApi(data);

            if(isSuccess) {
                setOpen(false);
                router.push(PAGES.MY_PROFILE());
            }
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    {isLogin 
                        ? 'Введите свои данные, чтобы войти в кабинет.' 
                        : 'Создайте аккаунт.'}
                </Dialog.Description>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex direction="column" gap="4">
                        <Box>
                            <Text as="div" size="2" mb="2" weight="bold">Логин</Text>
                            <TextField.Root 
                                placeholder="Ваш никнейм" 
                                size="3" 
                                {...register("username", { required: "Введите никнейм" })}
                            >
                                <TextField.Slot>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>

                        <Box>
                            <Text as="div" size="2" mb="2" weight="bold">Пароль</Text>
                            <TextField.Root 
                                type="password"
                                placeholder="Ваш пароль" 
                                size="3" 
                                {...register("password", { required: "Введите пароль", minLength: 6 })}
                            >
                                <TextField.Slot>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>
                    </Flex>

                    <Flex direction="column" gap="3" mt="6">
                        <Button type="submit" variant="solid" color="indigo" size="3" style={{ cursor: 'pointer', borderRadius: '12px' }}>
                            {isLogin ? 'Войти' : 'Создать аккаунт'}
                        </Button>
                    
                        <Button variant="ghost" color="gray" size="2" style={{ cursor: 'pointer' }} onClick={() => setMode(isLogin ? 'register' : 'login')}>{isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}</Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}