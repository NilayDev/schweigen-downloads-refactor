# Schweigen Downloads Component - Implementation Summary

This document details the technologies, files, commands, and process used to create the **Schweigen Downloads** component and integrate it with Webflow.

## 1. Technology Stack

We utilized a modern stack focused on performance, type safety, and ease of integration:

*   **Core Framework**: React 19 (declarative UI), TypeScript (type safety).
*   **Hosting/App Context**: Next.js 15 (used for local development environment and structure).
*   **Styling**:
    *   **Tailwind CSS v4**: Utility-first CSS for rapid styling.
    *   **clsx & tailwind-merge**: Utilities for conditionally merging class names without conflicts.
*   **UI Elements**:
    *   **Lucide React**: For lightweight, consistent SVG icons (Download, Chevron, Search, etc.).
    *   **Radix UI Primitives** (implied via structure): For accessible interactive components like dropdowns/selects (if applicable in extended logic).
*   **Webflow Integration**:
    *   `@webflow/react`: SDK to define and register components in the Webflow Designer.
    *   `@webflow/webflow-cli`: CLI tool to bundle and sync components.
*   **Bundling**:
    *   **Vite**: Used to bundle the React component into a single library mode bundle (`dist/schweigen-downloads.umd.js`) for the Webflow Widget.

## 2. Key Files & Directory Structure

Here are the specific files created and their roles:

### Component Logic & UI
*   `src/components/downloads-table/DownloadsTable.tsx`:
    *   The **Pure React** component. It contains the JSX structure, Tailwind classes, and connects the UI to the logic hook. It is unaware of Webflow-specifics, making it reusable.
*   `src/hooks/useDownloadsTableItems.ts`:
    *   **Custom Hook**. Contains all the business logic: Filtering (Text search, Categories), Sorting (Name, Size, Date), pagination, and data parsing.

### Webflow Integration
*   `src/components/downloads-table/downloads-table.webflow.tsx`:
    *   **Wrapper Component**. This imports the pure `DownloadsTable` and wraps it with `declareComponent`.
    *   **Props Definition**: Defines the fields visible in the Webflow Designer sidebar (e.g., "Search Placeholder", "Enable Sorting") using `PropType` enums.
*   `webflow.json`:
    *   Configuration file for the Webflow CLI, pointing to the component entry point.

### Data
*   `src/data/downloads-data.json`:
    *   The local source of truth for development data. It mirrors the structure of the data expected in production.

## 3. Detailed Step-by-Step Implementation Process

We followed this precise sequence to build the solution:

### Step 1: Project Setup & Configuration
1.  **Initialize Project**: Set up a Next.js environment with TypeScript and Tailwind CSS.
2.  **Dependencies**: Installed Webflow SDKs (`@webflow/react`, `data-types`) and UI libraries (`lucide-react`, `clsx`).
3.  **Vite Config**: Configured `vite.config.ts` to build the React code into a single UMD file that Webflow can load.

### Step 2: Core Component Development
1.  **UI Design**: Created `DownloadsTable.tsx` with a responsive table layout.
    *   *Styling*: Used Tailwind's utility classes for spacing, typography, and borders.
    *   *Responsiveness*: Hidden columns on smaller screens (`hidden md:table-cell`).
2.  **Logic Hook**: Built `useDownloadsTableItems.ts` to handle:
    *   **Filtering**: By text search and category dropdowns.
    *   **Sorting**: Logic to sort by string (A-Z), numbers (Size), or Date.
    *   **Pagination**: Calculating total pages and slicing the data array.

### Step 3: Data Integration
1.  **Data Modeling**: Defined the `DownloadItem` interface to match the client's data structure (see Section 4).
2.  **Data Generation**: Created a script `generate-data.js` to programmatically generate realistic dummy data (`doc-1`, `manual-2`, etc.) to test performance with hundreds of items.

### Step 4: Webflow Wrapper & Typing
1.  **Wrapper Creation**: Created `downloads-table.webflow.tsx` to interface with the Webflow Designer.
2.    *   **Prop Definition**: Mapped the component's feature flags (like `enableSorting`) to Webflow's Sidebar controls. Added `redirectUrl` to allow for post-download navigation.
    *   **Crucial Fix**: Updated generic string types (`"Text"`) to strict Enums (`PropType.Text`) to satisfy the Webflow SDK requirements.

### Step 5: Build & Deployment Preparation
1.  **Build Script**: Added `npm run build:widget` to run Vite and produce the `dist/` artifacts.
2.  **Verification**: Used `check_exports.js` to ensure the final bundle exports the correct modules.
3.  **Git Integration**: Pushed the entire codebase to the remote repository.

## 4. Data Structure & Usage

The component is designed to consume a specific JSON structure. We used `src/data/downloads-data.json` for testing.

### Field Definitions:
*   `id`: Unique identifier (e.g., `"item-1"`).
*   `display-name`: The visible title of the document (e.g., `"Document 1 - Brochures"`).
*   `file`: Object containing the file URL.
    *   `url`: The actual link to the file (e.g., `"#"` or `"/path/to/file.pdf"`).
*   `download-type`: Broad category (e.g., `"Brochures"`).
*   `primary-download-category`: Specific download category used for filtering.
*   `product-category`: The related product line (e.g., `"Silent Range"`, `"Undermount"`).
*   `filetype`: The format of the file (e.g., `"PDF"`).
*   `filesize`: The size string (e.g., `"1295 KB"`).

### Example Data Object:
```json
{
  "id": "item-1",
  "display-name": "Document 1 - Brochures",
  "file": {
    "url": "#"
  },
  "download-type": "Brochures",
  "primary-download-category": "Brochures",
  "secondary-download-category": "General",
  "filetype": "PDF",
  "filesize": "1295 KB",
  "product-category": "Silent Range"
}
```

This structure is critical. The component's internal logic (`useDownloadsTableItems`) maps these specific fields to the table columns. If the production data changes key names (e.g., from `display-name` to `title`), the component interface must be updated.

## 5. Commands Guide

*   **`npm run dev`**: Start local dev server.
*   **`npm run build:widget`**: Build the production bundle for Webflow.
*   **`npm run webflow:share`**: Sync component to Webflow (requires login).
