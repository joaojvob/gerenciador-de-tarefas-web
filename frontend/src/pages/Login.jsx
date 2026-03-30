import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';

const schema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      await login(data);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erro ao efetuar login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark">
      {/* Background gradients for premium feel */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <Card className="w-full max-w-md glass-card border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
        
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Entre na sua conta para gerenciar seus workspaces
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nome@empresa.com" 
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register('email')} 
              />
              {errors.email && <p className="text-destructive text-xs font-semibold">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register('password')} 
              />
              {errors.password && <p className="text-destructive text-xs font-semibold">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-6" loading={isSubmitting}>
              Entrar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Ainda não tem uma conta?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Crie seu Workspace
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
