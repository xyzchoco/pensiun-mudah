import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Pensiun Mudah';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    // Baris ini ngasih tau Inertia buat nyari halaman di dalam folder Pages/
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        // Warna progress bar di atas layar saat pindah halaman (Oranye dari desain lu)
        color: '#FF8928',
    },
});