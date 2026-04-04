'use client'
import { PAGES } from "@/app/config/page";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

interface DeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; 
}

export function DeleteConfirmModal({open, onOpenChange}: DeleteConfirmModalProps){
    const router = useRouter();

    const onDelete = async () => {
        router.push(PAGES.HOME());
        onOpenChange(false); 
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>            
            <Dialog.Content maxWidth="500px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Подтверждение удаление аккаунта</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    Все данные о вас будут далены через 14 дней, после этого их нельзя востановить!
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
                        onClick={onDelete}
                    >
                        Да, подверждаю
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}