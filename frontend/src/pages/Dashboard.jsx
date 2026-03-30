import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Gerenciador SaaS
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground mr-4">
              Olá, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="glass-card p-6 rounded-xl border border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total de Workspaces</h3>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tarefas Pendentes</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Membros</h3>
            <p className="text-3xl font-bold">1</p>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-border/50 p-6 min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Nenhum dado selecionado</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Selecione um workspace no menu lateral (em breve) para visualizar as tarefas e membros detalhados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
