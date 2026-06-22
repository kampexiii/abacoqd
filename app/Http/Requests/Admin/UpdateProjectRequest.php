<?php

namespace App\Http\Requests\Admin;

use App\Models\Project;

class UpdateProjectRequest extends ProjectRequest
{
    protected function ignoreProjectId(): ?int
    {
        $project = $this->route('project');

        return $project instanceof Project ? $project->id : null;
    }
}
