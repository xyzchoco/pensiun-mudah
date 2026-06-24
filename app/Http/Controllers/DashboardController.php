<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DashboardBanner;
use App\Models\Webinar;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user->kategori_pensiun) {
            return redirect()->route('onboarding.kategori');
        }

        $banners = DashboardBanner::where('is_active', true)->latest()->get(); 
        $events = Webinar::where('is_published', true)->latest()->take(3)->get();
        $data = [
            'banners' => $banners,
            'events'  => $events,
        ];

        switch ($user->kategori_pensiun) {
            case 'korporat':
                return redirect()->route('korporat.dashboard'); 
                
            case 'asn':
                return Inertia::render('Asn/DashboardAsn', $data);
                
            case 'publik':
            default:
                return Inertia::render('Dashboard', $data); 
        }
    }
}