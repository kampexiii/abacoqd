<?php

namespace App\Http\Requests\Admin;

use App\Models\Post;

class UpdatePostRequest extends PostRequest
{
    protected function ignorePostId(): ?int
    {
        $post = $this->route('post');

        return $post instanceof Post ? $post->id : null;
    }
}
