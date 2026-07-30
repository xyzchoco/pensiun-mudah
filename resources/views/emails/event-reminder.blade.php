<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengingat Event</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header h1 {
            color: #FF8928;
            font-size: 24px;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin-bottom: 10px;
        }
        .event-details {
            background-color: #f9f9f9;
            border-left: 4px solid #FF8928;
            padding: 15px;
            margin: 20px 0;
        }
        .event-details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #777;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            background-color: #008740;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pengingat Event!</h1>
        </div>
        <div class="content">
            <p>Halo {{ $user->name }},</p>
            <p>Event <strong>{{ $webinar->judul }}</strong> akan segera dimulai dalam 1 jam lagi pada pukul {{ \Carbon\Carbon::parse($webinar->jam)->format('H:i') }} WIB.</p>

            @if ($webinar->jenis_event === 'Online')
                <p>Silakan bergabung melalui link berikut:</p>
                <p style="text-align: center;">
                    <a href="{{ $webinar->lokasi_link }}" class="button">Masuk ke Zoom/Meet</a>
                </p>
            @else
                <p>Event akan dilaksanakan di lokasi berikut:</p>
                <div class="event-details">
                    <p><strong>Lokasi:</strong> {{ $webinar->lokasi_link ?? 'Lokasi akan dikonfirmasi' }}</p>
                </div>
            @endif

            <p>Kami menantikan kehadiran Anda!</p>
            <p>Jika ada pertanyaan, jangan ragu untuk menghubungi kami.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Pensiun Mudah. Semua hak dilindungi.</p>
        </div>
    </div>
</body>
</html>