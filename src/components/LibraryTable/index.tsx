'use client'

import { BookModel } from "@/models/book-model"
import { formatDatetime } from "@/utils/format-dates"
import { 
    ColumnDef, useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, 
    SortingState, getSortedRowModel, Row, ColumnFiltersState, getFilteredRowModel 
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"

export type TableData = Pick<BookModel, 'projectTitle' | 'modifiedAt' | 'id' > & {
    agentName: string;
}

const columns: ColumnDef<TableData>[] = [
    {
        accessorKey: "projectTitle",
        header: "Título",
    },
    {
        accessorKey: "modifiedAt",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Data <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },

        cell: ({ row }) => {
            const dateStr =  formatDatetime(row.getValue("modifiedAt"))
            return dateStr
        }
    },
    {
        accessorKey: "agentName",
        header: "Agente", 
    },
]

type LibraryTableProps = {
    data: TableData[],
    title: string
}

export function LibraryTable({ data, title }: LibraryTableProps) {
    const [sortingState, setSortingState] = useState<SortingState>([])
    const [columnsFilterState, setColumnsFilterState] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSortingState,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnsFilterState,
        state: {
            sorting: sortingState,
            columnFilters: columnsFilterState
        }
    })

    function handleClick(row: Row<TableData>) {
        redirect(`/home/my-books/${row.original.id}`) // TODO: redirect pro slug
    }
    
    return (
        <>
            <h1 className="font-extrabold text-4xl self-center mt-10">{title}</h1>
            <div className="flex flex-1 flex-col items-center mb-20 justify-center">
                <div>
                    <div className="flex items-center py-4">
                        <Input 
                        placeholder="Pesquise títulos."
                        value={(table.getColumn("projectTitle")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("projectTitle")?.setFilterValue(event.target.value)
                        }
                        className="w-xs mx-3 sm:w-sm lg:w-3xl"
                        />
                    </div>
                    <div className="rounded-md border w-xs mx-3 sm:w-sm lg:w-3xl">
                        <Table>

                            <TableHeader >  
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => handleClick(row)}
                                        className="cursor-pointer"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                        ))}
                                    </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Nada encontrado.
                                    </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4 mx-4">
                        <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        >
                        Anterior
                        </Button>
                        <Button
                        variant="default"
                        className="bg-blue-500 cursor-pointer disabled:cursor-not-allowed"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        >
                        Próximo
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
