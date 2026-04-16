'use client';

import { useAuth } from "@/app/context/AuthContext";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface LogoutConfirmModelProps {
    children: React.ReactNode;
}

export function LogoutConfirmModel({children}: LogoutConfirmModelProps){
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="500px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Подтверждение выхода из аккаунта</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Если выдите из аккаунта, вы всегда можите вернутся
                </Dialog.Description>
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
                        color="red" 
                        size="3" 
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={logout}
                    >
                        Выйти
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}