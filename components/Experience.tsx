"use client";

import { useEffect, useRef } from "react";

const ROLES = [
  {
    title: "Customer Service Representative II (Resolution Desk Agent)",
    company: "Coinbase Philippines Inc.",
    location: "Taguig, Philippines",
    period: "May 2022 – Oct 2025",
    bullets: [
      "Responded to complex account-related inquiries via email and chat, guiding frontline agents on solutions and achieving consistent KPI excellence and high customer satisfaction scores.",
      "Managed sensitive data in full compliance with KYC/AML standards while collaborating with cross-functional teams and US onshore partners to enhance user experience.",
      "Leveraged deep cryptocurrency and blockchain knowledge to deliver accurate, timely responses and stay ahead of industry trends.",
      "Identified recurring issues (including OOSLA cases), documented insights, and proactively rendered overtime to reduce backlog.",
    ],
  },
  {
    title: "Senior Process Executive",
    company: "Cognizant Technology Solutions Philippines, Inc.",
    location: "Taguig, Philippines",
    period: "Nov 2019 – Mar 2022",
    bullets: [
      "Delivered front-line technical support for a major US live-TV streaming service — 40–60 daily cases across phone, email, and 3 concurrent chats.",
      "Partnered with internal teams to resolve issues, incorporate customer feedback, and implement process enhancements.",
      "Applied strong problem-solving in hardware/software troubleshooting — directly transferable to cryptocurrency transaction support.",
    ],
  },
  {
    title: "Team Leader",
    company: "Automatic Data Processing (ADP Philippines)",
    location: "Makati City, Philippines",
    period: "Oct 2014 – Aug 2017",
    bullets: [
      "Led a high-performing service center team for US payroll and benefits clients, consistently meeting service-level metrics.",
      "Provided regular feedback, coaching, and annual performance reviews while managing full-cycle recruitment and training.",
      "Identified process gaps through associate input and drove continuous improvements.",
    ],
  },
  {
    title: "Payroll/Benefits Senior Analyst (Tier 2 Rep)",
    company: "Automatic Data Processing (ADP Philippines)",
    location: "Makati City, Philippines",
    period: "May 2011 – Sep 2014",
    bullets: [
      "Delivered expert research and guidance on complex U.S. payroll and benefits inquiries, achieving first-call resolution.",
      "Mentored Tier 1 associates while handling sensitive financial data with KYC/AML-level risk awareness.",
    ],
  },
  {
    title: "Elite Servicing Group — Escalations Specialist",
    company: "Sykes Asia (US Credit Card Company)",
    location: "Makati City, Philippines",
    period: "Apr 2007 – Apr 2011",
    bullets: [
      "Managed escalated high-complexity calls using advanced tools, coached frontline agents, and prepared daily reports driving process improvements.",
      "Handled policy-driven requests (APR reductions, credit limit increases, membership fees).",
      "Resolved diverse cardholder inquiries as a frontline agent with speed, accuracy, and resourcefulness.",
    ],
  },
];

function TimelineItem({ role, index }: { role: typeof ROLES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("opacity-100", "translate-y-0");
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] grid grid-cols-[auto_1fr] gap-6"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center gap-0">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-accent bg-white dark:bg-zinc-950 mt-1.5 shrink-0" />
        {index < ROLES.length - 1 && (
          <div className="w-px flex-1 bg-zinc-100 dark:bg-zinc-800 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{role.title}</h3>
          <span className="shrink-0 text-[10px] font-mono text-zinc-400">{role.period}</span>
        </div>
        <p className="text-xs text-accent font-mono mb-4">{role.company} · {role.location}</p>
        <ul className="space-y-2">
          {role.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto border-t border-zinc-100 dark:border-zinc-800">
      <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-6">Professional Experience</p>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 dark:text-zinc-100 mb-16 max-w-[24ch] leading-tight">
        16 years of building better operations.
      </h2>

      <div className="max-w-3xl">
        {ROLES.map((role, i) => (
          <TimelineItem key={role.title} role={role} index={i} />
        ))}
      </div>
    </section>
  );
}
