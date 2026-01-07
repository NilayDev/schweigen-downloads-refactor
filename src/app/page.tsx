"use client";

import React from 'react';
import DownloadsTable from "@/components/downloads-table/DownloadsTable";
import { DownloadItem } from "@/hooks/useDownloadsTableItems";

export default function Home() {
  const [data, setData] = React.useState<DownloadItem[]>([]);

  React.useEffect(() => {
    fetch('/downloads-data.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load local data", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-20">
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">— Demo</span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Schweigen Downloads Widget</h1>
          </div>
          {data.length > 0 ? <DownloadsTable data={data} /> : <p>Loading data...</p>}
        </section>

        <hr className="border-gray-200" />
      </div>
    </div>
  );
}
