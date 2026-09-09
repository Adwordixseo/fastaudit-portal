import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, User } from 'lucide-react';
import { fmtDate } from '@/lib/format';

const columns = [
  { id: 'todo', title: 'To Do', accent: 'border-slate-300', dot: 'bg-slate-400' },
  { id: 'in_progress', title: 'In Progress', accent: 'border-indigo-300', dot: 'bg-indigo-500' },
  { id: 'review', title: 'Review', accent: 'border-amber-300', dot: 'bg-amber-500' },
];

const priorityTone = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function TeamTaskKanban({ tasks, onMove }) {
  const onDragEnd = (res) => {
    if (!res.destination || res.destination.droppableId === res.source.droppableId) return;
    onMove(res.draggableId, res.destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => {
          const items = tasks.filter((t) => t.status === col.id);
          return (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`flex flex-col rounded-2xl border-2 ${col.accent} bg-slate-50/60 p-3 min-h-[260px] ${snapshot.isDraggingOver ? 'ring-2 ring-indigo-300' : ''}`}>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className={`h-2 w-2 rounded-full ${col.dot}`} /> {col.title}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm">{items.length}</span>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {items.map((t, i) => (
                      <Draggable key={t.id} draggableId={t.id} index={i}>
                        {(prov, snap) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className={`rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition ${snap.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : 'hover:shadow-md'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-slate-900">{t.title}</h4>
                              {t.priority && <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${priorityTone[t.priority] || priorityTone.medium}`}>{t.priority}</span>}
                            </div>
                            {t.project_name && <p className="mt-1 text-xs text-slate-500">{t.project_name}</p>}
                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                              {t.assigned_to_name && <span className="flex items-center gap-1"><User className="h-3 w-3" /> {t.assigned_to_name}</span>}
                              {t.deadline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmtDate(t.deadline)}</span>}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {items.length === 0 && <p className="px-1 py-6 text-center text-xs text-slate-400">Drop tasks here</p>}
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