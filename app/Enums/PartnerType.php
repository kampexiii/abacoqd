<?php

namespace App\Enums;

enum PartnerType: string
{
    case Client = 'client';
    case Collaborator = 'collaborator';
    case Provider = 'provider';
    case Institutional = 'institutional';
    case Other = 'other';
}
