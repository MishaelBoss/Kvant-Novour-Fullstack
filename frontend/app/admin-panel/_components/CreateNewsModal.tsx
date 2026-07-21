"use client";
import { InputWithClear } from "@/app/components/InputWithClear";
import { createNews, getCategories } from "@/app/lib/api";
import { ICategory, INews, INewsCreateInput } from "@/app/types/news.interface";
import { Dialog, Button, Flex, Box, Text } from "@radix-ui/themes";
import { PenLine } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast";

interface CreateNewsModalProps {
    children: React.ReactNode;
    news: INews | null;
}

interface NewsFormValues extends Omit<INews, 'categories'> {
    categories: { value: number; label: string }[];
}

const VALID_MIME_TYPES = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function CreateNewsModal({children, news}: CreateNewsModalProps){
    const [categories, setCategories] = useState<ICategory[]>([]); 
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(typeof news?.image === 'string' ? news.image : null);

    const methods = useForm<NewsFormValues>({
        defaultValues: {
            title: news?.title || '',
            content: news?.content || '',
            image: news?.image || null,
            categories: news?.categories || []
        }
    }); 

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

        methods.setValue('image', file);
        const url = URL.createObjectURL(file);

        setPreview((prevPreview) => {
            if (prevPreview?.startsWith('blob:')) URL.revokeObjectURL(prevPreview);
            return url;
        });
    }, [methods]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: VALID_MIME_TYPES,
        multiple: false,
        maxSize: MAX_SIZE_BYTES, 
        disabled: !!preview
    });

    useEffect(() => {
        if (news) {
            methods.reset({
                title: news.title || '',
                content: news.content || '',
                image: news.image,
                categories: news?.categories || []
            });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(typeof news.image === 'string' ? news.image : null);
        }
    }, [news, methods]);

    useEffect(() => {
        const loadCats = async () => {
            const data = await getCategories();

            setCategories(data.results);
        };
        loadCats();

        return () => {
            if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
        }
    }, [preview]);

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
        
        setPreview(null);
        methods.setValue('image', null);
    };

    const onSubmit = async (data: NewsFormValues) => {
        const payload: INewsCreateInput = {
            ...data,
            category_ids: data.categories.map(c => c.value),
        };
        
        const isSuccess = await createNews(payload); 
        if(isSuccess) setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>{children}</Dialog.Trigger>
            
            <Dialog.Content maxWidth="380px" style={{ borderRadius: '24px', padding: '28px' }}>
                <Dialog.Title size="6" mb="1">Добавить новость</Dialog.Title>
                <Dialog.Description size="2" mb="5" color="gray">Создание нового поста</Dialog.Description>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            <InputWithClear 
                                label="Назване" 
                                name="title" 
                                placeholder="Введите название новостей"
                                rules={{ required: "Обязательно" }}
                                icon={<PenLine size={16} />}
                            />

                            <InputWithClear 
                                label="Содержание" 
                                name="content" 
                                placeholder="Введите Содержание"
                                rules={{ required: "Обязательно" }}
                                icon={<PenLine size={16} />} 
                            />

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Обложка</Text>
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
                                            position: 'relative',
                                            height: '180px',
                                            borderRadius: '16px',
                                            borderWidth: '2px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: preview ? 'default' : 'pointer',
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

                            <Box>
                                <Text as="div" size="2" mb="2" weight="bold">Категории</Text>
                                <Controller
                                    name="categories"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            isMulti
                                            options={categories || []}
                                            placeholder="Выберите категории..."
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '12px',
                                                    padding: '2px',
                                                    borderColor: 'var(--gray-6)',
                                                }),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Flex>

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
                                color="indigo" 
                                size="3" 
                                style={{ cursor: 'pointer', borderRadius: '12px', flex: 1, fontWeight: '600' }}
                            >
                                Сохранить
                            </Button>
                        </Flex>
                    </form>
                </FormProvider>
            </Dialog.Content>
        </Dialog.Root>
    );
}