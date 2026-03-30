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
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  password_confirmation: z.string().min(6, "Confirmação é obrigatória"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
});

export default function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      await authRegister(data);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erro ao registrar, verifique os dados preenchidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <Card className="w-full max-w-lg glass-card border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary"></div>
        
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Criar Workspace</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Cadastre-se e o seu ambiente pessoal será gerado automaticamente.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Seu Nome</Label>
              <Input 
                id="name" 
                placeholder="Carlos Alberto" 
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register('name')} 
              />
              {errors.name && <p className="text-destructive text-xs font-semibold">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail Corporativo</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nome@empresa.com" 
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register('email')} 
              />
              {errors.email && <p className="text-destructive text-xs font-semibold">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...register('password')} 
                />
                {errors.password && <p className="text-destructive text-xs font-semibold">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                <Input 
                  id="password_confirmation" 
                  type="password" 
                  placeholder="••••••••" 
                  className={errors.password_confirmation ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...register('password_confirmation')} 
                />
                {errors.password_confirmation && <p className="text-destructive text-xs font-semibold">{errors.password_confirmation.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg" loading={isSubmitting}>
              Cadastrar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Fazer Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
