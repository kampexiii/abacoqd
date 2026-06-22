<?php

namespace App\Http\Requests\Admin;

class StorePartnerRequest extends PartnerRequest
{
    protected function ignorePartnerId(): ?int
    {
        return null;
    }
}
