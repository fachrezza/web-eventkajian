<?php

namespace App\Services;

use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QRCodeService
{
    public function generate($token)
    {
        return QrCode::size(300)
            ->generate($token);
    }
}