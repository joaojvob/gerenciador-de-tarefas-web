<?php

namespace App\Enums;

enum TaskStatus: string
{
    case Pending    = 'pending';
    case InProgress = 'in_progress';
    case Completed  = 'completed';
    case Cancelled  = 'cancelled';

    /**
     * Retorna o rótulo legível do status em português.
     */
    public function label(): string
    {
        return match($this) {
            self::Pending    => 'Pendente',
            self::InProgress => 'Em Andamento',
            self::Completed  => 'Concluída',
            self::Cancelled  => 'Cancelada',
        };
    }

    /**
     * Retorna a cor associada ao status para uso no frontend.
     */
    public function color(): string
    {
        return match($this) {
            self::Pending    => 'gray',
            self::InProgress => 'blue',
            self::Completed  => 'green',
            self::Cancelled  => 'red',
        };
    }
}
