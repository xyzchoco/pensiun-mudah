import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },

    server: {
        host: '0.0.0.0',
        port: 5173,

        hmr: {
            host: process.env.VITE_HMR_HOST ?? 'localhost',
        },
    },
});
