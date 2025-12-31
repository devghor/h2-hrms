import React from 'react'
import { DataGrid, createColumns, createSelectionColumn } from '@/components/data-grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-react'

// Simple example without URL state sync
type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

const sampleProducts: Product[] = [
  { id: '1', name: 'Laptop', category: 'Electronics', price: 999, stock: 15, status: 'in-stock' },
  { id: '2', name: 'Mouse', category: 'Accessories', price: 29, stock: 3, status: 'low-stock' },
  { id: '3', name: 'Keyboard', category: 'Accessories', price: 79, stock: 0, status: 'out-of-stock' },
]

export function SimpleProductsTable() {
  const columns = [
    createSelectionColumn<Product>(),
    ...createColumns<Product>([
      {
        accessorKey: 'name',
        header: 'Product Name',
        options: { sortable: true },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        options: { sortable: true },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        options: {
          align: 'right',
          sortable: true,
          customRender: (value) => `$${Number(value).toFixed(2)}`,
        },
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        options: {
          align: 'right',
          sortable: true,
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        options: {
          align: 'center',
          customRender: (value) => {
            const variants = {
              'in-stock': 'default',
              'low-stock': 'secondary',
              'out-of-stock': 'destructive',
            } as const
            return (
              <Badge variant={variants[value as keyof typeof variants]}>
                {String(value).replace('-', ' ')}
              </Badge>
            )
          },
        },
      },
    ]),
  ]

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Products</h2>
          <p className='text-muted-foreground'>Manage your product inventory</p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Product
        </Button>
      </div>

      <DataGrid
        data={sampleProducts}
        columns={columns}
        options={{
          enableRowSelection: true,
          searchPlaceholder: 'Search products...',
          searchKey: 'name',
          filters: [
            {
              columnId: 'category',
              title: 'Category',
              options: [
                { label: 'Electronics', value: 'Electronics' },
                { label: 'Accessories', value: 'Accessories' },
              ],
            },
            {
              columnId: 'status',
              title: 'Status',
              options: [
                { label: 'In Stock', value: 'in-stock' },
                { label: 'Low Stock', value: 'low-stock' },
                { label: 'Out of Stock', value: 'out-of-stock' },
              ],
            },
          ],
          customBulkActions: ({ table }) => {
            const selectedCount = table.getFilteredSelectedRowModel().rows.length
            if (selectedCount === 0) return null

            return (
              <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
                <div className='rounded-lg border bg-card p-4 shadow-lg'>
                  <p className='mb-3 text-sm font-medium'>
                    {selectedCount} product{selectedCount > 1 ? 's' : ''} selected
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => {
                        console.log('Delete selected products')
                        table.resetRowSelection()
                      }}
                    >
                      <Trash className='mr-2 h-4 w-4' />
                      Delete
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => table.resetRowSelection()}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )
          },
        }}
      />
    </div>
  )
}

// Server-side example
export function ServerSideProductsTable() {
  const [data, setData] = React.useState<Product[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  const fetchProducts = async (page: number, pageSize: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/products?page=${page}&pageSize=${pageSize}`
      )
      const result = await response.json()
      setData(result.data)
      setTotalCount(result.total)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = createColumns<Product>([
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'category', header: 'Category' },
    {
      accessorKey: 'price',
      header: 'Price',
      options: {
        align: 'right',
        customRender: (value) => `$${Number(value).toFixed(2)}`,
      },
    },
  ])

  return (
    <DataGrid
      data={data}
      columns={columns}
      options={{
        serverSide: true,
        rowCount: totalCount,
        onPaginationChange: fetchProducts,
        onSortChange: (columnId, direction) => {
          console.log('Sort:', columnId, direction)
          // Implement server-side sorting
        },
        onFilterChange: (filters) => {
          console.log('Filters:', filters)
          // Implement server-side filtering
        },
      }}
    />
  )
}
