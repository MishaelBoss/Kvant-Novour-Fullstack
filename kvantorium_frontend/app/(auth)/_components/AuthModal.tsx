'use client';
import { Dialog, Button, Flex, Text, TextField, Box, Callout } from "@radix-ui/themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login, register as registerApi } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { PAGES } from "@/app/config/pages.config";
import { UserLogin, UserRegister } from "@/app/types/user.interface";

export function AuthModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false); 
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const isLogin = mode === 'login';
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors }, reset, clearErrors, trigger } = useForm<UserRegister>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const onSubmit = async (data: UserLogin | UserRegister) => {
        reset();
        clearErrors(); 
        setStep(1);
        setError('');

        try {
            if (isLogin) {
                await login(data as UserLogin);
            } else {
                await registerApi(data as UserRegister);
            }

            setOpen(false);
            router.push(PAGES.MY_PROFILE());
        } catch(error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || 'Произошла ошибка. Попробуйте снова.');
        }
    };

    const stepTitles: Record<number, string> = {
        1: "Шаг 1: Аккаунт",
        2: "Шаг 2: ФИО",
        3: "Шаг 3: Подтверждение"
    };

    return (
        <Dialog.Root open={open}  onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
                reset();
                clearErrors();
                setError('');
                setStep(1);
                setMode('login');
        }}}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            {isLogin ? (
                <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                    <Dialog.Title size="6" mb="1">Вход в аккаунт</Dialog.Title>
                    <Dialog.Description size="2" mb="5" color="gray">
                        Введите свои данные, чтобы войти в кабинет.
                    </Dialog.Description>

                    {error && (
                        <Callout.Root color="red" size="1" mb="4" style={{ borderRadius: '8px' }}>
                            <Callout.Text>{error}</Callout.Text>
                        </Callout.Root>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} key={mode}>
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
                                {errors.username && (
                                    <Text color="red" size="1" mt="1">{errors.username.message}</Text>
                                )}
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
                                {errors.password && (
                                    <Text color="red" size="1" mt="1">{errors.password.message}</Text>
                                )}
                            </Box>
                        </Flex>

                        <Flex direction="column" gap="3" mt="6">
                            <Button type="submit" variant="solid" color="indigo" size="3" style={{ cursor: 'pointer', borderRadius: '12px' }}>
                                Войти
                            </Button>
                        
                            <Button variant="ghost" color="gray" size="2" style={{ cursor: 'pointer' }} onClick={() => { clearErrors(); setError(''); setMode('register'); }}>
                                Нет аккаунта? Зарегистрироваться
                            </Button>
                        </Flex>
                    </form>
                </Dialog.Content>
            ) : (
                <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                    <Dialog.Title size="6" mb="1">{stepTitles[step]}</Dialog.Title>
                    <Dialog.Description size="2" mb="5" color="gray">Создайте аккаунт.</Dialog.Description>

                    {error && (
                        <Callout.Root color="red" size="1" mb="4" style={{ borderRadius: '8px' }}>
                            <Callout.Text>{error}</Callout.Text>
                        </Callout.Root>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            {step === 1 && (
                                <>
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
                                    {errors.username && (
                                        <Text color="red" size="1" mt="1">{errors.username.message}</Text>
                                    )}
                                </Box>

                                <Box>
                                    <Text as="div" size="2" mb="2" weight="bold">Почта</Text>
                                    <TextField.Root 
                                        placeholder="Ваша почта" 
                                        size="3"
                                        {...register("email", { required: "Введите email" })}
                                    >
                                        <TextField.Slot>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><polyline points="22,7 12,14 2,7"/></svg>
                                        </TextField.Slot>
                                    </TextField.Root>
                                    {errors.email && (
                                        <Text color="red" size="1" mt="1">{errors.email.message}</Text>
                                    )}
                                </Box>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                <Box>
                                    <Text as="div" size="2" mb="2" weight="bold">Имя</Text>
                                    <TextField.Root 
                                        placeholder="Имя" 
                                        size="3"
                                        {...register("first_name", { required: "Введите имя" })}
                                    >
                                        <TextField.Slot>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </TextField.Slot>
                                    </TextField.Root>
                                    {errors.first_name && (
                                        <Text color="red" size="1" mt="1">{errors.first_name.message}</Text>
                                    )}
                                </Box>

                                <Box>
                                    <Text as="div" size="2" mb="2" weight="bold">Фамилия</Text>
                                    <TextField.Root 
                                        placeholder="Фамилия" 
                                        size="3"
                                        {...register("last_name", { required: "Введите фамилию" })}
                                    >
                                        <TextField.Slot>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </TextField.Slot>
                                    </TextField.Root>
                                    {errors.last_name && (
                                        <Text color="red" size="1" mt="1">{errors.last_name.message}</Text>
                                    )}
                                </Box>

                                <Box>
                                    <Text as="div" size="2" mb="2" weight="bold">Отчество</Text>
                                    <TextField.Root 
                                        placeholder="Отчество (если есть)" 
                                        size="3"
                                        {...register("middle_name")}
                                    >
                                        <TextField.Slot>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </TextField.Slot>
                                    </TextField.Root>
                                </Box>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                <Box>
                                    <Text as="div" size="2" mb="2" weight="bold">Пароль</Text>
                                    <TextField.Root 
                                        type="password"
                                        placeholder="Ваш пароль" 
                                        size="3" 
                                        {...register("password", { required: "Введите пароль",  minLength: { value: 6, message: "Минимум 6 символов" } })}
                                    >
                                        <TextField.Slot>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </TextField.Slot>
                                    </TextField.Root>
                                    {errors.password && (
                                        <Text color="red" size="1" mt="1">{errors.password.message}</Text>
                                    )}
                                </Box>

                                <Box>
                                    <Text as="div" size="2" mb="2" weight="bold">Повторите пароль</Text>
                                    <TextField.Root 
                                        type="password"
                                        placeholder="Повторите пароль" 
                                        size="3" 
                                        {...register("confirmPassword", 
                                            { 
                                                required: "Введите повторный пароль", 
                                                validate: (value, formValues) => value === formValues.password || "Пароли не совпадают",
                                                minLength: { value: 6, message: "Минимум 6 символов" }
                                            })}
                                    >
                                        <TextField.Slot>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </TextField.Slot>
                                    </TextField.Root>
                                    {errors.confirmPassword && (
                                        <Text color="red" size="1" mt="1">{errors.confirmPassword.message}</Text>
                                    )}
                                </Box>
                                </>
                            )}
                        </Flex>

                        <Flex direction="column" gap="3" mt="1">
                            <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" mt="6">
                                {step > 1 && (
                                    <Button 
                                        type="button" 
                                        variant="soft" 
                                        color="indigo" 
                                        size="3" 
                                        style={{ cursor: 'pointer', borderRadius: '12px', width: '50%', fontWeight: '600' }} 
                                        onClick={() => { clearErrors(); setError(''); setStep(step - 1); }}
                                    >
                                        Назад
                                    </Button>
                                )}

                                <Button 
                                    type={step === 3 ? "submit" : "button"} 
                                    variant="solid" 
                                    color="indigo" 
                                    size="3" 
                                    style={{ cursor: 'pointer', borderRadius: '12px', width: step > 1 ? '50%' : '100%' }} 
                                    onClick={() => { clearErrors(); setError(''); if (step < 3) setStep(step + 1); }}
                                >
                                    {step === 3 ? "Создать аккаунт" : "Далее"}
                                </Button>
                            </Flex>
                        
                            <Button variant="ghost" color="gray" size="2" style={{ cursor: 'pointer' }} onClick={() => { clearErrors(); setError(''); setMode('login'); }}>
                                Уже есть аккаунт? Войти
                            </Button>
                        </Flex>
                    </form>
                </Dialog.Content>
            )}
        </Dialog.Root>
    );
}