import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import api from '../lib/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/api/admin/workspaces/dashboard');
        setMetrics(data.data);
      } catch (error) {
        console.error("Erro ao puxar dados do BI", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse">Carregando Hub Global...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Super Admin Hub</h1>
          <span className="text-sm font-medium text-muted-foreground mr-4">
            Gestão Global
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Workspaces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground">{metrics?.total_workspaces}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground">{metrics?.total_users}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Tarefas (Plataforma)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-primary">{metrics?.total_tasks}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">Planos Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-accent">{metrics?.plans_distribution?.premium}</div>
              <p className="text-xs text-muted-foreground mt-2">{metrics?.plans_distribution?.free} contas free</p>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card rounded-xl border border-border/50 p-6 min-h-[400px]">
          <h2 className="text-xl font-bold mb-4">Lista de Tenants</h2>
          <div className="text-center mt-20">
            <p className="text-muted-foreground">Datatable de tenants com expansão de detalhes em construção.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
