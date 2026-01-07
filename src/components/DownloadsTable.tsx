"use client";

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Download,
    Filter,
    Search,
    ArrowDown,
    ArrowUp,
    MoveRight
} from 'lucide-react';
import { useDownloadsTableItems, DownloadItem } from '@/hooks/useDownloadsTableItems';

interface DownloadsTableProps {
    data: DownloadItem[];
    title?: string;
    className?: string;
}

// Helper to format bytes
function formatBytes(bytes: string | number | undefined, decimals = 0) {
    if (!bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];

    // If it's a string, try to parse it. If it's already formatted (e.g. "1.2 MB"), return as is.
    if (typeof bytes === 'string' && isNaN(Number(bytes))) return bytes;

    const i = Math.floor(Math.log(Number(bytes)) / Math.log(k));

    return parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function DownloadsTable({ data, title = "Downloads", className }: DownloadsTableProps) {
    const {
        items,
        searchQuery,
        setSearchQuery,
        productCategoryFilter,
        setProductCategoryFilter,
        fileTypeFilter,
        setFileTypeFilter,
        productCategories,
        uniqueFileTypes,
        sortConfig,
        handleSort,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredTotal,
        totalItems,
    } = useDownloadsTableItems({ initialItems: data });

    return (
        <div className={`w-full font-sans text-slate-800 ${className || ''}`}>

            {/* Title Section (Optional, can be removed if handled by parent) */}
            {/* <div className="mb-8">
                <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">— Commercial Portal</div>
                <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
                <p className="text-slate-500 mt-2">Find the assets and documentation that you need.</p>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
                {/* Sidebar Filters */}
                <aside className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-5 w-5 text-slate-900" />
                        <h2 className="text-xl font-medium text-slate-900">Filters</h2>
                    </div>
                    <div className="text-sm text-slate-500 mb-8 pl-0.5">
                        Showing {filteredTotal} of {totalItems}
                    </div>

                    {/* Search */}
                    <div className="relative mb-10 group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-slate-300 focus:border-slate-800 focus:outline-none transition-colors rounded-none placeholder:text-slate-400 text-sm"
                        />
                    </div>

                    {/* Filetype Filter */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4">— Filetype</h3>
                        <div className="flex flex-wrap gap-2">
                            {['All', ...uniqueFileTypes].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFileTypeFilter(type === fileTypeFilter ? 'All' : type)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${(type === 'All' && fileTypeFilter === 'All') || type === fileTypeFilter
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4">— Category</h3>
                        <div className="flex flex-wrap gap-2">
                            {['All Products', ...productCategories].map(cat => {
                                const value = cat === 'All Products' ? 'All' : cat;
                                const isActive = productCategoryFilter === value;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setProductCategoryFilter(isActive && value !== 'All' ? 'All' : value)}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Content - Table */}
                <div className="flex flex-col min-h-[600px]">
                    <div className="rounded-none border-none">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="w-[45%] pl-0">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1 hover:text-slate-600"
                                        >
                                            Name
                                            {sortConfig?.field === 'name' && (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="">
                                        <button
                                            onClick={() => handleSort('filesize')}
                                            className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1 hover:text-slate-600"
                                        >
                                            Filesize
                                            {sortConfig?.field === 'filesize' && (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="">
                                        <button
                                            onClick={() => handleSort('fileType')}
                                            className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1 hover:text-slate-600"
                                        >
                                            Filetype
                                            {sortConfig?.field === 'fileType' && (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right pr-0">
                                        <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">Link</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <TableRow key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80 group">
                                            <TableCell className="pl-0 py-4 align-top">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700 group-hover:text-rose-500 transition-colors">
                                                        {item.name}
                                                    </span>
                                                    {/* Optional description or filename if needed */}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 align-top text-slate-500 text-sm">
                                                {formatBytes(item.filesize)}
                                            </TableCell>
                                            <TableCell className="py-4 align-top text-slate-900 font-medium text-sm">
                                                {item.fileType}
                                            </TableCell>
                                            <TableCell className="text-right pr-0 py-4 align-top">
                                                <a
                                                    href={item.downloadUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors"
                                                >
                                                    <span className="mr-2">Download</span>
                                                    <div className="flex flex-col items-center">
                                                        <ArrowDown className="h-3 w-3" />
                                                        <div className="w-3 h-[1px] bg-current mt-[1px]"></div>
                                                    </div>
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>


                    {/* Shadcn Pagination */}
                    {items.length > 0 && totalPages > 1 && (
                        <div className="mt-8 flex justify-end">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                                            }}
                                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        // Simple logic to show a window of pages could be added here
                                        // For now, if pages < 10 show all, else we need ellipsis logic
                                        // implementing basic "show all" for small page counts or simplified logic
                                        if (totalPages > 7 && (page < currentPage - 1 || page > currentPage + 1) && page !== 1 && page !== totalPages) {
                                            if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <PaginationItem key={page}><span className="flex h-9 w-9 items-center justify-center">...</span></PaginationItem>
                                            }
                                            return null;
                                        }

                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={currentPage === page}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(page);
                                                    }}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                            }}
                                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
