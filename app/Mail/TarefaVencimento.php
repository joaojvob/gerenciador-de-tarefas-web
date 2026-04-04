<?php

namespace App\Mail;

use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\Tarefa;

class TarefaVencimento extends Mailable
{
    use Queueable, SerializesModels;

    public $tarefa;

    public function __construct(Tarefa $tarefa)
    {
        $this->tarefa = $tarefa;
    }

    public function build()
    {
        return $this->subject('Lembrete: Tarefa Próxima do Vencimento')->markdown('emails.tarefa_vencimento');
    }
}
