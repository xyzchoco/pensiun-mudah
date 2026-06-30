<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use App\Models\Course;
use App\Observers\CourseObserver;
use App\Models\Enrollment;
use App\Observers\EnrollmentObserver;
use App\Models\CorporateVoucher;
use App\Observers\CorporateVoucherObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Course::observe(CourseObserver::class);
        Enrollment::observe(EnrollmentObserver::class);
        CorporateVoucher::observe(CorporateVoucherObserver::class);
    }
}
