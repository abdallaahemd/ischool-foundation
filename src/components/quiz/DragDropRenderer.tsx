import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DragDropQuestion, AnswerValue } from "@/lib/quiz/types";

interface Props {
  question: DragDropQuestion;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

function Draggable({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex cursor-grab items-center gap-2 rounded-xl border-2 border-accent/40 bg-accent/10 px-3 py-2 text-sm font-medium text-accent-deep shadow-soft active:cursor-grabbing",
        isDragging && "opacity-60",
      )}
    >
      <GripVertical className="size-4" />
      {label}
    </div>
  );
}

function DropZone({ id, label, current }: { id: string; label: string; current?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3">
      <span className="flex-1 font-medium">{label}</span>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-12 min-w-32 items-center justify-center rounded-xl border-2 border-dashed px-3 py-2 text-sm transition-colors",
          isOver ? "border-primary bg-primary/5" : "border-border bg-muted/30",
          current && "border-primary bg-primary/5 text-primary",
        )}
      >
        {current ?? <span className="text-muted-foreground">Drop here</span>}
      </div>
    </div>
  );
}

export function DragDropRenderer({ question, value, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (!value || value.type !== "drag-drop") {
      onChange({ type: "drag-drop", mapping: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const mapping = value?.type === "drag-drop" ? value.mapping : {};

  // Shuffled right options (stable per question)
  const rights = useMemo(() => {
    const all = question.pairs.map((p) => p.right);
    return [...all].sort(() => 0.5 - Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const used = new Set(Object.values(mapping));
  const available = rights.filter((r) => !used.has(r));
  const [tick, setTick] = useState(0);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const dragged = String(active.id).replace(/^drag-/, "");
    const left = String(over.id).replace(/^drop-/, "");
    const next = { ...mapping };
    // remove dragged from any other slot
    for (const k of Object.keys(next)) if (next[k] === dragged) delete next[k];
    next[left] = dragged;
    onChange({ type: "drag-drop", mapping: next });
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Drag each item on the right to its match on the left.</p>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            {question.pairs.map((p) => (
              <DropZone key={p.left} id={`drop-${p.left}`} label={p.left} current={mapping[p.left]} />
            ))}
          </div>
          <div className="flex flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 p-4" key={tick}>
            {available.length === 0 ? (
              <p className="text-sm text-muted-foreground">All items placed.</p>
            ) : (
              available.map((r) => <Draggable key={r} id={`drag-${r}`} label={r} />)
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
