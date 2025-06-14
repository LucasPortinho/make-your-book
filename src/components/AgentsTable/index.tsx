'use client'

import { 
    ColumnDef, useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel 
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { IaModel } from "@/models/ia-model"

export type TableData = Pick<IaModel, 'name' | 'model'> & {
    style: string
    owner: string
}
const columns: ColumnDef<TableData>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "style",
        header: "Estilo", 
    },
    {
        accessorKey: "model",
        header: "Modelo",
    },
    {
        accessorKey: "owner",
        header: "Criador",
    }
]

type AgentsTableProps = {
    data: TableData[],
    title: string
}

export function AgentsTable({ data, title }: AgentsTableProps) {
    const [columnsFilterState, setColumnsFilterState] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnsFilterState,
        state: {
            columnFilters: columnsFilterState
        }
    })
    
    return (
        <>
            <h1 className="font-extrabold text-4xl self-center mt-10">{title}</h1>
            <div className="flex flex-1 flex-col items-center mb-20 justify-center">
                <div>
                    <div className="flex items-center py-4">
                        <Input 
                        placeholder="Pesquise pelo nome."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
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
                                        No results.
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
