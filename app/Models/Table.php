<?php

namespace App\Models;

use App\Observers\TableObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;


#[ObservedBy([TableObserver::class])]

class Table extends Model
{
    use HasFactory;
 protected $fillable = [
        'table_name',
        'name',
        'date',
        'index',
        'category',
        'consummation',
        'puissance',
        'cos',
        'centre_id',
        'counter'
    ];
     public function centre()
    {
        return $this->belongsTo(Centre::class);
    }
    public function historics()
    {
        return $this->hasMany(Historic::class);
    }
}
