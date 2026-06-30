<?php

namespace App\Notifications\Auth;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends BaseResetPassword
{
    public function toMail($notifiable): MailMessage
    {
        $expireMinutes = (int) config(
            'auth.passwords.'.config('fortify.passwords', 'users').'.expire',
            60,
        );

        return (new MailMessage)
            ->subject('Restablece tu contraseña de AbacoQD')
            ->view('emails.auth.reset-password', [
                'expireMinutes' => $expireMinutes,
                'resetUrl' => $this->resetUrl($notifiable),
                'userEmail' => $notifiable->email,
                'userName' => $notifiable->name,
            ]);
    }
}
