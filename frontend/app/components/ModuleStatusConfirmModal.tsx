"use client";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface ModuleStatusConfirmModalProps {
    children: React.ReactNode;
    studentName: string;
    status: 'completed' | 'failed';
    onConfirm: () => Promise<void> | void;
}

export function ModuleStatusConfirmModal({ children, studentName, status, onConfirm }: ModuleStatusConfirmModalProps) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const passed = status === 'completed';

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>

            <Dialog.Content maxWidth="440px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="5" mb="1">
                    {passed ? 'Подтвердите завершение модуля' : 'Подтвердите результат'}
                </Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">
                    {passed
                        ? <>Ученик <b>{studentName}</b> успешно прошёл модуль? Он будет удалён из состава группы и попадёт в историю со статусом «Прошёл модуль».</>
                        : <>Ученик <b>{studentName}</b> не прошёл модуль? Он будет удалён из состава группы и попадёт в историю со статусом «Не прошёл модуль».</>}
                </Dialog.Description>
                <Flex direction="row" gap="3" mt="6" width="100%">
                    <Button
                        type="button"
                        variant="soft"
                        color="gray"
                        size="3"
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={() => setOpen(false)}
                        disabled={submitting}
                    >
                        Отмена
                    </Button>

                    <Button
                        type="button"
                        variant="solid"
                        color={passed ? 'green' : 'red'}
                        size="3"
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={handleConfirm}
                        disabled={submitting}
                    >
                        {submitting ? '...' : passed ? 'Прошёл' : 'Не прошёл'}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
