import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

export default defineConfig({
    plugins: [
        react(),
        cssInjectedByJs(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/app/downloads-table.webflow.tsx',
            name: 'SchweigenDownloads',
            fileName: (format) => `schweigen-downloads.${format}.js`,
            formats: ['umd'],
        },
        rollupOptions: {
            // Ensure specific external dependencies if you don't want to bundle them.
            // For a drop-in widget, we usually WANT to bundle React/ReactDOM unless 
            // we are sure the site has them. 
            // However, to keep it simple and self-contained, we will bundle them.
            // If file size is an issue, we can externalize them.
            external: [],
            output: {
                globals: {
                    // react: 'React',
                    // 'react-dom': 'ReactDOM'
                }
            }
        },
        // CSS Code Split false ensures CSS is emitted as part of the JS bundle via the plugin
        cssCodeSplit: false,
    },
    define: {
        'process.env.NODE_ENV': '"production"'
    }
});
