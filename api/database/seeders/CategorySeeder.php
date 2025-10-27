<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $response = Http::get('http://dummyjson.com/products/categories');

        if ($response->successful()) {
            $categories = $response->json();

            foreach ($categories as $cat) {
                Category::updateOrCreate(
                    ['name' => $cat['name']],
                    [
                        'description' => $cat['name'] ?? null,
                    ]
                );
            }

            $this->command->info('Categories imported successfully from DummyJSON API.');
        } else {
            $this->command->error('Failed to fetch categories from DummyJSON.');
        }
    }
}
