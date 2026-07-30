
<main class="auth-layer-content">
    <div id="login-card" class="auth-glass-card">
        
        
        <header class="auth-card-header">
            
            <div class="auth-icon-container">
                <?php if (isset($component)) { $__componentOriginalbfc641e0710ce04e5fe02876ffc6f950 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament::components.icon','data' => ['icon' => 'heroicon-o-shield-check','class' => 'auth-icon-symbol']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament::icon'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['icon' => 'heroicon-o-shield-check','class' => 'auth-icon-symbol']); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950)): ?>
<?php $attributes = $__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950; ?>
<?php unset($__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbfc641e0710ce04e5fe02876ffc6f950)): ?>
<?php $component = $__componentOriginalbfc641e0710ce04e5fe02876ffc6f950; ?>
<?php unset($__componentOriginalbfc641e0710ce04e5fe02876ffc6f950); ?>
<?php endif; ?>
            </div>

            
            <h1 class="auth-title-brand">
                <?php echo e(filament()->getBrandName() ?? 'Pensiun Mudah'); ?>

            </h1>

            
            <div class="auth-badge">
                <span class="auth-badge-dot"></span>
                <span class="auth-badge-label">
                    Administrator
                </span>
            </div>

            
            <h2 class="auth-card-heading">
                <?php echo e($this->getHeading()); ?>

            </h2>

            
            <p class="auth-card-subheading">
                Sign in to dashboard admin.
            </p>
        </header>

        
        <div class="w-full">
            <?php echo e($slot); ?>

        </div>
    </div>
</main>
<?php /**PATH C:\laragon\www\Pensiun-Mudah\resources\views/components/filament-auth/card.blade.php ENDPATH**/ ?>