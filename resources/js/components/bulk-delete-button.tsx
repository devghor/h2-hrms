import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkDeleteButtonProps {
    selectedCount: number;
    onDelete: () => void;
    label?: string;
}

export default function BulkDeleteButton({ selectedCount, onDelete, label = 'Delete Selected' }: BulkDeleteButtonProps) {
    if (selectedCount === 0) return null;

    return (
        <Button
            variant="destructive"
            size="sm"
            className="h-8 gap-1.5 text-sm font-normal"
            onClick={onDelete}
        >
            <Trash2 className="h-3.5 w-3.5" />
            {label} ({selectedCount})
        </Button>
    );
}
