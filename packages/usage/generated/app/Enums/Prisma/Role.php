<?php

namespace App\Enums\Prisma;

enum Role: string
{
    case GUEST = '1';

    case MODERATOR = '2';

    case ADMIN = '3';
}
