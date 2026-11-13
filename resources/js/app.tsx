import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Halaman biasa (resources/js/pages) + halaman milik modul HMVC (Modules/*/resources/js/pages)
const pages = import.meta.glob([
    './pages/**/*.tsx',
    '../../Modules/*/resources/js/pages/**/*.tsx',
]);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        // Contoh: Inertia::render('Buku::index')
        //   -> Modules/Buku/resources/js/pages/index.tsx
        if (name.includes('::')) {
            const [module, page] = name.split('::');

            return resolvePageComponent(
                `../../Modules/${module}/resources/js/pages/${page}.tsx`,
                pages,
            );
        }

        return resolvePageComponent(`./pages/${name}.tsx`, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
