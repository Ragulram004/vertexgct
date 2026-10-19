<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'registrations';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'application_id',
        'event_id',
        'team_leader_name',
        'team_leader_email',
        'team_leader_phone',
        'team_leader_department',
        'team_leader_year',
        'team_leader_college',
        'account_holder_name',
        'team_name',
        'team_count',
        'team_members',
        'ticket_id',
        'transaction_amount',
        'proof_of_payment_url',
        'transaction_id',
        'payment_status',
        'remark',
        'registered_at',
        'status',
        'arrival_status',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    
}
