<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Registrasi Pensiun Mudah</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1B1C1C;
            background-color: #F6F3F2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 560px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .header {
            background: linear-gradient(135deg, #006B32, #3D7A2E);
            padding: 32px 36px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 20px;
            margin: 0;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header .brand {
            margin-bottom: 8px;
            font-size: 14px;
            color: rgba(255,255,255,0.85);
        }
        .header .brand strong {
            color: #FF8928;
        }
        .content {
            padding: 36px;
        }
        .content p {
            margin-bottom: 14px;
            font-size: 15px;
            color: #3D4A3E;
        }
        .otp-box {
            background: linear-gradient(135deg, #F6F3F2, #FBF9F8);
            border: 2px dashed #006B32;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: 12px;
            color: #006B32;
            font-family: 'Courier New', Courier, monospace;
            margin: 8px 0;
        }
        .otp-label {
            font-size: 13px;
            color: #6D7B6D;
            margin-top: 4px;
        }
        .warning {
            background-color: #FFF8F0;
            border-left: 4px solid #FF8928;
            padding: 14px 18px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            color: #8B6914;
        }
        .footer {
            text-align: center;
            padding: 24px 36px;
            border-top: 1px solid #E4E2E1;
            color: #6D7B6D;
            font-size: 12px;
        }
        .footer a {
            color: #006B32;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="brand">
                <strong>PENSIUN</strong>MUDAH
            </div>
            <h1>Kode Verifikasi Registrasi</h1>
        </div>

        <div class="content">
            <p>Halo <strong><?php echo e($userName); ?></strong>,</p>
            <p>Terima kasih telah mendaftar di Pensiun Mudah. Silakan gunakan kode OTP di bawah ini untuk melanjutkan proses registrasi:</p>

            <div class="otp-box">
                <div class="otp-code"><?php echo e($otpCode); ?></div>
                <div class="otp-label">Kode berlaku selama 5 menit</div>
            </div>

            <div class="warning">
                <strong>⚠️ Jangan bagikan kode ini kepada siapa pun,</strong> termasuk pihak yang mengaku dari Pensiun Mudah. Kami tidak akan pernah meminta kode OTP Anda.
            </div>

            <p>Jika Anda tidak merasa melakukan pendaftaran, abaikan email ini.</p>

            <p style="margin-top: 24px;">Salam hangat,<br><strong>Tim Pensiun Mudah</strong></p>
        </div>

        <div class="footer">
            <p>&copy; <?php echo e(date('Y')); ?> Pensiun Mudah. Semua hak dilindungi.</p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
            <p><a href="<?php echo e(config('app.url')); ?>"><?php echo e(config('app.url')); ?></a></p>
        </div>
    </div>
</body>
</html><?php /**PATH C:\laragon\www\Pensiun-Mudah\resources\views/emails/otp.blade.php ENDPATH**/ ?>