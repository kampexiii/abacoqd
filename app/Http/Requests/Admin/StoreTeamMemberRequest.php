<?php

namespace App\Http\Requests\Admin;

class StoreTeamMemberRequest extends TeamMemberRequest
{
    protected function ignoreTeamMemberId(): ?int
    {
        return null;
    }
}
