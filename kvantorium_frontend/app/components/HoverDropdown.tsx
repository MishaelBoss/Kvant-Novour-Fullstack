import { ReactNode, useRef, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface HoverDropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    sideOffset?: number;
}

export const HoverDropdown = ({ trigger, children, sideOffset = 5 }: HoverDropdownProps) => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef<number>(0);

    const handleOpen = () => {
        window.clearTimeout(timerRef.current);
        setOpen(true);
    };

    const handleClose = () => {
        timerRef.current = window.setTimeout(() => {
        setOpen(false);
        }, 150);
    };

    return (
        <div onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
            <DropdownMenu.Trigger asChild>
            {trigger}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
            <DropdownMenu.Content
                className="DropdownMenuContent"
                sideOffset={sideOffset}
                onMouseEnter={handleOpen}
            >
                {children}
                <DropdownMenu.Arrow className="DropdownMenuArrow" fill="white" />
            </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
        </div>
    );
};