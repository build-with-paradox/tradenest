"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  perpage?: number; // Optional prop to set per page
};

const ReusableTable = <T,>({ columns, data, perpage = 5 }: TableProps<T>) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(perpage); // Use perpage prop here
  const [sorting, setSorting] = useState<{
    id: string;
    desc: boolean;
  }[]>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { pagination: { pageIndex, pageSize }, sorting },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        setPageIndex(updater({ pageIndex, pageSize }).pageIndex);
      }
    },
    onSortingChange: (newSorting) => {
      setSorting(newSorting); // Update the sorting state correctly
    },
    
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-300 backdrop-blur-md">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-4 px-6 text-left font-semibold text-gray-700 tracking-wide cursor-pointer"
                    onClick={() => {
                      const isDesc = sorting[0]?.id === header.id && sorting[0]?.desc;
                      setSorting([{ id: header.id, desc: !isDesc }]); // Toggle sorting direction
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {/* Sorting indicators */}
                    {sorting[0]?.id === header.id ? (
                      sorting[0]?.desc ? (
                        <span className="ml-2">↓</span>
                      ) : (
                        <span className="ml-2">↑</span>
                      )
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-100 transition duration-300 group"
                >
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column.columnDef;
                    const cellValue = flexRender(column.cell, cell.getContext());

                    // Check if the cell contains an image URL
                    if (column.id === "imageColumn" && typeof cellValue === "string") {
                      return (
                        <td key={cell.id} className="py-4 px-6 text-gray-900 group-hover:scale-105 transition">
                          <img
                            src={cellValue}
                            alt="Product"
                            className="max-w-[5rem] max-h-[5rem] rounded-md object-cover"
                          />
                        </td>
                      );
                    }

                    // Default cell rendering
                    return (
                      <td key={cell.id} className="py-4 px-6 text-gray-900 group-hover:scale-105 transition">
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          className="p-2 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: table.getPageCount() }, (_, index) => (
          <button
            key={index}
            onClick={() => table.setPageIndex(index)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              pageIndex === index
                ? "bg-gray-900 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="p-2 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ReusableTable;
