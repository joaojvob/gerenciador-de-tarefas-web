<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\TarefaVencimento;
use Illuminate\Bus\Queueable;
use App\Models\Tarefa;

class EnviarLembreteTarefa implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $tarefa;

    public function __construct(Tarefa $tarefa)
    {
        $this->tarefa = $tarefa;
    }

    public function handle()
    {
        Mail::to($this->tarefa->user->email)->send(new TarefaVencimento($this->tarefa));
    }
}
