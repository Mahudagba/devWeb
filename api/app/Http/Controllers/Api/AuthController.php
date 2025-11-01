<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PasswordReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
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
        $abilities = ['place-orders', 'view-products', 'manage-profile'];
        if ($user->role == 'admin') {
            $abilities[] = 'manage-products';
            $abilities[] = 'manage-categories';
            $abilities[] = 'manage-stats';
            $abilities[] = 'manage-users';
            $abilities[] = 'manage-orders';
        }

        $token = $user->createToken('api_token', $abilities)->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]); // , 'abilities' => $abilities

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
        $abilities = ['place-orders', 'view-products', 'manage-profile'];
        if ($user->role == 'admin') {
            $abilities[] = 'manage-products';
            $abilities[] = 'manage-categories';
            $abilities[] = 'manage-stats';
            $abilities[] = 'manage-users';
            $abilities[] = 'canmanage-orders';
        }
        $token = $user->createToken('api_token', $abilities)->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201); // 'abilities' => $abilities

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
     *  User forgot Password.
     *
     * @unauthenticated
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $code = random_int(100000, 999999);

        PasswordReset::updateOrCreate(
            ['email' => $request->email],
            [
                'token' => $code,
                'is_used' => false,
                'expires_at' => now()->addMinutes(10),
                'created_at' => now(),
            ]
        );

        Mail::raw("Votre code de réinitialisation est : $code", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Code de réinitialisation du mot de passe');
        });

        return response()->json(['message' => 'Code envoyé à votre adresse e-mail.']);
    }

    /**
     *  User reset Password.
     *
     * @unauthenticated
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'password' => 'required|string|min:8|confirmed', // password_confirmation doit être envoyé aussi
        ]);

        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (! $reset) {
            return response()->json(['message' => 'Code invalide.'], 400);
        }

        $expiresAt = Carbon::parse($reset->created_at)->addMinutes(15);
        if (Carbon::now()->greaterThan($expiresAt)) {
            return response()->json(['message' => 'Code expiré.'], 400);
        }

        // Mise à jour du mot de passe
        $user = User::where('email', $request->email)->first();
        if (! $user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Suppression du token une fois utilisé
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);

        $reset = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (! $reset) {
            return response()->json(['message' => 'Code invalide.'], 400);
        }

        $expiresAt = Carbon::parse($reset->created_at)->addMinutes(15);
        if (Carbon::now()->greaterThan($expiresAt)) {
            return response()->json(['message' => 'Code expiré.'], 400);
        }

        return response()->json(['message' => 'Code valide.']);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Validation du mot de passe
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        // Vérification du mot de passe
        if (! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe est incorrect.',
            ], 403);
        }

        // Révocation des tokens (déconnexion)
        $user->tokens()->delete(); // Supprime tous les tokens de l’utilisateur

        // Suppression du compte
        DB::transaction(function () use ($user) {
        //     // supprimer aussi les données associées :
            $user->orders()->delete();

        $user->delete();
        });

        return response()->json([
            'message' => 'Votre compte a bien été supprimé et vous avez été déconnecté.',
        ]);
    }
}
