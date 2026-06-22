<?php

namespace App\Http\Requests\Admin;

class StorePostRequest extends PostRequest
{
    protected function ignorePostId(): ?int
    {
        return null;
    }
}
