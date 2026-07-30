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
                'resources/css/filament/auth/auth.css',
                'resources/js/filament/auth/auth.js',
            ],
            refresh: [
                {
                    paths: [
                        'resources/views/**',
                        'routes/**',
                    ],
                    delay: 300,
                },
            ],
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
        host: '127.0.0.1',
        port: 5173,
        hmr: {
            host: '127.0.0.1',
        },
        // Cegah Vite memantau folder yang berubah terus-menerus (logs, cache, sessions)
        // sehingga @tailwindcss/vite tidak trigger rebuild CSS loop tak terbatas
        watch: {
            ignored: [
                '**/storage/**',
                '**/bootstrap/cache/**',
                '**/vendor/**',
                '**/.git/**',
            ],
        },
    },
});
