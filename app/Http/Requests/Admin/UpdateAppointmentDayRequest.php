<?php

namespace App\Http\Requests\Admin;

use App\Models\AppointmentDay;

class UpdateAppointmentDayRequest extends AppointmentDayRequest
{
    protected function ignoreDayId(): ?int
    {
        $day = $this->route('day');

        return $day instanceof AppointmentDay ? $day->id : null;
    }
}
