import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const columns = [
  { id: 'todo', title: 'To Do', accent: 'border-slate-300', dot: 'bg-slate-400' },
  { id: 'in_progress', title: 'In Progress', accent: 'border-indigo-300', dot: 'bg-indigo-500' },
  { id: 'completed', title: 'Completed', accent: 'border-emerald-300', dot: 'bg-emerald-500' },
];

// Tolerate legacy statuses from before the Kanban model.
const legacyMap = { active: 'in_progress', on_hold: 'todo' };
const bucket = (p) => (columns.some((c) => c.id === p.status) ? p.status : legacyMap[p.status] || 'todo');

export default function ProjectKanban({ projects, onMove }) {
  const onDragEnd = (res) => {
    if (!res.destination || res.destination.droppableId === res.source.droppableId) return;
    onMove(res.draggableId, res.destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => {
          const items = projects.filter((p) => bucket(p) === col.id);
          return (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col rounded-2xl border-2 ${col.accent} bg-slate-50/60 p-3 min-h-[260px] ${snapshot.isDraggingOver ? 'ring-2 ring-indigo-300' : ''}`}>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className={`h-2 w-2 rounded-full ${col.dot}`} /> {col.title}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm">{items.length}</span>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {items.map((p, i) => (
                      <Draggable key={p.id} draggableId={p.id} index={i}>
                        {(prov, snap) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className={`rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition ${snap.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : 'hover:shadow-md'}`}>
                            <h4 className="text-sm font-semibold text-slate-900">{p.name}</h4>
                            {p.website && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><Globe className="h-3 w-3 shrink-0" /> {p.website}</p>}
                            <p className="mt-0.5 truncate text-xs text-slate-400">{p.client_email}</p>
                            <div className="mt-2.5 flex items-center gap-2"><Progress value={p.progress || 0} className="h-1.5" /><span className="text-xs font-medium text-slate-600">{p.progress || 0}%</span></div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {items.length === 0 && <p className="px-1 py-6 text-center text-xs text-slate-400">Drop projects here</p>}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}