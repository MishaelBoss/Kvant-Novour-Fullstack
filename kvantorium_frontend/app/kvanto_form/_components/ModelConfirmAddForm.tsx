'use client';

import { Dialog, Button, Flex, Box, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useRef, useState } from "react";

interface ModelConfirmAddFormProps {
    children: React.ReactNode;
    onPublish(imageFile: File | null): Promise<void>; 
    isActive: boolean;
}

export function ModelConfirmAddForm({ children, onPublish, isActive }: ModelConfirmAddFormProps) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleConfirm = async () => {
        await onPublish(imageFile);
        setOpen(false);
        setPreview(null);
        setImageFile(null);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="400px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">
                    {isActive ? 'Снять с публикации' : 'Публикация опроса'}
                </Dialog.Title>
                
                <Dialog.Description size="2" mb="4" color="gray">
                    {isActive 
                        ? 'Форма станет недоступна для новых участников.' 
                        : 'Форма будет опубликована, и создастся новость в ленте.'}
                </Dialog.Description>

                {!isActive && (
                    <Box mt="4">
                        <Text as="div" size="2" mb="2" weight="bold">Обложка для новости</Text>
                        <Box 
                            style={{ 
                                position: 'relative', height: '180px', borderRadius: '16px',
                                backgroundColor: 'var(--gray-3)', border: '2px dashed var(--gray-6)',
                                overflow: 'hidden', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', cursor: 'pointer'
                            }}
                        >
                            {preview ? (
                                <>
                                    <Image objectFit="cover" fill src={preview} alt="Preview" className="object-cover" />
                                    <Flex 
                                        align="center" justify="center"
                                        style={{
                                            position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
                                            opacity: 0, transition: 'opacity 0.2s', display: 'flex',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                                    >
                                        <Button color="red" variant="solid" onClick={removeImage} size="2">
                                            Удалить фото
                                        </Button>
                                    </Flex>
                                </>
                            ) : (
                                <Flex direction="column" align="center" gap="1">
                                    <Text size="2" color="gray">Нажмите для загрузки</Text>
                                    <Text size="1" color="gray">Картинка для ленты новостей</Text>
                                </Flex>
                            )}

                            {!preview && (
                                <input 
                                    ref={fileInputRef}
                                    type="file" accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            )}
                        </Box>
                    </Box>
                )}

                <Flex direction="row" gap="3" mt="6" width="100%">
                    <Button variant="soft" color="gray" size="3" style={{ flex: 1, cursor: 'pointer' }} onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button 
                        variant="solid" 
                        color={isActive ? "red" : "indigo"} 
                        size="3" 
                        style={{ flex: 1, cursor: 'pointer' }} 
                        onClick={handleConfirm}
                    >
                        {isActive ? 'Подтвердить' : 'Опубликовать'}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}