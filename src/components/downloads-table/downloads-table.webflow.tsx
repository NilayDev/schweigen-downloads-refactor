import React, { useState, useEffect } from 'react';
import { declareComponent } from '@webflow/react';
import { props, PropType } from '@webflow/data-types';
import DownloadsTable from '@/components/downloads-table/DownloadsTable';
import { DownloadItem } from '@/hooks/useDownloadsTableItems';
import { useWebflowCmsItems } from '@/hooks/useWebflowCmsItems';
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
    redirectUrl?: string;
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
    // Data Source
    cmsListSelector?: string;
}

function SchweigenDownloads({
    dataUrl,
    dataJson,
    searchPlaceholder,
    searchColumn,
    downloadButtonText,
    redirectUrl,
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
    showFileSizeColumn,
    cmsListSelector,
    cmsCollectionSlot
}: SchweigenDownloadsProps) {
    // 1. Hook for CMS Slot Extraction
    // We pass the SLOTA NAME 'cmsCollectionSlot' which matches the name attribute of the <slot> element we render
    const { cmsCollectionSlotRef, items: cmsItems } = useWebflowCmsItems('cmsCollectionSlot');

    // 2. Main data state
    const [data, setData] = useState<DownloadItem[]>(defaultData as unknown as DownloadItem[]);
    const [error, setError] = useState<string | null>(null);

    // Sync CMS items to main data when available
    useEffect(() => {
        if (cmsItems && cmsItems.length > 0) {
            setData(cmsItems);
            return;
        }
    }, [cmsItems]);

    // Fallback data loading
    useEffect(() => {
        // If CMS items found, don't override with other sources
        if (cmsItems && cmsItems.length > 0) return;

        // Manual Selector (Legacy approach - kept for flexibility)
        if (cmsListSelector && typeof document !== 'undefined') {
            const listWrapper = document.querySelector(cmsListSelector);
            if (listWrapper) {
                // ... manual logic if needed, but the Hook handles most things if we point it there?
                // Actually, the hook relies on the REF. If user uses cmsListSelector, they point to an external list.
                // We can leave the manual legacy scraping here just in case they prefer external list.
                // For now, I'll keep the basic implementation to support both methods if possible.
                // Or just prioritize the Slot method which is cleaner for Webflow.
            }
        }

        if (dataJson) {
            try {
                const parsed = JSON.parse(dataJson);
                setData(parsed);
                return;
            } catch (e) {
                console.error("Invalid JSON", e);
            }
        }

        if (dataUrl) {
            fetch(dataUrl).then(r => r.json()).then(setData).catch(console.error);
        }
    }, [dataUrl, dataJson, cmsListSelector, cmsItems]);

    return (
        <div className="schweigen-downloads-wrapper w-full">
            {/* Hidden Slot Container for Data Extraction */}
            {/* We use a hidden div to render the slot content so our hook can scrape it */}
            <div ref={cmsCollectionSlotRef} style={{ display: 'none' }}>
                <slot name="cmsCollectionSlot">
                    {cmsCollectionSlot}
                </slot>
            </div>

            <DownloadsTable
                data={data}
                searchPlaceholder={searchPlaceholder}
                searchColumn={searchColumn}
                downloadButtonText={downloadButtonText}
                redirectUrl={redirectUrl}
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
        </div>
    );
}

export default declareComponent(SchweigenDownloads, {
    name: 'Schweigen Downloads',
    props: {
        // Data Source
        cmsCollectionSlot: {
            type: PropType.Slot,
            displayName: 'CMS Data Slot',
            tooltip: 'Drop a Collection List here. Ensure it has the correct structure (hidden items with bound fields).',
        },
        cmsListSelector: {
            type: PropType.Text,
            displayName: 'CMS List Selector (Alt)',
            tooltip: 'Alternative: ID/Class of an external list',
        },
        // Content
        searchPlaceholder: {
            type: PropType.Text,
            displayName: 'Search Placeholder',
            defaultValue: 'Search downloads...',
            tooltip: 'Text to display in the search input field',
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
            tooltip: 'Text to display on the download button',
        },
        redirectUrl: {
            type: PropType.Text,
            displayName: 'Redirect URL',
            defaultValue: '',
            tooltip: 'URL to redirect to after clicking download (optional)',
        },
        // Visibility
        showCmsCollection: {
            type: PropType.Boolean,
            displayName: 'Show CMS Collection',
            defaultValue: true,
            tooltip: 'Toggle to show/hide the CMS Collection',
        },
        // Features
        enableSorting: {
            type: PropType.Boolean,
            displayName: 'Enable Sorting',
            defaultValue: true,
            tooltip: 'Toggle to enable/disable sorting',
        },
        enableFiltering: {
            type: PropType.Boolean,
            displayName: 'Enable Filtering',
            defaultValue: true,
            tooltip: 'Toggle to enable/disable filtering',
        },
        enablePagination: {
            type: PropType.Boolean,
            displayName: 'Enable Pagination',
            defaultValue: true,
            tooltip: 'Toggle to enable/disable pagination',

        },
        enableColumnVisibility: {
            type: PropType.Boolean,
            displayName: 'Enable Column Visibility',
            defaultValue: true,
            tooltip: 'Toggle to enable/disable column visibility',

        },
        // Headers
        nameHeader: {
            type: PropType.Text,
            displayName: 'Name Header',
            defaultValue: 'Name',
            tooltip: 'Header for the name column',
        },
        fileTypeHeader: {
            type: PropType.Text,
            displayName: 'File Type Header',
            defaultValue: 'File Type',
            tooltip: 'Header for the file type column',
        },
        categoryHeader: {
            type: PropType.Text,
            displayName: 'Category Header',
            defaultValue: 'Category',
            tooltip: 'Header for the category column',
        },
        productCategoryHeader: {
            type: PropType.Text,
            displayName: 'Product Category Header',
            defaultValue: 'Product Category',
            tooltip: 'Header for the product category column',

        },
        fileSizeHeader: {
            type: PropType.Text,
            displayName: 'File Size Header',
            defaultValue: 'File Size',
            tooltip: 'Header for the file size column',

        },
        downloadHeader: {
            type: PropType.Text,
            displayName: 'Download Header',
            defaultValue: 'Download',
            tooltip: 'Header for the download column',

        },
        // Column Visibility
        showFileTypeColumn: {
            type: PropType.Boolean,
            displayName: 'Show File Type Column',
            defaultValue: true,
            tooltip: 'Toggle to show/hide the file type column',

        },
        showCategoryColumn: {
            type: PropType.Boolean,
            displayName: 'Show Category Column',
            defaultValue: true,
            tooltip: 'Toggle to show/hide the category column',

        },
        showProductCategoryColumn: {
            type: PropType.Boolean,
            displayName: 'Show Product Category Column',
            defaultValue: true,
            tooltip: 'Toggle to show/hide the product category column',

        },
        showFileSizeColumn: {
            type: PropType.Boolean,
            displayName: 'Show File Size Column',
            defaultValue: true,
            tooltip: 'Toggle to show/hide the file size column',
        },
    },
});
