{{-- Reusable Glassmorphism Login Card Component --}}
<main class="auth-layer-content">
    <div id="login-card" class="auth-glass-card">
        
        {{-- Single Cohesive Header Stack --}}
        <header class="auth-card-header">
            {{-- 1. Shield Logo --}}
            <div class="auth-icon-container">
                <x-filament::icon
                    icon="heroicon-o-shield-check"
                    class="auth-icon-symbol"
                />
            </div>

            {{-- 2. Brand Name --}}
            <h1 class="auth-title-brand">
                {{ filament()->getBrandName() ?? 'Pensiun Mudah' }}
            </h1>

            {{-- 3. Administrator Badge --}}
            <div class="auth-badge">
                <span class="auth-badge-dot"></span>
                <span class="auth-badge-label">
                    Administrator
                </span>
            </div>

            {{-- 4. Heading --}}
            <h2 class="auth-card-heading">
                {{ $this->getHeading() }}
            </h2>

            {{-- 5. Subtitle --}}
            <p class="auth-card-subheading">
                Sign in to dashboard admin.
            </p>
        </header>

        {{-- Form Content Slot --}}
        <div class="w-full">
            {{ $slot }}
        </div>
    </div>
</main>
