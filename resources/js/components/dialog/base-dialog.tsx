import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';

type BaseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    children: React.ReactNode;
    className?: string;
};

export function BaseDialog({
    open,
    onOpenChange,
    title,
    description,
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    children,
    className,
}: BaseDialogProps) {
    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    {children}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            {cancelLabel}
                        </Button>
                        <Button type="submit">{submitLabel}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
