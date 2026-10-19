<?php

namespace App\Repositories;

use App\Interfaces\RegistrationRepositoryInterface;
use App\Models\Registration;

class RegistrationRepository implements RegistrationRepositoryInterface
{
    public function store(array $data)
    {
        return Registration::create($data); // Save the data to the database
    }
    
    public function getById($id)
    {
        return Registration::where('application_id',$id)->firstOrFail();
    }
}
