<?php

namespace App\Enums;

enum TaskPriority: string
{
    case Low    = 'low';
    case Medium = 'medium';
    case High   = 'high';
    case Urgent = 'urgent';

    /**
     * Retorna o rótulo legível da prioridade em português.
     */
    public function label(): string
    {
        return match($this) {
            self::Low    => 'Baixa',
            self::Medium => 'Média',
            self::High   => 'Alta',
            self::Urgent => 'Urgente',
        };
    }

    /**
     * Retorna a cor associada à prioridade para uso no frontend.
     */
    public function color(): string
    {
        return match($this) {
            self::Low    => 'green',
            self::Medium => 'yellow',
            self::High   => 'orange',
            self::Urgent => 'red',
        };
    }
}
