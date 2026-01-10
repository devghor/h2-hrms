import { useState } from 'react'
import { handleExport, generateExportFilename } from '@/lib/file-export'
import { toast } from 'sonner'

interface UseExportOptions {
  /**
   * Success message to show after export
   */
  successMessage?: string
  /**
   * Error message to show on export failure
   */
  errorMessage?: string
  /**
   * Callback to run on successful export
   */
  onSuccess?: () => void
  /**
   * Callback to run on export error
   */
  onError?: (error: Error) => void
}

interface UseExportReturn {
  /**
   * Whether the export is in progress
   */
  isExporting: boolean
  /**
   * Function to trigger the export
   */
  exportData: (exportFn: () => Promise<Blob>, filenamePrefix: string) => Promise<void>
}

/**
 * Custom hook for handling data exports
 * @param options - Export options
 * @returns Export state and function
 */
export function useExport(options: UseExportOptions = {}): UseExportReturn {
  const {
    successMessage = 'Data exported successfully',
    errorMessage = 'Failed to export data',
    onSuccess,
    onError,
  } = options

  const [isExporting, setIsExporting] = useState(false)

  const exportData = async (exportFn: () => Promise<Blob>, filenamePrefix: string) => {
    setIsExporting(true)
    await handleExport(
      exportFn,
      generateExportFilename(filenamePrefix),
      () => {
        toast.success(successMessage)
        setIsExporting(false)
        onSuccess?.()
      },
      (error) => {
        toast.error(error.message || errorMessage)
        setIsExporting(false)
        onError?.(error)
      }
    )
  }

  return {
    isExporting,
    exportData,
  }
}
