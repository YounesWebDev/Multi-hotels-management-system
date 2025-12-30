<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class Tenant extends Model
{
    use HasFactory;
    protected $primaryKey = 'tenant_id';

    protected $fillable = [
        'hotel_name',
        'address',
        'contact_number'
    ];

    public $timestamps = false;

    public function rooms(){
        return $this->hasMany(\App\Models\Room::class , 'tenant_id' , 'tenant_id');
    }
}
