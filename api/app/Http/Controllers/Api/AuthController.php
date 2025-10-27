<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{


    
    /**
     * Login User.
     *
     * @unauthenticated
     */
    public function login(Request $request)
    {
        //
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        //  $abilities = ['place-orders', 'view-products', 'manage-profile'];
        // if ($user->is_admin) {
            $abilities[] = 'manage-products';
            $abilities[] = 'manage-categories';
            $abilities[] = 'manage-stats';
            $abilities[] = 'manage-users';
            $abilities[] = 'manage-orders';
        // }

        $token = $user->createToken('api_token', $abilities)->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token, 'abilities' => $abilities  ]);

    }

    /**
     * Register Users.
     *
     * @unauthenticated
     */
    public function register(Request $request)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        // $abilities = ['place-orders', 'view-products', 'manage-profile'];
        // if ($user->is_admin) {
            $abilities[] = 'manage-products';
            $abilities[] = 'manage-categories';
            $abilities[] = 'manage-stats';
            $abilities[] = 'manage-users';
            $abilities[] = 'canmanage-orders';
        // }
        // $token = $user->createToken('api_token', $abilities)->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token, 'abilities' => $abilities ], 201);

    }

    /**
     * Display current user informations.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $user->update($request->only(['name', 'phone']));

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user,
        ]);
    }

    /**
     * Remove the current user token.
     */
    public function logout(Request $request)
    {

        $request->user()->currentAccessToken()->delete();

        //    return $request->headers->all();
        return response()->json(['message' => 'Logged out']);
    }
    /**
     * Liste des utilisateurs (admin only)
     */
    public function index()
    {
        // Retourner tous les utilisateurs avec quelques infos clés
        $users = User::select('id', 'name', 'email', 'phone', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }
}
