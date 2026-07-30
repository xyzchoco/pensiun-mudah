<div class="auth-page-root relative min-h-screen w-full overflow-x-hidden select-none">
    {{-- Vite Assets --}}
    @vite(['resources/css/filament/auth/auth.css', 'resources/js/filament/auth/auth.js'])

    {{-- Layer 0: Isolated Background Layer --}}
    <x-filament-auth.background />

    {{-- Layer 10: Isolated Interaction Overlay Layer --}}
    <x-filament-auth.interaction-layer />

    {{-- Layer 30: Main Content & Login Card --}}
    <x-filament-auth.card>
        {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE, scopes: $this->getRenderHookScopes()) }}

        <form wire:submit="authenticate" class="w-full">
            {{ $this->form }}

            <x-filament::actions
                :actions="$this->getFormActions()"
                :full-width="true"
                class="mt-6"
            />
        </form>

        {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::AUTH_LOGIN_FORM_AFTER, scopes: $this->getRenderHookScopes()) }}
    </x-filament-auth.card>
</div>
