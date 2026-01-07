import React from 'react';
import { createRoot } from 'react-dom/client';
import DownloadsTable from '@/components/downloads-table/DownloadsTable';
import '@/app/globals.css';
import { DownloadItem } from '@/hooks/useDownloadsTableItems';

declare global {
    interface Window {
        renderSchweigenDownloads: (containerId: string, data: DownloadItem[]) => void;
        SchweigenDownloadsData?: DownloadItem[];
    }
}

export const renderSchweigenDownloads = (containerId: string, data: DownloadItem[]) => {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    const root = createRoot(container);
    root.render(<DownloadsTable data={data} />);
};

// Expose to window
if (typeof window !== 'undefined') {
    window.renderSchweigenDownloads = renderSchweigenDownloads;
}

// Auto-mount if container exists and data is available via window or attribute
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const containerId = 'schweigen-downloads-container';
        const container = document.getElementById(containerId);

        if (container) {
            // 1. Try fetching from URL
            const dataUrl = container.getAttribute('data-url');
            if (dataUrl) {
                fetch(dataUrl)
                    .then(res => res.json())
                    .then(data => {
                        renderSchweigenDownloads(containerId, data);
                    })
                    .catch(err => console.error("Failed to fetch downloads data", err));
                return;
            }

            // 2. Try Global Variable
            if (window.SchweigenDownloadsData) {
                renderSchweigenDownloads(containerId, window.SchweigenDownloadsData);
                return;
            }

            // 3. Try Data Attribute
            const dataAttr = container.getAttribute('data-items');
            if (dataAttr) {
                try {
                    const parsedData = JSON.parse(dataAttr);
                    renderSchweigenDownloads(containerId, parsedData);
                } catch (e) {
                    console.error("Failed to parse data-items attribute", e);
                }
            }
        }
    });
}
