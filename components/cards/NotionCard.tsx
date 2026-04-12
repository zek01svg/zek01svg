import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { NotionTask } from "@/lib/types";

const PLACEHOLDER: NotionTask[] = [
  { id: "1", title: "Submit CS301 assignment", due_date: "2025-04-09", status: "In Progress", database_name: "School Tasks", url: "#", synced_at: "" },
  { id: "2", title: "Read 'Designing Data-Intensive Applications' Ch.5", due_date: "2025-04-10", status: "Not Started", database_name: "Reading List", url: "#", synced_at: "" },
  { id: "3", title: "Update resume with internship experience", due_date: "2025-04-11", status: "Not Started", database_name: "Personal", url: "#", synced_at: "" },
  { id: "4", title: "Prepare for Grab interview", due_date: "2025-04-14", status: "Not Started", database_name: "Internship", url: "#", synced_at: "" },
];

function fmtDate(d: string | null) {
  if (!d) return null;
  const date = new Date(d);
  const today = new Date();
  const diff = Math.ceil((date.getTime() - today.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff < 0) return <span className="text-[var(--color-red)]">overdue {Math.abs(diff)}d</span>;
  return `in ${diff}d`;
}

export function NotionCard({ tasks = PLACEHOLDER }: { tasks?: NotionTask[] }) {
  const overdue = tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date(new Date().setHours(0,0,0,0)));
  const accent = overdue.length > 0 ? "red" as const : "none" as const;

  return (
    <Card title="Notion" accent={accent} action={<span>{tasks.length} tasks</span>}>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div key={task.id}>
            {i > 0 && <Divider />}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <a href={task.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] font-bold leading-snug hover:underline block">
                  {task.title}
                </a>
                <div className="text-[10px] text-[var(--color-muted)] mt-0.5">{task.database_name}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[10px] text-[var(--color-muted)]">{fmtDate(task.due_date)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
