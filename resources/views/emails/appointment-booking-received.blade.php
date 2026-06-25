<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>Nueva reserva desde AbacoQD</title>
</head>
<body style="margin:0; padding:0; width:100%; background-color:#F6F8F7; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#F6F8F7;">
        Nueva reserva confirmada desde el sitio de Abaco Developments.
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
                            <span style="display:inline-block; padding:6px 14px; background-color:#E6F7F4; color:#00897B; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; border-radius:999px;">Nueva reserva</span>
                            <h1 style="margin:18px 0 6px 0; font-size:22px; font-weight:700; color:#0D1117; line-height:1.3;">Nueva reserva desde AbacoQD</h1>
                            <p style="margin:0; font-size:15px; color:#4A5A63; line-height:1.6;">Se ha registrado una nueva reserva desde el sitio. Estos son los datos.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 40px 8px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; width:150px; vertical-align:top;">Nombre</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#0D1117; font-size:15px; vertical-align:top;">{{ $booking->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Email</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; font-size:15px; vertical-align:top;"><a href="mailto:{{ $booking->email }}" style="color:#00897B; text-decoration:none;">{{ $booking->email }}</a></td>
                                </tr>
                                @if ($booking->phone)
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Teléfono</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#0D1117; font-size:15px; vertical-align:top;">{{ $booking->phone }}</td>
                                </tr>
                                @endif
                                @if ($booking->company)
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Empresa</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#0D1117; font-size:15px; vertical-align:top;">{{ $booking->company }}</td>
                                </tr>
                                @endif
                                @if ($serviceTitle)
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Servicio de interés</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#0D1117; font-size:15px; vertical-align:top;">{{ $serviceTitle }}</td>
                                </tr>
                                @endif
                                @if ($booking->slot)
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Fecha de la reserva</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#0D1117; font-size:15px; vertical-align:top;">{{ $booking->slot->starts_at->format('d/m/Y') }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Hora de la reserva</td>
                                    <td style="padding:12px 0; border-bottom:1px solid #E6ECEF; color:#0D1117; font-size:15px; vertical-align:top;">{{ $booking->slot->starts_at->format('H:i') }}&ndash;{{ $booking->slot->ends_at->format('H:i') }}</td>
                                </tr>
                                @endif
                                <tr>
                                    <td style="padding:12px 0; color:#4A5A63; font-size:13px; font-weight:600; vertical-align:top;">Fecha de creación</td>
                                    <td style="padding:12px 0; color:#0D1117; font-size:15px; vertical-align:top;">{{ $booking->created_at?->format('d/m/Y H:i') }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @if ($booking->message)
                    <tr>
                        <td style="padding:16px 40px 8px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <div style="font-size:13px; font-weight:600; color:#4A5A63; margin-bottom:8px;">Mensaje</div>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:16px 20px; background-color:#F6F8F7; border-left:4px solid #00BFA5; border-radius:8px; color:#0D1117; font-size:15px; line-height:1.6;">{{ $booking->message }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif
                    <tr>
                        <td style="padding:8px 40px 4px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:8px 0; color:#4A5A63; font-size:13px;">
                                        <strong style="color:#4A5A63; font-weight:600;">Consentimiento de privacidad:</strong> {{ $booking->privacy_consent_accepted_at ? 'Sí · '.$booking->privacy_consent_accepted_at->format('d/m/Y H:i') : 'No' }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0; color:#4A5A63; font-size:13px;">
                                        <strong style="color:#4A5A63; font-weight:600;">Consentimiento comercial:</strong> {{ $booking->marketing_consent_accepted_at ? 'Sí · '.$booking->marketing_consent_accepted_at->format('d/m/Y H:i') : 'No' }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 40px 36px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:14px 18px; background-color:#F6F8F7; border:1px solid #E6ECEF; border-radius:8px; color:#4A5A63; font-size:13px; line-height:1.5;">
                                        <span style="display:inline-block; width:8px; height:8px; background-color:#00BFA5; border-radius:50%; margin-right:8px;"></span>Registrada en el panel de administración en estado &ldquo;{{ $booking->status?->value }}&rdquo;.
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
                            Email automático generado desde el sitio web.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
