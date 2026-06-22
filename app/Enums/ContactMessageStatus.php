<?php

namespace App\Enums;

enum ContactMessageStatus: string
{
    case New = 'new';
    case InReview = 'in_review';
    case Contacted = 'contacted';
    case Converted = 'converted';
    case Discarded = 'discarded';
    case Spam = 'spam';
    case Archived = 'archived';
}
