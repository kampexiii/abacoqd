<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>Restablece tu contraseña de AbacoQD</title>
</head>
<body style="margin:0; padding:0; width:100%; background-color:#F6F8F7; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#F6F8F7;">
        Restablece la contraseña de tu cuenta de AbacoQD desde este enlace seguro.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F6F8F7;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; width:100%; background-color:#FFFFFF; border:1px solid #E6ECEF; border-radius:14px; overflow:hidden;">
                    <tr>
                        <td style="font-size:0; line-height:0;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="84" style="height:4px; background-color:#A3E635; font-size:0; line-height:0;">&nbsp;</td>
                                    <td style="height:4px; background-color:#00BFA5; font-size:0; line-height:0;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 40px 8px 40px;">
                            <img src="{{ $message->embed(public_path('assets/branding/marca/logos/abacoqd-logo-completo-transparente.png')) }}" width="230" alt="AbacoQD — Abaco Quick Developments" style="display:block; width:230px; max-width:230px; height:auto; border:0; outline:none; text-decoration:none;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 40px 0 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <span style="display:inline-block; padding:6px 14px; background-color:#E6F7F4; color:#00897B; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; border-radius:999px;">Acceso seguro</span>
                            <h1 style="margin:18px 0 6px 0; font-size:22px; font-weight:700; color:#0D1117; line-height:1.3;">Restablece tu contraseña de AbacoQD</h1>
                            <p style="margin:0; font-size:15px; color:#4A5A63; line-height:1.6;">
                                Hola{{ $userName ? ', '.$userName : '' }}. Hemos recibido una solicitud para cambiar la contraseña de la cuenta
                                <strong style="color:#0D1117;">{{ $userEmail }}</strong>.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 40px 0 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:20px; background-color:#F6F8F7; border:1px solid #E6ECEF; border-radius:10px; color:#4A5A63; font-size:14px; line-height:1.7;">
                                        Pulsa en el botón para definir una nueva contraseña. Este enlace caduca en <strong style="color:#0D1117;">{{ $expireMinutes }} minutos</strong>.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:28px 40px 8px 40px;">
                            <a href="{{ $resetUrl }}" style="display:inline-block; padding:14px 24px; border-radius:10px; background-color:#A3E635; color:#0D1117; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:15px; font-weight:700; text-decoration:none;">Crear nueva contraseña</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 40px 8px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <p style="margin:0; font-size:13px; color:#4A5A63; line-height:1.7;">
                                Si el botón no funciona, copia y pega esta URL en tu navegador:
                            </p>
                            <p style="margin:12px 0 0 0; word-break:break-all;">
                                <a href="{{ $resetUrl }}" style="color:#00897B; font-size:13px; line-height:1.7; text-decoration:none;">{{ $resetUrl }}</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 40px 36px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:14px 18px; background-color:#F6F8F7; border:1px solid #E6ECEF; border-radius:8px; color:#4A5A63; font-size:13px; line-height:1.6;">
                                        Si no has solicitado este cambio, puedes ignorar este correo y tu contraseña actual seguirá siendo válida.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; width:100%;">
                    <tr>
                        <td style="padding:24px 40px; text-align:center; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#8A9AA3; font-size:12px; line-height:1.6;">
                            © 2026 AbacoQD. Todos los derechos reservados.<br>
                            Email automático generado desde el panel.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
