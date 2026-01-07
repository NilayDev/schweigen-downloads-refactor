import React, { useState, useEffect } from 'react';
import { declareComponent } from '@webflow/react';
import { props, PropType } from '@webflow/data-types';
import DownloadsTable from '@/components/downloads-table/DownloadsTable';
import { DownloadItem } from '@/hooks/useDownloadsTableItems';
import '@/app/globals.css';
import defaultData from '@/data/downloads-data.json';

interface SchweigenDownloadsProps {
    cmsCollectionSlot?: React.ReactNode;
    dataUrl?: string;
    dataJson?: string;
    // Content
    searchPlaceholder?: string;
    searchColumn?: string;
    downloadButtonText?: string;
    // Visibility
    showCmsCollection?: boolean;
    // Features
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enablePagination?: boolean;
    enableColumnVisibility?: boolean;
    // Headers
    nameHeader?: string;
    fileTypeHeader?: string;
    categoryHeader?: string;
    productCategoryHeader?: string;
    fileSizeHeader?: string;
    downloadHeader?: string;
    // Column Visibility
    showFileTypeColumn?: boolean;
    showCategoryColumn?: boolean;
    showProductCategoryColumn?: boolean;
    showFileSizeColumn?: boolean;
}

function SchweigenDownloads({
    dataUrl,
    dataJson,
    searchPlaceholder,
    searchColumn,
    downloadButtonText,
    showCmsCollection,
    enableSorting,
    enableFiltering,
    enablePagination,
    enableColumnVisibility,
    nameHeader,
    fileTypeHeader,
    categoryHeader,
    productCategoryHeader,
    fileSizeHeader,
    downloadHeader,
    showFileTypeColumn,
    showCategoryColumn,
    showProductCategoryColumn,
    showFileSizeColumn
}: SchweigenDownloadsProps) {
    const [data, setData] = useState<DownloadItem[]>(defaultData as unknown as DownloadItem[]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Try passing raw JSON
        if (dataJson) {
            try {
                const parsed = JSON.parse(dataJson);
                setData(parsed);
                setError(null);
                return;
            } catch (e) {
                console.error("Invalid JSON provided to SchweigenDownloads", e);
                setError("Invalid JSON data provided.");
                return;
            }
        }

        // 2. Try fetching from URL
        if (dataUrl) {
            fetch(dataUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Network response was not ok");
                    return res.json();
                })
                .then(jsonData => {
                    setData(jsonData);
                    setError(null);
                })
                .catch(err => {
                    console.error("Failed to fetch downloads data", err);
                    setError(`Failed to load data from URL: ${err.message}`);
                });
            return;
        }
    }, [dataUrl, dataJson]);

    if (error) {
        return <div className="p-4 text-red-500 border border-red-300 rounded bg-red-50">{error}</div>;
    }

    return (
        <DownloadsTable
            data={data}
            searchPlaceholder={searchPlaceholder}
            searchColumn={searchColumn}
            downloadButtonText={downloadButtonText}
            enableSorting={enableSorting}
            enableFiltering={enableFiltering}
            enablePagination={enablePagination}
            enableColumnVisibility={enableColumnVisibility}
            nameHeader={nameHeader}
            fileTypeHeader={fileTypeHeader}
            categoryHeader={categoryHeader}
            productCategoryHeader={productCategoryHeader}
            fileSizeHeader={fileSizeHeader}
            downloadHeader={downloadHeader}
            showFileTypeColumn={showFileTypeColumn}
            showCategoryColumn={showCategoryColumn}
            showProductCategoryColumn={showProductCategoryColumn}
            showFileSizeColumn={showFileSizeColumn}
        />
    );
}

export default declareComponent(SchweigenDownloads, {
    name: 'Schweigen Downloads',
    props: {
        // Content
        cmsCollectionSlot: {
            type: PropType.Slot,
            displayName: 'CMS Collection Slot',

        },
        searchPlaceholder: {
            type: PropType.Text,
            displayName: 'Search Placeholder',
            defaultValue: 'Search downloads...',

        },
        searchColumn: {
            type: PropType.Text,
            displayName: 'Search Column',
            defaultValue: 'name',

            tooltip: 'The property key to search against (e.g., name)',
        },
        downloadButtonText: {
            type: PropType.Text,
            displayName: 'Download Button Text',
            defaultValue: 'Download',

        },
        // Visibility
        showCmsCollection: {
            type: PropType.Boolean,
            displayName: 'Show CMS Collection',
            defaultValue: true,

        },
        // Features
        enableSorting: {
            type: PropType.Boolean,
            displayName: 'Enable Sorting',
            defaultValue: true,

        },
        enableFiltering: {
            type: PropType.Boolean,
            displayName: 'Enable Filtering',
            defaultValue: true,

        },
        enablePagination: {
            type: PropType.Boolean,
            displayName: 'Enable Pagination',
            defaultValue: true,

        },
        enableColumnVisibility: {
            type: PropType.Boolean,
            displayName: 'Enable Column Visibility',
            defaultValue: true,

        },
        // Headers
        nameHeader: {
            type: PropType.Text,
            displayName: 'Name Header',
            defaultValue: 'Name',

        },
        fileTypeHeader: {
            type: PropType.Text,
            displayName: 'File Type Header',
            defaultValue: 'File Type',

        },
        categoryHeader: {
            type: PropType.Text,
            displayName: 'Category Header',
            defaultValue: 'Category',

        },
        productCategoryHeader: {
            type: PropType.Text,
            displayName: 'Product Category Header',
            defaultValue: 'Product Category',

        },
        fileSizeHeader: {
            type: PropType.Text,
            displayName: 'File Size Header',
            defaultValue: 'File Size',

        },
        downloadHeader: {
            type: PropType.Text,
            displayName: 'Download Header',
            defaultValue: 'Download',

        },
        // Column Visibility
        showFileTypeColumn: {
            type: PropType.Boolean,
            displayName: 'Show File Type Column',
            defaultValue: true,

        },
        showCategoryColumn: {
            type: PropType.Boolean,
            displayName: 'Show Category Column',
            defaultValue: true,

        },
        showProductCategoryColumn: {
            type: PropType.Boolean,
            displayName: 'Show Product Category Column',
            defaultValue: true,

        },
        showFileSizeColumn: {
            type: PropType.Boolean,
            displayName: 'Show File Size Column',
            defaultValue: true,

        },
    },
});
