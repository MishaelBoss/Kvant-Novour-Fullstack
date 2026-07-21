"use client";
import { Dialog, Button, Flex, Box, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast";

interface Props {
    children: React.ReactNode;
    onPublish(imageFile: File | null): Promise<void>; 
    isActive: boolean;
}

const VALID_MIME_TYPES = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ModelConfirmAddForm({ children, onPublish, isActive }: Props) {
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            const error = fileRejections[0].errors[0];

            if (error.code === 'file-invalid-type') toast.error('Пожалуйста, выберите изображение в формате JPEG, PNG или WEBP.');
            else if (error.code === 'file-too-large') toast.error('Размер файла не должен превышать 5 МБ.');
            else toast.error('Ошибка при загрузке файла.');
            return;
        }

        const file = acceptedFiles[0];
        if (!file) {
            toast.error('Файл не поддерживается или не выбран.');
            return;
        }

        setImageFile(file);
        const url = URL.createObjectURL(file);

        setPreview((prevPreview) => {
            if (prevPreview?.startsWith('blob:')) URL.revokeObjectURL(prevPreview);
            return url;
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: VALID_MIME_TYPES,
        multiple: false,
        maxSize: MAX_SIZE_BYTES, 
        disabled: !!preview
    });

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);

        setPreview(null);
        setImageFile(null);
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
                        <div {...getRootProps()} style={{ position: 'relative' }}>
                            <motion.div 
                                animate={{ 
                                    scale: isDragActive ? 1.02 : 1,
                                    backgroundColor: isDragActive ? 'var(--blue-2)' : 'var(--gray-3)',
                                    borderColor: isDragActive ? 'var(--blue-9)' : 'var(--gray-6)',
                                    borderStyle: isDragActive ? 'solid' : 'dashed'
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                style={{ 
                                    position: 'relative', height: '180px', borderRadius: '16px',
                                    backgroundColor: 'var(--gray-3)', border: '2px dashed var(--gray-6)',
                                    overflow: 'hidden', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer'
                                }}
                            >
                                <input {...getInputProps()} aria-label="Выберите изображение для загрузки" />

                                <AnimatePresence mode="wait">
                                    {preview ? (
                                        <motion.div
                                            key="image-preview"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.25, ease: 'easeOut' }}
                                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                                        >
                                            <Image 
                                                fill 
                                                src={preview} 
                                                alt="Preview" 
                                                style={{ objectFit: 'cover' }}
                                            />                                                    
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ duration: 0.15 }}
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button color="red" variant="solid" onClick={removeImage} size="2">
                                                        Удалить фото
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="dropzone-placeholder"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Flex direction="column" align="center" gap="1">
                                                <Text size="2" color={isDragActive ? "blue" : "gray"} weight={isDragActive ? "bold" : "regular"}>
                                                    {isDragActive ? 'Бросайте картинку сюда!' : 'Нажмите или перетащите для загрузки'}
                                                </Text>
                                                <Text size="1" color="gray">JPG, PNG, WEBP до 5MB</Text>
                                            </Flex>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div >
                        </div>
                    </Box>
                )}

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
                        variant="solid" 
                        color={isActive ? "red" : "indigo"} 
                        size="3" 
                        style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                        onClick={handleConfirm}
                    >
                        {isActive ? 'Подтвердить' : 'Опубликовать'}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}