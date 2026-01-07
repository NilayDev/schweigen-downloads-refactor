import { useState, useMemo } from 'react';

export interface DownloadItem {
    id: string | number;
    name?: string;
    "display-name"?: string; // From Schema
    downloadUrl?: string;
    file?: { url: string }; // From Schema
    "large-file-download-url"?: string; // From Schema
    "primary-asset-url"?: string; // From Schema
    primaryDownloadCategory?: string;
    "primary-download-category"?: string; // From Schema
    relatedDownloadCategories?: string[]; // Could be array of strings or objects
    primaryRelatedProductCategory?: string;
    "product-category"?: string; // From Schema (simplified for mock)
    relatedProductCategories?: string[]; // Simplified for mock
    filesize?: string;
    fileType?: string;
    filetype?: string; // From Schema (lowercase)
    filename?: string;
    mimetype?: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type SortField = 'name' | 'filesize' | 'primaryDownloadCategory' | 'fileType';
export type SortDirection = 'asc' | 'desc';

export interface UseDownloadsTableItemsProps {
    initialItems: DownloadItem[];
}

// Helper to normalize data
function normalizeItem(item: DownloadItem): DownloadItem {
    const fileType = item.filetype || item.fileType || "Unknown";
    return {
        ...item,
        name: item["display-name"] || item.name || "Untitled",
        downloadUrl: item.file?.url || item["large-file-download-url"] || item["primary-asset-url"] || item.downloadUrl || "#",
        primaryDownloadCategory: item["primary-download-category"] || item.primaryDownloadCategory,
        primaryRelatedProductCategory: item["product-category"] || item.primaryRelatedProductCategory,
        filesize: item.filesize,
        fileType: fileType.toUpperCase() // Ensure consistency
    };
}

export function useDownloadsTableItems({ initialItems }: UseDownloadsTableItemsProps) {
    // Normalize items first
    const items = useMemo(() => initialItems.map(normalizeItem), [initialItems]);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All'); // Keeps 'category' for backward compatibility if needed, but we might rely on productCategory
    const [productCategoryFilter, setProductCategoryFilter] = useState('All');
    const [fileTypeFilter, setFileTypeFilter] = useState('All');

    const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Extract unique categories for filters
    const downloadCategories = useMemo(() => {
        const categories = new Set<string>();
        items.forEach(item => {
            if (item.primaryDownloadCategory) categories.add(item.primaryDownloadCategory);
            item.relatedDownloadCategories?.forEach(c => categories.add(c));
        });
        return Array.from(categories).sort();
    }, [items]);

    const productCategories = useMemo(() => {
        const categories = new Set<string>();
        items.forEach(item => {
            if (item.primaryRelatedProductCategory) categories.add(item.primaryRelatedProductCategory);
            item.relatedProductCategories?.forEach(c => categories.add(c));
        });
        return Array.from(categories).sort();
    }, [items]);

    const uniqueFileTypes = useMemo(() => {
        const types = new Set<string>();
        items.forEach(item => {
            if (item.fileType) types.add(item.fileType);
        });
        // Ensure common ones like PDF, BIM are there if data exists
        return Array.from(types).sort();
    }, [items]);

    const filteredItems = useMemo(() => {
        let result = [...items];

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(item =>
                (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
                (item.filename && item.filename.toLowerCase().includes(lowerQuery))
            );
        }

        if (categoryFilter !== 'All') {
            result = result.filter(item =>
                item.primaryDownloadCategory === categoryFilter ||
                item.relatedDownloadCategories?.includes(categoryFilter)
            );
        }

        if (productCategoryFilter !== 'All') {
            result = result.filter(item =>
                item.primaryRelatedProductCategory === productCategoryFilter ||
                item.relatedProductCategories?.includes(productCategoryFilter)
            );
        }

        if (fileTypeFilter !== 'All') {
            result = result.filter(item =>
                item.fileType === fileTypeFilter
            );
        }

        return result;
    }, [items, searchQuery, categoryFilter, productCategoryFilter, fileTypeFilter]);

    const sortedItems = useMemo(() => {
        const result = [...filteredItems];
        if (sortConfig) {
            result.sort((a, b) => {
                const field = sortConfig.field;
                const valA = a[field] || '';
                const valB = b[field] || '';

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [filteredItems, sortConfig]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedItems.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedItems, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const handleSort = (field: SortField) => {
        setSortConfig(current => {
            if (current?.field === field) {
                return { field, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { field, direction: 'asc' };
        });
    };

    return {
        items: paginatedItems,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        productCategoryFilter,
        setProductCategoryFilter,
        fileTypeFilter,
        setFileTypeFilter,
        downloadCategories,
        productCategories,
        uniqueFileTypes,
        sortConfig,
        handleSort,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage,
        totalItems: sortedItems.length,
        filteredTotal: filteredItems.length
    };
}
