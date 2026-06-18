<?php

namespace App\Enums;

enum PermissionStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Unknown = 'unknown';
}
