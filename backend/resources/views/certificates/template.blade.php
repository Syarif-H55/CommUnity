<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sertifikat Partisipasi</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
        }
        .certificate-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            border: 15px solid #1a365d;
            box-sizing: border-box;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .certificate-content {
            text-align: center;
            padding: 60px 80px;
            width: 100%;
        }
        .certificate-title {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 10px;
        }
        .certificate-heading {
            font-size: 42px;
            color: #1a365d;
            font-weight: 700;
            margin-bottom: 30px;
            text-transform: uppercase;
        }
        .certificate-body {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.8;
            margin-bottom: 40px;
        }
        .volunteer-name {
            font-size: 36px;
            color: #2b6cb0;
            font-weight: 700;
            margin: 20px 0;
        }
        .event-title-text {
            font-size: 20px;
            color: #1a365d;
            font-weight: 600;
            margin: 10px 0;
        }
        .certificate-details {
            font-size: 14px;
            color: #718096;
            margin-top: 30px;
        }
        .certificate-number {
            font-size: 11px;
            color: #a0aec0;
            margin-top: 40px;
        }
        .divider {
            width: 200px;
            height: 3px;
            background: #2b6cb0;
            margin: 20px auto;
        }
        .organization-text {
            font-size: 16px;
            color: #2d3748;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="certificate-wrapper">
        <div class="certificate-content">
            <div class="certificate-title">Sertifikat Partisipasi</div>
            <div class="divider"></div>
            <div class="certificate-heading">Sertifikat Penghargaan</div>
            <div class="certificate-body">
                Diberikan kepada
            </div>
            <div class="volunteer-name">{{ $volunteerName }}</div>
            <div class="certificate-body">
                Atas partisipasi sebagai relawan dalam kegiatan
            </div>
            <div class="event-title-text">{{ $eventTitle }}</div>
            <div class="organization-text">{{ $organizationName }}</div>
            <div class="certificate-details">
                {{ $eventDate }} &mdash; {{ $eventLocation }}
            </div>
            <div class="certificate-details">
                Diterbitkan pada {{ $issuedAt }}
            </div>
            <div class="certificate-number">
                No. {{ $certificateNumber }}
            </div>
        </div>
    </div>
</body>
</html>
