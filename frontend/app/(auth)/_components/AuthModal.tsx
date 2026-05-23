'use client';
import { Dialog, Button, Flex, Text, TextField, Box, Callout } from "@radix-ui/themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login, register as registerApi } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { PAGES } from "@/app/config/pages.config";
import { IUserRegister, IUserLogin } from "@/app/types/user.interface";
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export function AuthModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false); 
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPass, setShowPass] = useState(false);
    const isLogin = mode === 'login';
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, trigger, formState: { errors }, reset, clearErrors } = useForm<IUserRegister>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const onSubmit = async (data: IUserLogin | IUserRegister) => {
        //reset();
        clearErrors(); 
        //setStep(1);
        setShowPass(false);
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(data as IUserLogin);
            } else {
                await registerApi(data as IUserRegister);
            }

            setIsLoading(false);
            router.push(PAGES.MY_PROFILE());
        } catch(error: unknown) {
            let errorMessage = 'Произошла ошибка. Попробуйте снова.';
            const responseData = (error as any)?.response?.data;
            
            if (responseData) {
                if (responseData.username?.[0]) errorMessage = responseData.username[0];
                else if (responseData.email?.[0]) errorMessage = responseData.email[0];
                else if (responseData.password?.[0]) errorMessage = responseData.password[0];
                else if (responseData.non_field_errors?.[0]) errorMessage = responseData.non_field_errors[0];
            }
            
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const stepTitles: Record<number, string> = {
        1: "Шаг 1: Аккаунт",
        2: "Шаг 2: ФИО",
        3: "Шаг 3: Подтверждение"
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof IUserRegister)[] = [];
        if (step === 1) fieldsToValidate = ['username', 'email'];
        if (step === 2) fieldsToValidate = ['first_name', 'last_name'];
        if (step === 3) fieldsToValidate = ['password', 'confirmPassword'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid && step < 3) {
            setStep(step + 1);
        }
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
                setShowPass(false);
            }
        }}>
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
                                        <User size={16} />
                                    </TextField.Slot>
                                </TextField.Root>
                                {errors.username && (
                                    <Text color="red" size="1" mt="1">{errors.username.message}</Text>
                                )}
                            </Box>

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Пароль</Text>
                                <TextField.Root 
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Ваш пароль" 
                                    size="3" 
                                    {...register("password", { required: "Введите пароль", minLength: 6 })}
                                >
                                    <TextField.Slot>
                                        <Lock size={16} />
                                    </TextField.Slot>

                                    <button
                                        className="flex items-center justify-center gap-10 text-[#a0a0a0] cursor-pointer p-1"
                                        type="button"
                                        onClick={() => setShowPass(p => !p)}
                                        aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
                                    >
                                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </TextField.Root>
                                {errors.password && (
                                    <Text color="red" size="1" mt="1">{errors.password.message}</Text>
                                )}
                            </Box>
                        </Flex>

                        <Flex direction="column" gap="3" mt="6">
                            <Button type="submit" disabled={isLoading} variant="solid" color="indigo" size="3" aria-label="Войти" style={{ cursor: 'pointer', borderRadius: '12px' }}>
                                {isLoading ? 'Загрузка...' : 'Войти'}
                            </Button>
                        
                            <Button variant="ghost" color="gray" size="2" style={{ cursor: 'pointer' }} aria-label="Нет аккаунта? Зарегистрироваться" onClick={() => { clearErrors(); setError(''); setMode('register'); setShowPass(false);}}>
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
                                            <User size={16} />
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
                                            <Mail size={16} />
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
                                            <User size={16} />
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
                                            <User size={16} />
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
                                            <User size={16} />
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
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Ваш пароль" 
                                        size="3" 
                                        {...register("password", { required: "Введите пароль",  minLength: { value: 8, message: "Минимум 8 символов" } })}
                                    >
                                        <TextField.Slot>
                                            <Lock size={16} />
                                        </TextField.Slot>

                                        <button
                                            className="flex items-center justify-center gap-10 text-[#a0a0a0] cursor-pointer p-1"
                                            type="button"
                                            onClick={() => setShowPass(p => !p)}
                                            aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
                                        >
                                            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
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
                                                minLength: { value: 8, message: "Минимум 8 символов" }
                                            })}
                                    >
                                        <TextField.Slot>
                                            <Lock size={16} />
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
                                        onClick={() => { setStep(step - 1); }}
                                    >
                                        Назад
                                    </Button>
                                )}

                                <Button 
                                    type={step === 3 ? "submit" : "button"} 
                                    disabled={isLoading}
                                    variant="solid" 
                                    color="indigo" 
                                    size="3" 
                                    style={{ cursor: 'pointer', borderRadius: '12px', width: step > 1 ? '50%' : '100%' }} 
                                    onClick={() => { if (step === 3) return; nextStep(); }}
                                    aria-label={`${step === 3 ? "Создать аккаунт" : "Далее"}`}
                                >
                                    {isLoading ? 'Загрузка...' : step === 3 ? "Создать аккаунт" : "Далее"}
                                </Button>
                            </Flex>
                        
                            <Button variant="ghost" color="gray" size="2" style={{ cursor: 'pointer' }}  aria-label="Уже есть аккаунт? Войти" onClick={() => { clearErrors(); setError(''); setMode('login'); }}>
                                Уже есть аккаунт? Войти
                            </Button>
                        </Flex>
                    </form>
                </Dialog.Content>
            )}
        </Dialog.Root>
    );
}