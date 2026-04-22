const glassPanel = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.07)",
};

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 items-start">

        {/* Left — glass panel around text only */}
        <div className="rounded-3xl p-8 md:p-10" style={glassPanel}>
          <p className="text-[11px] font-mono uppercase tracking-widest text-sky-600 mb-6">
            My Edge
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter leading-tight text-zinc-900 mb-8 max-w-[22ch]">
            Where 16 years of ops meets modern automation.
          </h2>
          <div className="space-y-4 text-base text-zinc-600 leading-relaxed max-w-[58ch]">
            <p>
              Most automation consultants either come from coding or from
              business — I come from both. Sixteen years running high-stakes BPO
              teams at Coinbase, ADP, and Cognizant means I know exactly where
              human work is fragile, repetitive, and expensive.
            </p>
            <p>
              That operational lens is what makes my automations different: I
              don&apos;t just connect APIs — I map the process first, find the
              real bottleneck, then build the workflow that actually sticks. From
              Xero reconciliation pipelines to AI-powered appointment setters to
              full YouTube Shorts creators — every system I ship is designed for
              real-world resilience, not just demos.
            </p>
          </div>
        </div>

        {/* Right — stat tiles, each with same glass */}
        <div className="md:pt-14 grid grid-cols-2 gap-4">
          {[
            { n: "16+", label: "Years in BPO Operations" },
            { n: "10+", label: "Production Workflows Built" },
            { n: "4",   label: "Automation Platforms" },
            { n: "3+",  label: "Years Crypto Support" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-5 flex flex-col gap-1"
              style={glassPanel}
            >
              <span className="text-3xl font-mono font-semibold text-zinc-900">{s.n}</span>
              <span className="text-xs text-zinc-700 leading-snug">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
