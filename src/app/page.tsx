"use client";

import React from 'react';
import DownloadsTable from "@/components/downloads-table/DownloadsTable";
import { DownloadItem } from "@/hooks/useDownloadsTableItems";
import initialData from '@/data/downloads-data.json';

export default function Home() {
  // We can use the imported data directly, no need for state or useEffect unless fetching from an API
  const data = initialData as unknown as DownloadItem[];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-20">
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">— Demo</span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Schweigen Downloads Widget</h1>
          </div>
          <DownloadsTable data={data} />
        </section>

        <hr className="border-gray-200" />
      </div>
    </div>
  );
}
