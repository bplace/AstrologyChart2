import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
    mode: 'development', // Vite automatically uses 'development' mode for dev server
    define: {
        // You can define environment variables here if needed (e.g., using process.env.VARIABLE)
        'process.env': {}
    },
    build: {
        // Output settings
        lib: {
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'astrology',
            fileName: 'astrochart2', // This will output astrochart2.js
            formats: ['umd'], // UMD format
        },
        sourcemap: true, // Enables source maps (like 'inline-source-map' in Webpack)
    },
    plugins: [],
    css: {
        // CSS handling is built-in in Vite, but we can configure here
        preprocessorOptions: {
            // If you need SCSS or other preprocessors
        },
    },
    server: {
        // Vite automatically starts in development mode with hot-reloading (HMR)
        port: 3000, // Optional: specify a port for the dev server
    },
    resolve: {
        alias: {
            // Optional: define aliases for paths
            '@': path.resolve(__dirname, 'src')
        }
    },
});
