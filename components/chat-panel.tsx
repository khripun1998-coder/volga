import { getChatThread } from "@/lib/demo";
import { sendMessage } from "@/app/account/actions";
import { cn } from "@/lib/utils";

export async function ChatPanel({
  threadKey,
  as,
}: {
  threadKey: string;
  as: "buyer" | "seller";
}) {
  const messages = await getChatThread(threadKey);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="max-h-80 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-sm text-muted">Сообщений пока нет — начните диалог.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === as ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm",
                m.sender === as ? "bg-accent text-white" : "bg-cream text-graphite"
              )}
            >
              <div className="mb-0.5 text-[11px] opacity-70">{m.authorName}</div>
              <div className="leading-relaxed">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <form action={sendMessage} className="flex gap-2 border-t border-line p-3">
        <input type="hidden" name="threadKey" value={threadKey} />
        <input type="hidden" name="sender" value={as} />
        <input
          name="text"
          placeholder="Сообщение…"
          autoComplete="off"
          className="h-10 flex-1 rounded-lg border border-line bg-paper px-3 text-sm text-graphite focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <button className="rounded-lg bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent-hover">
          Отправить
        </button>
      </form>
    </div>
  );
}
