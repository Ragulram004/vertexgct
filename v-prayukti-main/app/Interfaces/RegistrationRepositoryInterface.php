<?php

namespace App\Interfaces;

interface RegistrationRepositoryInterface
{
    public function store(array $data);
    public function getById($id);

}
