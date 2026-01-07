import { ShadcnShowcase } from "@/components/ShadcnShowcase";
import DownloadsTable from "@/components/DownloadsTable";
import { DownloadItem } from "@/hooks/useDownloadsTableItems";

const MOCK_DATA: DownloadItem[] = [
  {
    id: 1,
    name: "Schweigen Silent Range Brochure",
    downloadUrl: "https://example.com/brochure.pdf",
    primaryDownloadCategory: "Brochures",
    primaryRelatedProductCategory: "Silent Range",
    filesize: "2.5 MB",
    fileType: "PDF",
    filename: "silent-range-brochure.pdf"
  },
  {
    id: 2,
    name: "Installation Guide - UM1170-9S",
    downloadUrl: "https://example.com/install-guide.pdf",
    primaryDownloadCategory: "Installation Guides",
    primaryRelatedProductCategory: "Undermount",
    filesize: "1.2 MB",
    fileType: "PDF",
    filename: "UM1170-9S_install.pdf"
  },
  {
    id: 3,
    name: "User Manual - WM2190-6S",
    downloadUrl: "https://example.com/manual.pdf",
    primaryDownloadCategory: "User Manuals",
    primaryRelatedProductCategory: "Wallmount",
    filesize: "3.8 MB",
    fileType: "PDF",
    filename: "WM2190-6S_manual.pdf"
  },
  {
    id: 4,
    name: "Spec Sheet - IS4160",
    downloadUrl: "#",
    primaryDownloadCategory: "Technical Specifications",
    primaryRelatedProductCategory: "Island",
    filesize: "500 KB",
    fileType: "PDF"
  },
  {
    id: 5,
    name: "2024 Product Catalog",
    downloadUrl: "#",
    primaryDownloadCategory: "Brochures",
    filesize: "15 MB",
    fileType: "PDF"
  },
  {
    id: 6,
    name: "SketchUp Model - UM1170",
    downloadUrl: "#",
    primaryDownloadCategory: "CAD Drawings",
    primaryRelatedProductCategory: "Undermount",
    filesize: "5 MB",
    fileType: "SKP",
    mimetype: "application/x-sketchup"
  },
  // Add more items to test pagination
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: 10 + i,
    name: `Sample Document ${i + 1}`,
    downloadUrl: "#",
    primaryDownloadCategory: i % 2 === 0 ? "User Manuals" : "Brochures",
    primaryRelatedProductCategory: i % 3 === 0 ? "Silent Range" : "Undermount",
    filesize: `${(i + 1) * 100} KB`,
    fileType: "PDF"
  }))
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-20">
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">— Demo</span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Schweigen Downloads Widget</h1>
          </div>
          <DownloadsTable data={MOCK_DATA} />
        </section>

        <hr className="border-gray-200" />

        <ShadcnShowcase />
      </div>
    </div>
  );
}
