<?php

namespace App\Http\Requests\Admin;

use App\Models\Partner;

class UpdatePartnerRequest extends PartnerRequest
{
    protected function ignorePartnerId(): ?int
    {
        $partner = $this->route('partner');

        return $partner instanceof Partner ? $partner->id : null;
    }
}
