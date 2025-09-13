import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type DatePickerProps = {
    value?: string | Date | null; // "YYYY-MM-DD" or Date
    onChange?: (value: string) => void; // returns "YYYY-MM-DD" or empty string
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    format?: 'short' | 'long' | 'iso';
};

function parseYYYYMMDDToLocalDate(value: string): Date | undefined {
    // Accepts "YYYY-MM-DD" (no time) and constructs a local Date (no timezone shift)
    if (!value) return undefined;
    const parts = value.split('-').map((p) => Number(p));
    if (parts.length !== 3 || parts.some(isNaN)) return undefined;
    const [year, month, day] = parts;
    // month - 1 because JS Date months are 0-indexed
    return new Date(year, month - 1, day);
}

function formatLocalDateToYYYYMMDD(d: Date | undefined | null): string {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    className = 'w-full',
    disabled = false,
    format = 'short',
}: DatePickerProps) {
    const [date, setDate] = useState<Date | undefined>(() => {
        if (!value) return undefined;
        if (typeof value === 'string') return parseYYYYMMDDToLocalDate(value) ?? undefined;
        if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
        return undefined;
    });
    const [isOpen, setIsOpen] = useState(false);

    // Keep internal date in sync when value prop changes
    useEffect(() => {
        if (!value) {
            setDate(undefined);
            return;
        }
        if (typeof value === 'string') {
            const parsed = parseYYYYMMDDToLocalDate(value);
            setDate(parsed);
        } else if (value instanceof Date) {
            // clone the date but keep only local Y-M-D
            setDate(new Date(value.getFullYear(), value.getMonth(), value.getDate()));
        } else {
            setDate(undefined);
        }
    }, [value]);

    const handleDateSelect = (selectedDate: Date | undefined | null) => {
        // Calendar may pass null/undefined when clearing
        if (!selectedDate) {
            setDate(undefined);
            setIsOpen(false);
            onChange?.('');
            return;
        }
        // Use only Y-M-D to avoid timezone shifts
        const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        setDate(localDate);
        setIsOpen(false);

        if (onChange) {
            onChange(formatLocalDateToYYYYMMDD(localDate));
        }
    };

    const formatDate = (d?: Date | undefined | null) => {
        if (!d) return placeholder;
        switch (format) {
            case 'long':
                return d.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            case 'iso':
                return formatLocalDateToYYYYMMDD(d);
            case 'short':
            default:
                return d.toLocaleDateString();
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`cursor-pointer justify-start text-left font-normal ${className} ${!date ? 'text-muted-foreground' : ''}`}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(date)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(d: Date | undefined | null) => handleDateSelect(d)} disabled={disabled} />
            </PopoverContent>
        </Popover>
    );
}
