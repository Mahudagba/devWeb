<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;

class AdminStatsController extends Controller
{
    public function index()
    {
        // Nombre total de produits
        $totalProducts = Product::count();

        // Nombre total de Categories
        $totalCategories = Category::count();

        // Nombre total de commandes
        $totalOrders = Order::count();

        // Nombre total d'utilisateurs
        $totalUsers = User::count();

        // Total des ventes (uniquement les commandes "paid" ou "completed")
        $totalRevenue = Order::whereIn('status', ['paid', 'completed'])->sum('total');

        // Commandes en attente
        $pendingOrders = Order::where('status', 'pending')->count();

        // Commandes annulées
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // Pourcentage de commandes livrées
        $shippedOrders = Order::whereIn('status', ['shipped', 'completed'])->count();
        $completionRate = $totalOrders > 0
            ? round(($shippedOrders / $totalOrders) * 100, 2)
            : 0;

        return response()->json([
            'totalProducts'   => $totalProducts,
            'totalOrders'     => $totalOrders,
            'totalRevenue'    => $totalRevenue,
            'pendingOrders'   => $pendingOrders,
            'cancelledOrders' => $cancelledOrders,
            'completionRate'  => $completionRate,
            'totalUsers'      => $totalUsers,
            'totalCategories' => $totalCategories,
        ]);
    }

    /**
     * Créer un administrateur
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $admin = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'admin', 
        ]);

        return response()->json([
            'message' => 'Administrateur créé avec succès',
            'data'    => $admin
        ], 201);
    }

    /**
     * Supprimer un administrateur
     */
    public function destroy($id)
    {
        $admin = User::where('role', 'admin')->findOrFail($id);
        $admin->delete();

        return response()->json(['message' => 'Administrateur supprimé avec succès']);
    }
}
