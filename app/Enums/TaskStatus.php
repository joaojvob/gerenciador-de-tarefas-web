<?php

namespace App\Enums;

enum TaskStatus: string
{
    case Backlog    = 'backlog';
    case Assigned   = 'assigned';
    case InProgress = 'in_progress';
    case Paused     = 'paused';
    case Completed  = 'completed';
    case Incomplete = 'incomplete';

    /**
     * Retorna o rótulo legível do status em português.
     */
    public function label(): string
    {
        return match($this) {
            self::Backlog    => 'Não Iniciada',
            self::Assigned   => 'Vinculada',
            self::InProgress => 'Em Andamento',
            self::Paused     => 'Pausada',
            self::Completed  => 'Concluída',
            self::Incomplete => 'Não Concluída',
        };
    }

    /**
     * Retorna a cor associada ao status (útil para o frontend).
     */
    public function color(): string
    {
        return match($this) {
            self::Backlog    => '#9CA3AF', // Gray (Muted)
            self::Assigned   => '#60A5FA', // Blue
            self::InProgress => '#F59E0B', // Amber
            self::Paused     => '#FBBF24', // Yellow
            self::Completed  => '#10B981', // Emerald
            self::Incomplete => '#EF4444', // Red (Destructive)
        };
    }
}
