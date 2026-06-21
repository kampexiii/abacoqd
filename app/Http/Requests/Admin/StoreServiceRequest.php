<?php

namespace App\Http\Requests\Admin;

class StoreServiceRequest extends ServiceRequest
{
    protected function ignoreServiceId(): ?int
    {
        return null;
    }
}
