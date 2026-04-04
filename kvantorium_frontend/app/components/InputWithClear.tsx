import React, { useState } from "react";
import { TextField, Box, Text } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";

interface Props {
    label: string;
    name: string;
    placeholder?: string;
    icon?: React.ReactNode;
    rules?: object;
}

export const InputWithClear = ({ label, name, placeholder, icon, rules }: Props) => {
    const { register, setValue, watch } = useFormContext();
    const [isFocused, setIsFocused] = useState(false);

    const value = watch(name);
    const showClear = isFocused && value;

    return (
        <Box mb="2">
            <Text as="div" size="2" mb="2" weight="bold">{label}</Text>
            <TextField.Root
                placeholder={placeholder}
                size="3"
                {...register(name, rules)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            >
                {icon && <TextField.Slot>{icon}</TextField.Slot>}

                {showClear && (
                <TextField.Slot
                    side="right"
                    style={{ cursor: "pointer" }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setValue(name, "");
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </TextField.Slot>
                )}
            </TextField.Root>
        </Box>
    );
};
