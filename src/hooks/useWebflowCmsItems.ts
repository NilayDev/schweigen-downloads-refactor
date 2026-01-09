import { useEffect, useMemo, useRef, useState } from "react";
import { DownloadItem } from "./useDownloadsTableItems";

/**
 * Extracts CMS collection list items from a Webflow collection slot
 * and converts them to a structured data format for the Downloads Table
 * @param slotName - Name of the slot containing the CMS collection
 * @returns Ref for the slot container and array of download items
 */
export function useWebflowCmsItems(slotName: string) {
    const cmsCollectionSlotRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<DownloadItem[] | null>(null);

    useEffect(() => {
        if (items === null && cmsCollectionSlotRef.current) {
            // Find the slot element by name
            const slot = cmsCollectionSlotRef.current.querySelector(
                `slot[name="${slotName}"]`
            ) as HTMLSlotElement;

            // Note: assignedElements() only works if there is a Shadow DOM or if the browser environment supports it for the specific element structure.
            // In a pure React/Light DOM environment, we might need to look at children directly if <slot> is just a container.
            // However, typical Webflow DevLink behavior might rely on specific slot handling.
            // We will implement a fallback to query children directly if assignedElements is empty or fails.

            if (slot) {
                let cmsItems: HTMLDivElement[] = [];

                // Try standard slot API
                if (typeof slot.assignedElements === 'function') {
                    try {
                        const assigned = slot.assignedElements();
                        if (assigned.length > 0) {
                            // Assuming the first assigned element is the Collection List Wrapper or List
                            // We look for .sch-cms-item (our specific class) or .w-dyn-item (default)
                            cmsItems = Array.from(assigned[0].querySelectorAll(`.sch-cms-item, .w-dyn-item`)) as HTMLDivElement[];
                        }
                    } catch (e) {
                        console.warn("Slot assignedElements lookup failed, falling back to children", e);
                    }
                }

                // Fallback: Query direct children of the slot (Light DOM usage)
                if (cmsItems.length === 0 && slot.children.length > 0) {
                    // Search recursively in the slot's children for valid items
                    // We use querySelectorAll on the slot itself which searches its light-dom children
                    cmsItems = Array.from(slot.querySelectorAll(`.sch-cms-item, .w-dyn-item`)) as HTMLDivElement[];
                }

                console.log(`[Schweigen Downloads] Debug: Found ${cmsItems.length} CMS items in slot.`);

                if (cmsItems.length > 0) {
                    // Convert DOM elements to download data objects
                    const dataItems: DownloadItem[] = cmsItems.map((item, index) => {
                        const children = item.children;

                        // Helper to safely get text content by class
                        const getTextByClass = (className: string) => {
                            const el = item.querySelector(className);
                            return el ? (el.textContent || "").trim() : "";
                        };

                        // 1. Try Deterministic Extraction (Best Practice)
                        // These match the documentation
                        const explicitName = getTextByClass('.sch-data-name');
                        const explicitCategory = getTextByClass('.sch-data-category');
                        const explicitProductCategory = getTextByClass('.sch-data-product-category');
                        const explicitFileSize = getTextByClass('.sch-data-file-size');
                        const explicitFileType = getTextByClass('.sch-data-file-type');

                        // Get URL from specific class if possible, else find any anchor
                        const explicitFileLinkEl = item.querySelector('.sch-data-file');
                        let downloadUrl = explicitFileLinkEl?.getAttribute('href') || "#";

                        if (downloadUrl === "#" || !downloadUrl) {
                            // Fallback: Find first anchor
                            const anchor = item.querySelector('a');
                            if (anchor) downloadUrl = anchor.href || "#";
                        }

                        // If we have explicit data, prioritize it
                        if (explicitName) {
                            return {
                                id: `cms-${index}`,
                                name: explicitName,
                                "display-name": explicitName,
                                downloadUrl,
                                primaryDownloadCategory: explicitCategory,
                                "primary-download-category": explicitCategory,
                                primaryRelatedProductCategory: explicitProductCategory,
                                "product-category": explicitProductCategory,
                                filesize: explicitFileSize,
                                fileType: explicitFileType,
                                filetype: explicitFileType,
                                title: explicitName,
                                category: explicitCategory,
                                productType: explicitProductCategory
                            };
                        }

                        // 2. Heuristic Extraction (Fallback)
                        // Extract download-specific fields from CMS item children
                        // The component dynamically finds the download URL from any anchor tag

                        // If downloadUrl is still default, try to find it heuristically
                        if (downloadUrl === "#") {
                            // This block will be re-evaluated, but the downloadUrl might have been set by explicitFileLinkEl
                            // So we only re-assign if it's still the default.
                        }

                        let titleText = "";
                        let fileTypeText = "";
                        let categoryText = "";
                        let productTypeText = "";
                        let filesizeText = "";

                        // Helper to clean text
                        const getCleanText = (el: Element) => (el.textContent || "").trim();

                        // Iterate through children to extract data - heuristics based
                        const textElements: string[] = [];

                        for (let i = 0; i < children.length; i++) {
                            const child = children[i];

                            // Skip if we already found URL and this is just a link wrapper
                            if (child.tagName === "A" && downloadUrl === "#") {
                                downloadUrl = (child as HTMLAnchorElement).href || "#";
                            }
                            else if (child.querySelector("a") && downloadUrl === "#") {
                                const anchor = child.querySelector("a");
                                if (anchor) {
                                    downloadUrl = anchor.href || "#";
                                }
                            }
                            else {
                                const text = getCleanText(child);
                                if (text) textElements.push(text);
                            }
                        }

                        // Map text elements to fields based on heuristics
                        textElements.forEach((text, i) => {
                            if (/^\d+$/.test(text) || /^\d+(\.\d+)?\s*(KB|MB|GB|bytes?)/i.test(text)) {
                                if (!filesizeText) filesizeText = text;
                                return;
                            }
                            if (/^[A-Z0-9]{2,5}$/.test(text) || ['PDF', 'DWG', 'ZIP', 'RFA', 'SKP', 'DOC', 'XLS', 'JPG', 'PNG', 'MP4', 'Other'].includes(text)) {
                                if (!fileTypeText) fileTypeText = text;
                                return;
                            }
                            // Heuristic: Text longer than 3 chars that isn't other stuff is likely Name or Category
                            // Highest priority is Title/Name
                            if (!titleText || (text.length > titleText.length && text.length < 100)) {
                                if (titleText) {
                                    // Bump old title to category if reasonable
                                    if (!categoryText) categoryText = titleText;
                                }
                                titleText = text;
                            } else {
                                if (!categoryText) categoryText = text;
                                else if (!productTypeText) productTypeText = text;
                            }
                        });

                        const downloadItem: DownloadItem = {
                            id: `cms-${index}`,

                            // Map to DownloadItem interface
                            name: titleText || "Untitled",
                            "display-name": titleText,

                            downloadUrl,

                            primaryDownloadCategory: categoryText,
                            "primary-download-category": categoryText,

                            primaryRelatedProductCategory: productTypeText,
                            "product-category": productTypeText,

                            filesize: filesizeText,
                            fileType: fileTypeText,
                            filetype: fileTypeText,

                            // Preserve others for flexible usage
                            title: titleText,
                            category: categoryText,
                            productType: productTypeText,
                        };

                        return downloadItem;
                    });

                    setItems(dataItems);
                }
            }
        }
    }, [cmsCollectionSlotRef, items, slotName]);

    const memoizedItems = useMemo(
        () => items?.filter((item) => item.name && item.name.length > 0 && item.downloadUrl && item.downloadUrl !== "#") ?? [],
        [items]
    );

    return {
        cmsCollectionSlotRef,
        items: memoizedItems,
    };
}
