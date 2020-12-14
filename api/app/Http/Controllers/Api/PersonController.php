<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

use App\Repositories\PersonRepository;

class PersonController
{
    /**
     * Display a list of all persons.
     *
     * @return Response
     */
    public function index(PersonRepository $repository)
    {
        return Cache::tags('api')->remember('person-index', now()->addHour(), function () use ($repository) {
            return $repository->all();
        });
    }
}
