<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'events';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'short_name',
        'image_url',
        'form_url',
        'type',
        'rulebook_url',
        'domain',
        'tag',
        'fee',
        'deadline',
        'team_count',
        'team_formation',
        'problem_url',
        'introduction',
        'description',
        'info',
        'eligibility',
        'faculty_contacts',
        'student_contacts',
        'contact_email',
        'status',
        'event_day',
    ];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
    
}
