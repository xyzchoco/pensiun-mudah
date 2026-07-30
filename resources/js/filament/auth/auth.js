import { initializeBackground } from './background.js';
import { initializeMouseEffects } from './mouse.js';
import { initializeParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        initializeBackground();
        initializeMouseEffects();
        initializeParticles();
    } else {
        console.log('[FilamentAuth] Reduced motion preferred. Skipping canvas animations.');
    }

    // Livewire Auth Loading & Validation Micro-Interactions Engine
    const card = document.getElementById('login-card');
    const bgLayer = document.getElementById('auth-background-layer');
    const form = document.querySelector('.auth-glass-card form');

    if (form) {
        form.addEventListener('submit', () => {
            card?.classList.add('is-authenticating');
            bgLayer?.classList.add('is-authenticating');
            window.__isAuthenticating = true;
        });
    }

    const resetLoadingUI = () => {
        setTimeout(() => {
            card?.classList.remove('is-authenticating');
            bgLayer?.classList.remove('is-authenticating');
            window.__isAuthenticating = false;
        }, 200);
    };

    const setupLivewireHooks = () => {
        if (!window.Livewire || window.__filamentAuthHooksRegistered) return;
        window.__filamentAuthHooksRegistered = true;

        Livewire.hook('commit', ({ component, respond, fail }) => {
            respond(() => {
                resetLoadingUI();

                setTimeout(() => {
                    // Check if field errors exist in DOM
                    const errorMessages = document.querySelectorAll('.fi-fo-field-wrp-error-message, .fi-no-notification-danger');
                    const hasErrors = errorMessages.length > 0;

                    if (hasErrors) {
                        // Card GPU Shake & Red Glow State
                        card?.classList.remove('auth-card-success');
                        card?.classList.add('auth-card-shake', 'auth-card-error');

                        // Input Error Glow - Filament v5 compatibility (.fi-fo-field)
                        document.querySelectorAll('.fi-fo-field, .fi-fo-field-wrp').forEach(wrp => {
                            if (wrp.querySelector('.fi-fo-field-wrp-error-message')) {
                                wrp.classList.add('auth-invalid');
                            } else {
                                wrp.classList.remove('auth-invalid');
                            }
                        });

                        // Auto Focus Password Field on Auth Failure
                        const pwdInput = form?.querySelector('input[type="password"]');
                        if (pwdInput) pwdInput.focus();

                        // Clean up shake animation class after 450ms
                        setTimeout(() => {
                            card?.classList.remove('auth-card-shake');
                        }, 450);
                    } else {
                        // Success State Transition
                        card?.classList.remove('auth-card-error');
                        card?.classList.add('auth-card-success');
                    }
                }, 60);
            });

            fail(() => {
                resetLoadingUI();
                card?.classList.add('auth-card-shake', 'auth-card-error');
                setTimeout(() => card?.classList.remove('auth-card-shake'), 450);
            });
        });
    };

    if (window.Livewire) {
        setupLivewireHooks();
    } else {
        document.addEventListener('livewire:initialized', setupLivewireHooks);
    }
});
