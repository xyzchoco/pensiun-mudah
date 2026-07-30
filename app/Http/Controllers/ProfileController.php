<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        $enrollments = \App\Models\Enrollment::where('user_id', $user->user_id)
            ->whereIn('status', ['active', 'completed'])
            ->get();
            
        $completedCount = 0;
        foreach ($enrollments as $enroll) {
            $executionDate = $enroll->tanggal_mulai ?: $enroll->course->tanggal_default;
            $isOfflinePassed = false;
            
            if ($enroll->course->tipe_kelas === 'Hybrid') {
                $session = \App\Models\SesiSeminar::where('course_id', $enroll->course_id)
                    ->where('status', 'disetujui')
                    ->first();
                if ($session) {
                    $sessionStart = \Carbon\Carbon::parse($session->tanggal->format('Y-m-d') . ' ' . \Carbon\Carbon::parse($session->jam)->format('H:i:s'));
                    $sessionEnd = $sessionStart->copy()->addHours(2);
                    if (now()->gt($sessionEnd)) {
                        $isOfflinePassed = true;
                    }
                }
            } elseif ($enroll->course->tipe_kelas === 'Offline') {
                if ($executionDate && \Carbon\Carbon::parse($executionDate)->startOfDay()->lt(now()->startOfDay())) {
                    $isOfflinePassed = true;
                }
            }
            
            $isFinished = $enroll->is_completed || $enroll->status === 'completed' || $isOfflinePassed;
            if ($enroll->course->tipe_kelas === 'Hybrid') {
                $isFinished = $isOfflinePassed;
            }
            
            if ($isFinished) {
                $completedCount++;
            }
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail'       => $user instanceof MustVerifyEmail,
            'status'                => session('status'),
            'completedCoursesCount' => $completedCount,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        \Illuminate\Support\Facades\Log::info('UPLOAD FOTO', [
            'hasFile' => $request->hasFile('photo'),
            'allFiles' => array_keys($request->allFiles()),
            'allInput' => $request->all(),
        ]);

        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');

        $user->profile_photo_path = $path;
        $user->save();

        return back()->with('status', 'Foto profil berhasil diperbarui.');
    }
}
