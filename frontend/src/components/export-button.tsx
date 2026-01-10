import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { handleExport, generateExportFilename } from '@/lib/file-export'
import { toast } from 'sonner'

interface ExportButtonProps {
  /**
   * Function that returns a promise with the blob data
   */
  exportFn: () => Promise<Blob>
  /**
   * Prefix for the generated filename
   */
  filenamePrefix: string
  /**
   * Button variant
   */
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /**
   * Button text when not exporting
   */
  text?: string
  /**
   * Button text when exporting
   */
  loadingText?: string
  /**
   * Success message to show after export
   */
  successMessage?: string
  /**
   * Error message to show on export failure
   */
  errorMessage?: string
  /**
   * Custom class name for the button
   */
  className?: string
  /**
   * Whether to show the download icon
   */
  showIcon?: boolean
  /**
   * Disable the button
   */
  disabled?: boolean
}

export function ExportButton({
  exportFn,
  filenamePrefix,
  variant = 'outline',
  size = 'default',
  text = 'Export',
  loadingText = 'Exporting...',
  successMessage = 'Data exported successfully',
  errorMessage = 'Failed to export data',
  className,
  showIcon = true,
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleClick = async () => {
    setIsExporting(true)
    await handleExport(
      exportFn,
      generateExportFilename(filenamePrefix),
      () => {
        toast.success(successMessage)
        setIsExporting(false)
      },
      (error) => {
        toast.error(error.message || errorMessage)
        setIsExporting(false)
      }
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isExporting || disabled}
      className={className}
    >
      {showIcon && <Download className='mr-2 h-4 w-4' />}
      {isExporting ? loadingText : text}
    </Button>
  )
}
