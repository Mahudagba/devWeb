<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Webhook;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    /**
     * Crée une commande et génère la session Stripe
     */
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $total = collect($validated['items'])->sum(fn($item) => $item['price'] * $item['quantity']);

        // Création de la commande
        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
            'status' => 'pending',
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
            ]);
        }

        // // Création de la session Stripe
        // Stripe::setApiKey(config('services.stripe.secret'));

        // $lineItems = collect($validated['items'])->map(function ($item) {
        //     return [
        //         'price_data' => [
        //             'currency' => 'eur',
        //             'product_data' => [
        //                 'name' => 'Produit #' . $item['product_id'],
        //             ],
        //             'unit_amount' => intval($item['price'] * 100),
        //         ],
        //         'quantity' => $item['quantity'],
        //     ];
        // })->toArray();

        // $session = StripeSession::create([
        //     'payment_method_types' => ['card'],
        //     'line_items' => $lineItems,
        //     'mode' => 'payment',
        //     'success_url' => config('app.frontend_url') . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
        //     'cancel_url' => config('app.frontend_url') . '/checkout/cancel',
        //     'metadata' => [
        //         'order_id' => $order->id,
        //         'user_id' => $user->id,
        //     ],
        // ]);

        // Retourner la session Stripe au front
        return response()->json([
            'message' => 'Commande créée avec succès.',
            'order' => $order,
            // 'stripe_session_url' => $session->url,
            // 'stripe_session_id' => $session->id,
        ]);
    }

    /**
     * Webhook Stripe — pour mettre à jour le statut de la commande
     */
    public function stripeWebhook(Request $request)
    {
        $endpoint_secret = config('services.stripe.webhook_secret');

        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderId = $session->metadata->order_id ?? null;

            if ($orderId) {
                $order = Order::find($orderId);
                if ($order) {
                    $order->update(['status' => 'paid']);
                    Log::info("Commande #{$order->id} payée avec succès via Stripe.");
                }
            }
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Liste des commandes (pour admin)
     */
    public function index()
    {
        $orders = Order::with('user', 'items.product')->get();
        return response()->json($orders);
    }

    /**
     * Détails d'une commande (admin ou user)
     */
    public function show($id)
    {
        $order = Order::with('user', 'items.product')->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Annuler une commande (avant paiement)
     */
    public function cancel($id)
    {
        $order = Order::findOrFail($id);
        if ($order->status === 'pending') {
            $order->update(['status' => 'cancelled']);
            return response()->json(['message' => 'Commande annulée.']);
        }

        return response()->json(['message' => "Impossible d'annuler une commande déjà payée."], 400);
    }

    public function updateStatus(Request $request, $id)
    {
        // Validation
        $request->validate([
            'status' => 'required|string|in:pending,paid,shipped,completed,cancelled',
        ]);

        // Récupérer la commande
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        // Vérifier qu'on ne modifie pas une commande annulée
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Impossible de modifier une commande annulée'], 403);
        }

        // Mise à jour du statut
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Statut de la commande mis à jour avec succès',
            'order' => $order,
        ], 200);
    }
}
