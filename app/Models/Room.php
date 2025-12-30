<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $primaryKey = 'room_id';
    protected $fillable = [
        'tenant_id',
        'room_number',
        'type',
        'price_per_night',
        'status',
    ];

    public $timestamps = false;
}
