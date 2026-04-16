'use client';

import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface ModelConfirmAddFormProps {
    children: React.ReactNode;
    onPublish(): Promise<void>;
    isActive: boolean;
}

export function ModelConfirmAddForm({children, onPublish, isActive}: ModelConfirmAddFormProps){
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
        await onPublish();
        setOpen(false);
    };


    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="500px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">
                    {isActive ? 'Снятие формы с публикации' : 'Подтверждение публикации'}
                </Dialog.Title>
                
                <Dialog.Description size="2" mb="5" color="gray">
                    {isActive 
                        ? 'Вы уверены, что хотите снять форму с публикации? Она станет недоступна для пользователей.' 
                        : 'После подтверждения форма появится в общем доступе и в ленте новостей.'}
                </Dialog.Description>

                <Flex direction="row" gap="3" mt="6" width="100%">
                    <Button 
                        type="button"
                        variant="soft" 
                        color="gray" 
                        size="3" 
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={() => setOpen(false)}>
                        Отмена
                    </Button>

                    <Button 
                        type="button"
                        variant="solid" 
                        color={isActive ? "red" : "indigo"} 
                        size="3" 
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={handleConfirm}>
                        {isActive ? 'Снять с публикации' : 'Опубликовать'}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}