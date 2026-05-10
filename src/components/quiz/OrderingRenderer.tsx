import { useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { OrderingQuestion, AnswerValue } from "@/lib/quiz/types";

interface Props {
  question: OrderingQuestion;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}

function SortableItem({ id, label, position }: { id: string; label: string; position: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 shadow-soft active:cursor-grabbing"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        {position + 1}
      </span>
      <span className="flex-1 font-medium">{label}</span>
      <GripVertical className="size-5 text-muted-foreground" />
    </div>
  );
}

export function OrderingRenderer({ question, value, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Initialize order to displayed indices [0,1,2,...] (the items as shown)
  useEffect(() => {
    if (!value || value.type !== "ordering" || value.order.length !== question.items.length) {
      onChange({ type: "ordering", order: question.items.map((_, i) => i) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const order = value?.type === "ordering" ? value.order : question.items.map((_, i) => i);
  const ids = useMemo(() => order.map((i) => `item-${i}`), [order]);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newOrder = arrayMove(order, oldIndex, newIndex);
    onChange({ type: "ordering", order: newOrder });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Drag items to reorder them.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {order.map((itemIdx, position) => (
              <SortableItem key={itemIdx} id={`item-${itemIdx}`} label={question.items[itemIdx]} position={position} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
