"use client";
import { deleteSession } from "@/app/lib/api";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { ApiError } from "next/dist/server/api-utils";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
    session_id: number;
    fetchSessions: () => void;
    children: React.ReactNode;
}

export function DeleteSessionModel({children, session_id, fetchSessions}: Props){
    const [open, setOpen] = useState(false);

    const handleDelete = async (id: number) => {
        try {
            const success = await deleteSession(id);
            
            if (success) {
                toast.success("Сессия успешно удалена");
                fetchSessions();
            }
        } catch (error) {
            if (error instanceof ApiError) toast.error(error.message);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="500px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Выйти из аккаунта на устройстве?</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Если вы удалите этот сеанс, вы всегда можете войти снова
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
                        onClick={async () => {
                            await handleDelete(session_id);
                        }}
                    >
                        Выйти
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}