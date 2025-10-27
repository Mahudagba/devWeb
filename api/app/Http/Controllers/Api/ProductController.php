<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
     /**
     * Display products.
     * @unauthenticated
     *
     * @queryParam per_page integer Number of products per page. Default: 20. Example: 15
     * @queryParam page integer Page number. Example: 1
     * @queryParam search string Search in product name and description. Example: laptop
     * @queryParam categories array Filter by category IDs. Example: [5, 10]
     * @queryParam min_price numeric Filter by minimum price. Example: 100
     * @queryParam max_price numeric Filter by maximum price. Example: 1000
     * @queryParam in_stock boolean Filter products in stock (1) or out of stock (0). Example: 1
     * @queryParam is_active boolean Filter active (1) or inactive (0) products. Example: 1
     * @queryParam sort_by string Sort by field (name, price, created_at, stock). Default: created_at. Example: price
     * @queryParam sort_order string Sort order (asc, desc). Default: desc. Example: asc
     */
    public function index(Request $request)
    {
       
        $query = Product::with('categories');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // // Category filter
        // if ($request->filled('categories')) {
        //     $query->whereIn('category_id', $request->input('categories'));
        // }

        // Price range filters
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Stock filter
        if ($request->has('in_stock')) {
            $inStock = filter_var($request->input('in_stock'), FILTER_VALIDATE_BOOLEAN);
            if ($inStock) {
                $query->where('stock', '>', 0);
            } else {
                $query->where('stock', '<=', 0);
            }
        }

        // Active status filter
        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $allowedSortFields = ['name', 'price', 'created_at', 'stock', 'updated_at'];
        $allowedSortOrders = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $products = $query->get();

        return response()->json($products);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:products,name',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'slug' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string|max:255',
            'is_active' => 'sometimes|required|boolean',
        ]);

        $data = $request->only('name', 'description', 'price', 'stock', 'is_active');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }
        else if ($request->filled('image_url')) {
            $data['image'] = $request->input('image_url');
        }
        if(!$request->filled('slug')) {
            $data['slug'] = \Str::slug($request->input('name'));
        }

        $product = Product::create($data);
        $product->categories()->sync($request->input('categories'));

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified product.
     * @unauthenticated
     */
    public function show(Product $product)
    {
        $product->load('categories');
        return response()->json($product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|required|string|unique:products,name,' . $product->id,
            'categories' => 'sometimes|required|array',
            'categories.*' => 'exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string|max:255',
            'is_active' => 'sometimes|required|boolean',
        ]);

        $data = $request->only('name',  'description', 'price', 'stock', 'is_active');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }
        else if ($request->filled('image_url')) {
            $data['image'] = $request->input('image_url');
        }

        $product->update($data);

        if($request->has('categories')) {
            $product->categories()->sync($request->input('categories'));
        }


        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        // if ($product->image) {
        //     \Storage::disk('public')->delete($product->image);
        // }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
