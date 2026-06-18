<?php

namespace App\Enums;

enum AppointmentSlotStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case Blocked = 'blocked';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
}
