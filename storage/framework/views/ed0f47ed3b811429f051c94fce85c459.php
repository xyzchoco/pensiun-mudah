<div class="auth-page-root relative min-h-screen w-full overflow-x-hidden select-none">
    
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/filament/auth/auth.css', 'resources/js/filament/auth/auth.js']); ?>

    
    <?php if (isset($component)) { $__componentOriginal813d6f2d31d6e1c9acf8449de32a7f1d = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal813d6f2d31d6e1c9acf8449de32a7f1d = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.filament-auth.background','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-auth.background'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal813d6f2d31d6e1c9acf8449de32a7f1d)): ?>
<?php $attributes = $__attributesOriginal813d6f2d31d6e1c9acf8449de32a7f1d; ?>
<?php unset($__attributesOriginal813d6f2d31d6e1c9acf8449de32a7f1d); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal813d6f2d31d6e1c9acf8449de32a7f1d)): ?>
<?php $component = $__componentOriginal813d6f2d31d6e1c9acf8449de32a7f1d; ?>
<?php unset($__componentOriginal813d6f2d31d6e1c9acf8449de32a7f1d); ?>
<?php endif; ?>

    
    <?php if (isset($component)) { $__componentOriginal8a0a2b5badaa31f215b667b6e537f82a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal8a0a2b5badaa31f215b667b6e537f82a = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.filament-auth.interaction-layer','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-auth.interaction-layer'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal8a0a2b5badaa31f215b667b6e537f82a)): ?>
<?php $attributes = $__attributesOriginal8a0a2b5badaa31f215b667b6e537f82a; ?>
<?php unset($__attributesOriginal8a0a2b5badaa31f215b667b6e537f82a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal8a0a2b5badaa31f215b667b6e537f82a)): ?>
<?php $component = $__componentOriginal8a0a2b5badaa31f215b667b6e537f82a; ?>
<?php unset($__componentOriginal8a0a2b5badaa31f215b667b6e537f82a); ?>
<?php endif; ?>

    
    <?php if (isset($component)) { $__componentOriginal1090795810dd99f1cc2cce4ffc17c284 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal1090795810dd99f1cc2cce4ffc17c284 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.filament-auth.card','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-auth.card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

        <?php echo e(\Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE, scopes: $this->getRenderHookScopes())); ?>


        <form wire:submit="authenticate" class="w-full">
            <?php echo e($this->form); ?>


            <?php if (isset($component)) { $__componentOriginal59d80b1aec4ae4c914a3e52dede19504 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal59d80b1aec4ae4c914a3e52dede19504 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament::components.actions','data' => ['actions' => $this->getFormActions(),'fullWidth' => true,'class' => 'mt-6']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament::actions'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['actions' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($this->getFormActions()),'full-width' => true,'class' => 'mt-6']); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal59d80b1aec4ae4c914a3e52dede19504)): ?>
<?php $attributes = $__attributesOriginal59d80b1aec4ae4c914a3e52dede19504; ?>
<?php unset($__attributesOriginal59d80b1aec4ae4c914a3e52dede19504); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal59d80b1aec4ae4c914a3e52dede19504)): ?>
<?php $component = $__componentOriginal59d80b1aec4ae4c914a3e52dede19504; ?>
<?php unset($__componentOriginal59d80b1aec4ae4c914a3e52dede19504); ?>
<?php endif; ?>
        </form>

        <?php echo e(\Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::AUTH_LOGIN_FORM_AFTER, scopes: $this->getRenderHookScopes())); ?>

     <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal1090795810dd99f1cc2cce4ffc17c284)): ?>
<?php $attributes = $__attributesOriginal1090795810dd99f1cc2cce4ffc17c284; ?>
<?php unset($__attributesOriginal1090795810dd99f1cc2cce4ffc17c284); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal1090795810dd99f1cc2cce4ffc17c284)): ?>
<?php $component = $__componentOriginal1090795810dd99f1cc2cce4ffc17c284; ?>
<?php unset($__componentOriginal1090795810dd99f1cc2cce4ffc17c284); ?>
<?php endif; ?>
</div>
<?php /**PATH C:\laragon\www\Pensiun-Mudah\resources\views/filament/pages/auth/custom-login.blade.php ENDPATH**/ ?>