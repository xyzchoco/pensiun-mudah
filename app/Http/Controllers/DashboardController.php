<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\Webinar;

class DashboardController extends Controller
{
    public function index()
    {
        $banners = DashboardBanner::where('is_active', true)->latest()->get(); 
        $events = Webinar::where('is_published', true)->latest()->take(3)->get();

        return Inertia::render('Dashboard', [
            'banners' => $banners,
            'events'  => $events,
        ]);
    }
}