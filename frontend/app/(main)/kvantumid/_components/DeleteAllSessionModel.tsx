"use client";

import { deleteAllSessions } from "@/app/lib/api";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

interface DeleteAllSessionModelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteAllSessionModel({open, onOpenChange}: DeleteAllSessionModelProps){
    const router = useRouter();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            
            <Dialog.Content maxWidth="500px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Завершить все сеансы?</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Вы будете выведены из аккаунта на всех устройствах, включая это
                </Dialog.Description>
                <Flex direction="row" gap="3" mt="6" width="100%">
                    <Button 
                        type="button"
                        variant="soft" 
                        color="indigo" 
                        size="3" 
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={() => onOpenChange(false)}
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
                            await deleteAllSessions();
                            onOpenChange(false);
                            router.replace('/');
                        }}
                    >
                        Завершить
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}