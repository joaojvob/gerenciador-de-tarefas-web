import React from 'react';
import { Card, CardContent } from './Card';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './Button';

const STATUS_COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-muted' },
  { id: 'assigned', title: 'Vinculada', color: 'bg-blue-500/20 text-blue-500' },
  { id: 'in_progress', title: 'Em Andamento', color: 'bg-amber-500/20 text-amber-500' },
  { id: 'paused', title: 'Pausada', color: 'bg-yellow-500/20 text-yellow-500' },
  { id: 'completed', title: 'Concluída', color: 'bg-emerald-500/20 text-emerald-500' },
];

export default function KanbanBoard({ tasks = [], onStatusChange, onEditTask, roleInWorkspace }) {
  const { user } = useAuth();
  
  // Controle de Permissão Visual (ABAC/RBAC Client-side)
  // Super Admin ou Gestores (owner/admin) têm controle total
  const isManager = user?.is_super_admin || roleInWorkspace === 'owner' || roleInWorkspace === 'admin';

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
      {STATUS_COLUMNS.map((column) => (
        <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col gap-3 rounded-xl bg-card/30 border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold text-sm px-3 py-1 rounded-full ${column.color}`}>
              {column.title}
            </h3>
            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {tasks.filter(t => t.status === column.id).map(task => {
              const myTask = task.assigned_to === user?.id;
              
              return (
                <Card key={task.id} className="glass-card border-border/60 hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm leading-tight text-foreground">{task.title}</h4>
                      {/* Edit só aparece se for gestor ou criador */}
                      {(isManager || task.created_by === user?.id) && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onEditTask(task)}>
                          <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Button>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                          {task.assignee ? task.assignee.name.charAt(0) : '?'}
                        </div>
                        <span className="text-[10px] text-muted-foreground trunc">
                           {task.assignee ? task.assignee.name : 'Unassigned'}
                        </span>
                      </div>
                      
                      {/* Ações rápidas de mover status (Simulação Drag & Drop) */}
                      {(isManager || myTask) && (
                        <select 
                          className="bg-transparent text-[10px] border border-border rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary text-muted-foreground"
                          value={task.status}
                          onChange={(e) => onStatusChange(task.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="" disabled>Mover...</option>
                          {STATUS_COLUMNS.map(col => (
                            <option key={col.id} value={col.id}>{col.title}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
