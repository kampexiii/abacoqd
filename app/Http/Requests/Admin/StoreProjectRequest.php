<?php

namespace App\Http\Requests\Admin;

class StoreProjectRequest extends ProjectRequest
{
    protected function ignoreProjectId(): ?int
    {
        return null;
    }
}
