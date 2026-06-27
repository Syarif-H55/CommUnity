<?php

namespace App\Enums;

class OrganizationRole
{
    public const PENYELENGGARA = 'Penyelenggara';
    public const KOORDINATOR_EVENT = 'Koordinator Event';

    public static function all(): array
    {
        return [self::PENYELENGGARA, self::KOORDINATOR_EVENT];
    }
}
