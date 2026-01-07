import { component } from "@webflow/code-components";
import DownloadsTable from '@/components/DownloadsTable';

export const SchweigenDownloads = component(DownloadsTable, {
    name: "Schweigen Downloads",
    props: {
        title: {
            type: "string",
            defaultValue: "Downloads"
        },
        data: {
            type: "json",
            defaultValue: []
        }
    },

});
