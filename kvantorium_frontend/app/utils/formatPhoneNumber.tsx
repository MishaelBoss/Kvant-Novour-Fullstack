export const FormatPhoneNumber = (phone: string | undefined | null): string => {
    if (!phone) return 'не указано';
    
    const cleaned = ('' + phone).replace(/\D/g, '');
    
    const match = cleaned.match(/^(\d|7|8)(\d{3})(\d{3})(\d{2})(\d{2})$/);
    
    if (match) {
        return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }

    return phone;
};