import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import type { EmailDigestItem } from "@/lib/types";

const PLACEHOLDER: EmailDigestItem[] = [
  {
    id: "1", account: "personal", sender: "hr@grab.com", subject: "Internship Application Update",
    summary: "Your application for the SWE internship has moved to the next round. Interview scheduled for Apr 14.",
    priority: "URGENT_ACTION", received_at: "2025-04-09T08:12:00Z", gmail_id: "",
  },
  {
    id: "2", account: "school", sender: "registrar@smu.edu.sg", subject: "Course Registration Opens Apr 10",
    summary: "Bidding for AY2025-26 Sem 1 opens tomorrow 9am. Check your BOSS credits.",
    priority: "URGENT_ACTION", received_at: "2025-04-09T07:44:00Z", gmail_id: "",
  },
  {
    id: "3", account: "personal", sender: "noreply@github.com", subject: "Security advisory for your repo",
    summary: "1 high-severity vulnerability in a dependency. Review and update.",
    priority: "READ_SOON", received_at: "2025-04-09T06:30:00Z", gmail_id: "",
  },
  {
    id: "4", account: "personal", sender: "newsletter@tldr.tech", subject: "TLDR Newsletter Apr 9",
    summary: "Daily tech roundup. OpenAI news, Rust 2025 edition, new Cloudflare features.",
    priority: "INFORMATIONAL", received_at: "2025-04-09T05:00:00Z", gmail_id: "",
  },
];

const priorityBadge: Record<string, React.ReactNode> = {
  URGENT_ACTION: <Badge variant="urgent">Urgent</Badge>,
  READ_SOON: <Badge variant="warn">Read Soon</Badge>,
  INFORMATIONAL: <Badge variant="dim">Info</Badge>,
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function InboxCard({ emails = PLACEHOLDER }: { emails?: EmailDigestItem[] }) {
  const urgent = emails.filter((e) => e.priority === "URGENT_ACTION");
  const rest = emails.filter((e) => e.priority !== "URGENT_ACTION" && e.priority !== "IRRELEVANT");

  return (
    <Card
      title="Inbox"
      accent={urgent.length > 0 ? "red" : "none"}
      action={urgent.length > 0 ? <span className="font-bold">{urgent.length} urgent</span> : undefined}
    >
      <div className="space-y-2">
        {[...urgent, ...rest].map((email, i) => (
          <div key={email.id}>
            {i > 0 && <Divider />}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  {priorityBadge[email.priority]}
                  <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{email.account}</span>
                  <span className="text-[10px] text-[var(--color-muted)]">{fmtTime(email.received_at)}</span>
                </div>
                <div className="text-[11px] font-bold truncate">{email.subject}</div>
                <div className="text-[11px] text-[var(--color-muted)] leading-snug mt-0.5">{email.summary}</div>
                <div className="text-[10px] text-[var(--color-dim)] mt-0.5">from {email.sender}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
