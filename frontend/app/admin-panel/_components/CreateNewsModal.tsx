"use client";
import { InputWithClear } from "@/app/components/InputWithClear";
import { createNews, getCategories } from "@/app/lib/api";
import { ICategory, INews, INewsCreateInput } from "@/app/types/news.interface";
import { Dialog, Button, Flex, Box, Text } from "@radix-ui/themes";
import { PenLine } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";

interface CreateNewsModalProps {
    children: React.ReactNode;
    news: INews | null;
}

interface NewsFormValues extends Omit<INews, 'categories'> {
    categories: { value: number; label: string }[];
}

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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            methods.setValue('image', file);
            const url = URL.createObjectURL(file);

            if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
            setPreview(url);
        }
    }, [methods, preview]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: false,
        maxSize: 5242880, 
        disabled: !!preview

    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            methods.setValue('image', file);
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

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
                                <Box 
                                    {...getRootProps()}
                                    style={{ 
                                        position: 'relative',
                                        height: '180px',
                                        borderRadius: '16px',
                                        backgroundColor: 'var(--gray-3)',
                                        border: isDragActive ? '2px solid var(--blue-9)' : '2px dashed var(--gray-6)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <input {...getInputProps()} aria-label="Выберите изображение для загрузки" />

                                    {preview ? (
                                        <>
                                            <Image objectFit="cover" fill src={preview} alt="Preview" className="object-cover" />
                                            
                                            <Flex 
                                                className="image-overlay"
                                                align="center" 
                                                justify="center"
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    display: 'flex',
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
                                            <Text size="2" color={isDragActive ? "blue" : "gray"} weight={isDragActive ? "bold" : "regular"}>
                                                {isDragActive ? 'Бросайте картинку сюда!' : 'Нажмите или перетащите для загрузки'}
                                            </Text>
                                            <Text size="1" color="gray">JPG, PNG, WEBP до 5MB</Text>
                                        </Flex>
                                    )}
                                </Box>
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