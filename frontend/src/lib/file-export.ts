/**
 * Download a file from blob data
 * @param blob - Blob data to download
 * @param filename - Name of the file to download
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Generate a filename with timestamp
 * @param prefix - Prefix for the filename
 * @param extension - File extension (default: 'xlsx')
 * @returns Filename with timestamp
 */
export const generateExportFilename = (
  prefix: string,
  extension: string = 'xlsx'
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${prefix}_${timestamp}.${extension}`
}

/**
 * Handle export with loading state and error handling
 * @param exportFn - Export function that returns a promise with blob
 * @param filename - Name of the file to download
 * @param onSuccess - Optional success callback
 * @param onError - Optional error callback
 */
export const handleExport = async (
  exportFn: () => Promise<Blob>,
  filename: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    const blob = await exportFn()
    downloadFile(blob, filename)
    onSuccess?.()
  } catch (error) {
    console.error('Export error:', error)
    onError?.(error instanceof Error ? error : new Error('Export failed'))
  }
}
