<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Product extends Model
{
    use  SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'is_active',
        'image',
        'slug',
        
    ];
     public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }
}
