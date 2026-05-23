'use client'
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface DeleteConfirmModalProps {
    children: React.ReactNode;
    title: string | undefined;
    onConfirm: () => Promise<void> | void;
}

export function DeleteConfirmModal({children, title, onConfirm}: DeleteConfirmModalProps){
    const [open, setOpen] = useState(false);

    const onDelete = async () => {
        try{
            await onConfirm();
            setOpen(false);
        } catch (error) {
            console.error('Не удалось удалить:', error);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="500px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Подтверждение удаления {title}</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Если вы это удалите, то вы не никогда можете восстановить
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
                        onClick={onDelete}
                    >
                        Удалить
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}