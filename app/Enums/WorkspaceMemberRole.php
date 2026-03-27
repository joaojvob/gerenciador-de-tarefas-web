<?php

namespace App\Enums;

enum WorkspaceMemberRole: string
{
    case Owner  = 'owner';
    case Admin  = 'admin';
    case Member = 'member';

    /**
     * Retorna o rótulo legível do papel em português.
     */
    public function label(): string
    {
        return match($this) {
            self::Owner  => 'Proprietário',
            self::Admin  => 'Administrador',
            self::Member => 'Membro',
        };
    }

    /**
     * Verifica se este papel possui permissão igual ou superior ao papel informado.
     *
     * Hierarquia: owner > admin > member
     */
    public function isAtLeast(self $role): bool
    {
        $hierarchy = [
            self::Member->value => 1,
            self::Admin->value  => 2,
            self::Owner->value  => 3,
        ];

        return $hierarchy[$this->value] >= $hierarchy[$role->value];
    }
}
