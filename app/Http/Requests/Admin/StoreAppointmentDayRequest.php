<?php

namespace App\Http\Requests\Admin;

class StoreAppointmentDayRequest extends AppointmentDayRequest
{
    protected function ignoreDayId(): ?int
    {
        return null;
    }
}
