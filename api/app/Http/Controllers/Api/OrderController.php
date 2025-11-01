<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index()
    {
        $user = Auth::user();
        $orders = Order::with('items.product')->where('user_id', $user->id)->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created order from the Admin.
     *
     * @throws \Throwable
     */
    public function storeByAdmin(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,paid,shipped,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $total = 0;
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $total += $product->price * $item['quantity'];
        }

        $order = Order::create([
            'user_id' => $validated['user_id'],
            'status' => $validated['status'],
            'total' => $total,
        ]);

        foreach ($validated['items'] as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => Product::find($item['product_id'])->price,
            ]);
        }

        return response()->json($order->load('items.product'), 201);
    }

    /**
     * Store a newly created order from the user's cart.
     *
     * @throws \Throwable
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        try {
            DB::beginTransaction();

            $total = $cart->items->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($cart->items as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                $cartItem->product->decrement('stock', $cartItem->quantity);
            }

            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully from cart',
                'data' => $order->load('items.product'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Failed to create order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        $order->load('items.product');

        return response()->json($order);
    }

    /**
     * Update the specified order in storage (status).
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,shipped,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json(['message' => 'Order updated successfully', 'data' => $order]);
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
    /**
     * Remove the specified order from storage with admin privilege.
     */
    public function destroyByAdmin($id)
    {
        $order = Order::with('items')->find($id);

        if (! $order) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }

        try {
            // Supprimer les items liés à la commande
            $order->items()->delete();

            // Supprimer la commande
            $order->delete();

            return response()->json(['message' => 'Commande supprimée avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de la commande',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
