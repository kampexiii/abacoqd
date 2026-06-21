<?php

namespace App\Http\Requests\Admin;

use App\Models\Service;

class UpdateServiceRequest extends ServiceRequest
{
    protected function ignoreServiceId(): ?int
    {
        $service = $this->route('service');

        return $service instanceof Service ? $service->id : null;
    }
}
