<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pendaftaran Event</title>
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
            color: #008740;
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
            border-left: 4px solid #008740;
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
            background-color: #FF8928;
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
            <h1>Pendaftaran Event Berhasil!</h1>
        </div>
        <div class="content">
            <p>Halo <?php echo e($user->name); ?>,</p>
            <p>Terima kasih telah mendaftar untuk event berikut:</p>

            <div class="event-details">
                <p><strong>Judul Event:</strong> <?php echo e($webinar->judul); ?></p>
                <p><strong>Tanggal:</strong> <?php echo e(\Carbon\Carbon::parse($webinar->tanggal)->locale('id')->isoFormat('D MMMM YYYY')); ?></p>
                <p><strong>Waktu:</strong> <?php echo e(\Carbon\Carbon::parse($webinar->jam)->format('H:i')); ?> WIB</p>
                <p><strong>Jenis Event:</strong> <?php echo e($webinar->jenis_event); ?></p>
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($webinar->jenis_event === 'Online'): ?>
                    <p>Link Zoom/Google Meet akan dikirim ke email Anda 1 jam sebelum event dimulai.</p>
                <?php else: ?>
                    <p><strong>Lokasi:</strong> <?php echo e($webinar->lokasi_link ?? 'Lokasi akan dikonfirmasi'); ?></p>
                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
            </div>

            <p>Kami menantikan kehadiran Anda!</p>
            <p>Jika ada pertanyaan, jangan ragu untuk menghubungi kami.</p>
        </div>
        <div class="footer">
            <p>&copy; <?php echo e(date('Y')); ?> Pensiun Mudah. Semua hak dilindungi.</p>
        </div>
    </div>
</body>
</html><?php /**PATH C:\laragon\www\Pensiun-Mudah\resources\views/emails/event-konfirmasi.blade.php ENDPATH**/ ?>