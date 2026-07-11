// Shared cross-demo nav — IDENTICAL in all three agentic demo apps (research
// pipeline, wellness chat, workflow engine). Only the `current` prop differs.
// Self-contained styling (scoped .agn-* classes) so it looks the same regardless
// of each app's own CSS.

const DEMOS = [
  { key: "research", label: "Research Pipeline", url: "https://multi-agent-research-pipeline.vercel.app" },
  { key: "wellness", label: "Wellness Chat", url: "https://wellness-crew-chat.vercel.app" },
  { key: "workflow", label: "Workflow Engine", url: "https://agentic-workflow-engine.vercel.app" },
];

const STYLE = `
.agn-bar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:6px 16px;background:#0d0d11;border-bottom:1px solid #23232b;color:#d8d8df;font-size:13px;line-height:1.2;position:sticky;top:0;z-index:60;font-family:inherit}
.agn-brand{color:#f0b45e;font-weight:700;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-right:8px;white-space:nowrap}
.agn-links{display:flex;align-items:center;gap:2px;flex-wrap:wrap}
.agn-link{color:#a9a9b4;text-decoration:none;padding:7px 11px;border-radius:7px;white-space:nowrap;transition:background .15s,color .15s}
.agn-link:hover{color:#fff;background:#1b1b22}
.agn-link.agn-active{color:#0d0d11;background:#f0b45e;font-weight:600}
.agn-about{margin-left:auto;color:#8a8a94;text-decoration:none;font-size:12px;white-space:nowrap}
.agn-about:hover{color:#f0b45e}
`;

export default function DemoNav({ current }: { current: string }) {
  return (
    <nav className="agn-bar" aria-label="Agentic AI demos">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <span className="agn-brand">◆ Agentic&nbsp;AI demos</span>
      <div className="agn-links">
        {DEMOS.map((d) => (
          <a
            key={d.key}
            href={d.url}
            className={"agn-link" + (d.key === current ? " agn-active" : "")}
            aria-current={d.key === current ? "page" : undefined}
          >
            {d.label}
          </a>
        ))}
      </div>
      <a className="agn-about" href="https://vandykeportfolio.com/projects/agentic-ai">
        About these demos ↗
      </a>
    </nav>
  );
}
