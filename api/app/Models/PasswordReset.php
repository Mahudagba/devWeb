<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 


class PasswordReset extends Model
{
use HasFactory, SoftDeletes;

    protected $table = 'password_resets';

    // Laravel ne gère pas de clé primaire ici (pas d'id)
    public $incrementing = false;
    protected $primaryKey = 'email';
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'email',
        'token',
        'is_used',
        'expires_at',
        'created_at',
    ];

    // Vérifie si le code est expiré
    public function isExpired(): bool
    {
        return $this->expires_at && Carbon::parse($this->expires_at)->isPast();
    }

    // Vérifie si le code est encore valide
    public function isValid(string $code): bool
    {
        return $this->token === $code && !$this->isExpired() && !$this->is_used;
    }
}
