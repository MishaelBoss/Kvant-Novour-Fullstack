'use client'
import { InputWithClear } from "@/app/components/InputWithClear";
import { createUser } from "@/app/lib/api";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { RadioGroup } from "radix-ui";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { IUser } from "@/app/types/user.interface";

interface CreateUserModalProps {
    children: React.ReactNode;
    user: IUser | null;
}

export function CreateUserModal({children, user}: CreateUserModalProps){
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

    const methods = useForm<IUser>({
        defaultValues: {
            username: user?.username || '',
            password: user?.password || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            middle_name: user?.middle_name || '',
            phone: user?.phone || '',
            role: user?.role || 'user',
        }
    }); 

    const onSubmit = async (data: IUser) => {
        if (step === 1) {
            setStep(2);
            return;
        }

        if (step === 2) {
            setStep(3);
            return;
        }

        const success = await createUser(data);
        if (success) {
            setOpen(false);
            setStep(1);
            methods.reset();
        }
    };

    const stepTitles: Record<number, string> = {
        1: "Шаг 1: Аккаунт",
        2: "Шаг 2: Личные данные",
        3: "Шаг 3: Личные контакты",
    };
    
    return (
        <Dialog.Root open={open} onOpenChange={(v) => { setOpen(v); if(!v) setStep(1); }}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">{stepTitles[step]}</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">Создание нового аккаунта</Dialog.Description>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            {step === 1 && (
                                <>
                                    <InputWithClear label="Логин" name="username" rules={{ required: "Обязательно" }} />
                                    <InputWithClear label="Пароль" name="password" rules={{ required: "Обязательно" }} />
                                    
                                    <Controller name="role" control={methods.control} render={({ field }) => (
                                        <RadioGroup.Root value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-4">
                                            {[
                                                { value: 'user', label: 'Пользователь' },
                                                { value: 'student', label: 'Ученик' },
                                                { value: 'parent', label: 'Родитель' },
                                                { value: 'teacher', label: 'Преподаватель' },
                                            ].map((role) => (
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
                                    )}/>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <InputWithClear label="Имя" name="first_name" rules={{ required: "Обязательно" }} />
                                    <InputWithClear label="Фамилия" name="last_name" rules={{ required: "Обязательно" }} />
                                    <InputWithClear label="Отчество" name="middle_name" />
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <InputWithClear label="Телефон" name="phone" />
                                    <InputWithClear label="Email" name="email" />
                                </>
                            )}
                        </Flex>

                        <Flex direction="row" gap="3" mt="6">
                            <Button type="button" variant="soft" onClick={() => step > 1 ? setStep(step - 1) : setOpen(false)}>
                                {step > 1 ? "Назад" : "Отмена"}
                            </Button>

                            <Button type={step === 3 ? "submit" : "button"} variant="solid" onClick={() => step < 3 && setStep(step + 1)}>
                                {step === 3 ? "Сохранить" : "Далее"}
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    );
};