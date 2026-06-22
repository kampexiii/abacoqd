<?php

namespace App\Http\Requests\Admin;

use App\Models\TeamMember;

class UpdateTeamMemberRequest extends TeamMemberRequest
{
    protected function ignoreTeamMemberId(): ?int
    {
        $teamMember = $this->route('teamMember');

        return $teamMember instanceof TeamMember ? $teamMember->id : null;
    }
}
