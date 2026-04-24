import { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, Copy, Check, Upload, Search, X,
  LayoutDashboard, Bot, Users, Shield, Heart, BookOpen, Map, Layers, MessageSquare,
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type View =
  | "overzicht"
  | "adoptie"
  | "gebruikers"
  | "shadowai"
  | "viva"
  | "letscopilot"
  | "journey"
  | "usecases"
  | "prompts";

type MaturityLevel = "Advanced" | "Intermediate" | "Developing" | "Inactive";

interface User {
  name: string;
  role: string;
  dept: string;
  activeDays: number;
  prompts: number;
  apps: string[];
  maturity: MaturityLevel;
}

interface ShadowApp {
  name: string;
  category: string;
  users: number;
  sessions: number;
  dataMB: number;
  risk: 1 | 2 | 3 | 4;
}

interface UseCase {
  title: string;
  apps: string[];
  industry: string;
  phase: string;
  difficulty: 1 | 2 | 3;
  timeSaved: string;
}

interface Prompt {
  title: string;
  app: string;
  category: string;
  text: string;
  saves: number;
}

interface LearnerProgress {
  name: string;
  topics: string[];
  lessons: number;
  totalLessons: number;
  lastActive: string;
  score: number;
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const TENANT = {
  name: "Demo Organisatie BV",
  industry: "Zakelijke Dienstverlening",
  licenses: 45,
  copilotLicenses: 18,
};

const LICENSING = {
  purchased: 18,
  unassigned: 4,
  notActive: 2,
  noLicense: 27,
};

const USERS: User[] = [
  { name: "Alex B.", role: "Sales Manager", dept: "Sales", activeDays: 8, prompts: 42, apps: ["Teams", "Outlook", "Word"], maturity: "Advanced" },
  { name: "Sam K.", role: "Marketing Spec.", dept: "Marketing", activeDays: 3, prompts: 12, apps: ["Teams"], maturity: "Developing" },
  { name: "Robin V.", role: "Directie", dept: "Management", activeDays: 10, prompts: 38, apps: ["Teams", "Outlook", "Word", "CopilotChat"], maturity: "Advanced" },
  { name: "Jamie L.", role: "Finance", dept: "Finance", activeDays: 2, prompts: 7, apps: ["Excel"], maturity: "Developing" },
  { name: "Morgan P.", role: "HR Manager", dept: "HR", activeDays: 5, prompts: 21, apps: ["Teams", "Word", "SharePoint"], maturity: "Intermediate" },
  { name: "Taylor S.", role: "Operations", dept: "Operations", activeDays: 0, prompts: 0, apps: [], maturity: "Inactive" },
  { name: "Casey W.", role: "IT Support", dept: "IT", activeDays: 7, prompts: 33, apps: ["Teams", "Outlook", "SharePoint"], maturity: "Advanced" },
  { name: "Jordan M.", role: "Project Manager", dept: "Operations", activeDays: 4, prompts: 16, apps: ["Teams", "Outlook"], maturity: "Intermediate" },
  { name: "Riley A.", role: "Customer Success", dept: "Sales", activeDays: 1, prompts: 3, apps: ["Outlook"], maturity: "Developing" },
  { name: "Avery D.", role: "Legal", dept: "Legal", activeDays: 0, prompts: 0, apps: [], maturity: "Inactive" },
  { name: "Quinn B.", role: "Strategy", dept: "Management", activeDays: 9, prompts: 45, apps: ["Teams", "Outlook", "Word", "PowerPoint"], maturity: "Advanced" },
  { name: "Drew F.", role: "Communications", dept: "Marketing", activeDays: 6, prompts: 28, apps: ["Outlook", "Word", "Teams"], maturity: "Intermediate" },
];

const SHADOW_APPS: ShadowApp[] = [
  { name: "ChatGPT", category: "Generatieve AI", users: 8, sessions: 1240, dataMB: 312.4, risk: 2 },
  { name: "Anthropic Claude", category: "Generatieve AI", users: 5, sessions: 680, dataMB: 89.2, risk: 2 },
  { name: "Grammarly", category: "Schrijfhulp", users: 4, sessions: 22000, dataMB: 445, risk: 1 },
  { name: "Perplexity", category: "AI Zoeken", users: 6, sessions: 890, dataMB: 124.6, risk: 2 },
  { name: "Gamma App", category: "Presentaties", users: 3, sessions: 145, dataMB: 88, risk: 3 },
  { name: "ElevenLabs", category: "Spraak AI", users: 2, sessions: 44, dataMB: 31.2, risk: 4 },
  { name: "v0 by Vercel", category: "Code AI", users: 3, sessions: 320, dataMB: 52, risk: 1 },
];

const VIVA = {
  focusHoursPerWeek: 11,
  afterHoursPerWeek: 4.2,
  meetingHoursPerWeek: 16,
  wellbeingScore: 68,
};

const LEARNER_PROGRESS: LearnerProgress[] = [
  { name: "Alex B.", topics: ["Teams", "Outlook", "Prompts"], lessons: 9, totalLessons: 10, lastActive: "2026-04-23", score: 88 },
  { name: "Sam K.", topics: ["Teams"], lessons: 4, totalLessons: 10, lastActive: "2026-04-18", score: 42 },
  { name: "Robin V.", topics: ["Teams", "Outlook", "Word", "Prompts", "Governance"], lessons: 10, totalLessons: 10, lastActive: "2026-04-22", score: 96 },
  { name: "Jamie L.", topics: ["Excel"], lessons: 3, totalLessons: 10, lastActive: "2026-04-15", score: 31 },
  { name: "Morgan P.", topics: ["Teams", "Word", "SharePoint"], lessons: 6, totalLessons: 10, lastActive: "2026-04-20", score: 62 },
  { name: "Taylor S.", topics: [], lessons: 0, totalLessons: 10, lastActive: "—", score: 0 },
  { name: "Casey W.", topics: ["Teams", "Outlook", "Prompts"], lessons: 8, totalLessons: 10, lastActive: "2026-04-21", score: 79 },
  { name: "Jordan M.", topics: ["Teams", "Outlook"], lessons: 5, totalLessons: 10, lastActive: "2026-04-19", score: 53 },
  { name: "Riley A.", topics: ["Teams"], lessons: 2, totalLessons: 10, lastActive: "2026-04-12", score: 22 },
  { name: "Avery D.", topics: [], lessons: 0, totalLessons: 10, lastActive: "—", score: 0 },
  { name: "Quinn B.", topics: ["Teams", "Outlook", "Word", "Prompts", "Excel"], lessons: 10, totalLessons: 10, lastActive: "2026-04-23", score: 94 },
  { name: "Drew F.", topics: ["Teams", "Outlook", "Word"], lessons: 7, totalLessons: 10, lastActive: "2026-04-22", score: 71 },
];

const USE_CASES: UseCase[] = [
  { title: "Vergadering samenvatten", apps: ["Teams"], industry: "Alle branches", phase: "Quick Wins", difficulty: 1, timeSaved: "45 min/week" },
  { title: "E-mail concept schrijven", apps: ["Outlook"], industry: "Alle branches", phase: "Quick Wins", difficulty: 1, timeSaved: "30 min/week" },
  { title: "Rapportage samenstellen", apps: ["Word", "Excel"], industry: "Zakelijke Dienstverlening", phase: "Uitrol", difficulty: 2, timeSaved: "90 min/week" },
  { title: "Klantvoorstel opstellen", apps: ["Word", "CopilotChat"], industry: "Verkoop/Advies", phase: "Quick Wins", difficulty: 2, timeSaved: "60 min/week" },
  { title: "Data analyseren in Excel", apps: ["Excel"], industry: "Finance/Operations", phase: "Uitrol", difficulty: 2, timeSaved: "75 min/week" },
  { title: "Beleidsdocument opstellen", apps: ["Word", "SharePoint"], industry: "HR/Legal", phase: "Governance", difficulty: 3, timeSaved: "120 min/week" },
  { title: "Nieuwsbrief schrijven", apps: ["Outlook", "Word"], industry: "Marketing/Communicatie", phase: "Quick Wins", difficulty: 1, timeSaved: "45 min/week" },
  { title: "Agent voor onboarding", apps: ["CopilotChat"], industry: "HR", phase: "Agents", difficulty: 3, timeSaved: "180 min/week" },
];

const PROMPTS: Prompt[] = [
  { title: "Vergadering samenvatten", app: "Teams", category: "Meetings", text: "Maak een beknopte samenvatting van deze vergadering. Noem de top 3 besluiten, actiepunten per persoon en de volgende stap.", saves: 14 },
  { title: "Mail samenvatten en acties", app: "Outlook", category: "E-mail", text: "Vat deze e-mailthread samen. Wat zijn de openstaande vragen en welke actie wordt van mij verwacht?", saves: 11 },
  { title: "Zakelijk voorstel schrijven", app: "Word", category: "Documenten", text: "Schrijf een professioneel voorstel voor [klant] over [onderwerp]. Gebruik een formele maar toegankelijke toon. Structuur: inleiding, aanpak, tijdlijn, investering.", saves: 9 },
  { title: "Data interpreteren", app: "Excel", category: "Data", text: "Analyseer deze dataset en geef een samenvatting van de belangrijkste trends, uitschieters en mogelijke oorzaken.", saves: 7 },
  { title: "Agenda voorbereiden", app: "Teams", category: "Meetings", text: "Maak een vergaderagenda voor een sessie van 60 minuten over [onderwerp]. Doel: [doel]. Deelnemers: [rollen].", saves: 8 },
  { title: "Feedback verwerken", app: "Word", category: "Documenten", text: "Verwerk de volgende feedbackpunten in dit document. Houd de oorspronkelijke structuur aan en maak de toon consistenter.", saves: 5 },
];

// ─────────────────────────────────────────────
// CHART DATA GENERATORS
// ─────────────────────────────────────────────

function generateAdoptionTrend() {
  const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"];
  const scores = [28, 31, 35, 38, 40, 42, 43, 44];
  return weeks.map((w, i) => ({ week: w, score: scores[i] }));
}

function generateM365Usage() {
  const apps = ["Teams", "Outlook", "Word", "Excel", "PowerPoint"];
  return Array.from({ length: 30 }, (_, i) => {
    const day = `${String(i + 1).padStart(2, "0")}/04`;
    return {
      day,
      Teams: Math.floor(Math.random() * 8 + 4),
      Outlook: Math.floor(Math.random() * 6 + 3),
      Word: Math.floor(Math.random() * 5 + 2),
      Excel: Math.floor(Math.random() * 4 + 1),
      PowerPoint: Math.floor(Math.random() * 3 + 1),
    };
  });
}

function generateVivaWellbeing() {
  return Array.from({ length: 30 }, (_, i) => ({
    day: `${String(i + 1).padStart(2, "0")}/04`,
    score: Math.floor(Math.random() * 20 + 58),
  }));
}

function generateMeetingLoad() {
  return ["Ma", "Di", "Wo", "Do", "Vr"].map((d) => ({
    day: d,
    uren: +(Math.random() * 3 + 1.5).toFixed(1),
  }));
}

function generateOverviewSourceData() {
  return [
    { source: "M365 Copilot", value: 42 },
    { source: "Teams", value: 38 },
    { source: "Outlook", value: 31 },
    { source: "Word", value: 24 },
    { source: "Excel", value: 19 },
    { source: "SharePoint", value: 12 },
  ];
}

const ADOPTION_TREND = generateAdoptionTrend();
const M365_USAGE = generateM365Usage();
const VIVA_WELLBEING = generateVivaWellbeing();
const MEETING_LOAD = generateMeetingLoad();
const SOURCE_DATA = generateOverviewSourceData();

const TOPIC_BREAKDOWN = [
  { topic: "Copilot in Teams", completed: 8, started: 11 },
  { topic: "Copilot in Outlook", completed: 7, started: 10 },
  { topic: "Effectief prompts schrijven", completed: 6, started: 9 },
  { topic: "Copilot in Word", completed: 5, started: 8 },
  { topic: "Copilot Governance", completed: 3, started: 5 },
  { topic: "Copilot in Excel", completed: 4, started: 7 },
];

const MATURITY_BREAKDOWN = [
  { name: "Advanced", value: 5 },
  { name: "Intermediate", value: 3 },
  { name: "Developing", value: 3 },
  { name: "Inactive", value: 2 },
];

const DOMAIN_SCORES = [
  { domain: "Strategie & Visie", score: 60 },
  { domain: "Adoptie & Gebruik", score: 55 },
  { domain: "Governance & Beleid", score: 40 },
  { domain: "Data & Privacy", score: 50 },
  { domain: "Leren & Ontwikkeling", score: 65 },
  { domain: "Technische Gereedheid", score: 70 },
  { domain: "Samenwerking", score: 58 },
  { domain: "Meting & Rapportage", score: 45 },
];

const PHASES = [
  { name: "Oriëntatie", status: "done" as const },
  { name: "Quick Wins", status: "active" as const },
  { name: "Uitrol", status: "locked" as const },
  { name: "Governance", status: "locked" as const },
  { name: "Agents", status: "locked" as const },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const APP_COLORS: Record<string, string> = {
  Teams: "#6264A7",
  Outlook: "#0078D4",
  Word: "#185ABD",
  Excel: "#217346",
  PowerPoint: "#B7472A",
  OneNote: "#7719AA",
  SharePoint: "#038387",
  Viva: "#00B7C3",
  CopilotChat: "#7B61FF",
  Loop: "#0078D4",
};

const MATURITY_COLORS: Record<MaturityLevel, string> = {
  Advanced: "#22C55E",
  Intermediate: "#F59E0B",
  Developing: "#3B82F6",
  Inactive: "#6B7280",
};

const PIE_COLORS = ["#22C55E", "#F59E0B", "#3B82F6", "#6B7280"];

const RISK_COLORS: Record<number, string> = {
  1: "#22C55E",
  2: "#F59E0B",
  3: "#F97316",
  4: "#EF4444",
};

const RISK_LABELS: Record<number, string> = {
  1: "Laag",
  2: "Gemiddeld",
  3: "Hoog",
  4: "Kritiek",
};

// ─────────────────────────────────────────────
// M365 ICON COMPONENT
// ─────────────────────────────────────────────

function M365Icon({ app, size = 20 }: { app: string; size?: number }) {
  const color = APP_COLORS[app] ?? "#6B7280";
  const r = Math.floor(size * 0.2);

  const letters: Record<string, string> = {
    Teams: "T",
    Outlook: "O",
    Word: "W",
    Excel: "X",
    PowerPoint: "P",
    OneNote: "N",
    SharePoint: "S",
    Viva: "V",
    CopilotChat: "✦",
    Loop: "L",
  };

  const label = letters[app] ?? app[0] ?? "?";
  const fontSize = Math.floor(size * 0.5);

  if (app === "CopilotChat") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="copilotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B61FF" />
            <stop offset="100%" stopColor="#00B7FF" />
          </linearGradient>
        </defs>
        <rect width={size} height={size} rx={r} fill="url(#copilotGrad)" />
        <text
          x={size / 2}
          y={size / 2 + fontSize * 0.35}
          textAnchor="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="system-ui"
        >
          ✦
        </text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} rx={r} fill={color} />
      <text
        x={size / 2}
        y={size / 2 + fontSize * 0.35}
        textAnchor="middle"
        fill="white"
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="system-ui"
      >
        {label}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// CAMPAI LOGO
// ─────────────────────────────────────────────

function CampaiLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#6366F1" />
      <circle cx="16" cy="16" r="5" fill="white" />
      <circle cx="16" cy="7" r="2.5" fill="white" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  color = "#6366F1",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: "#1E293B" }}>
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-3xl font-bold" style={{ color }}>
        {value}
      </span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}

function MaturityBadge({ level }: { level: MaturityLevel }) {
  const color = MATURITY_COLORS[level];
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: `${color}22`, color }}
    >
      {level}
    </span>
  );
}

function RiskBadge({ risk }: { risk: number }) {
  const color = RISK_COLORS[risk] ?? "#6B7280";
  const label = RISK_LABELS[risk] ?? "?";
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: `${color}22`, color }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-white mb-4">{children}</h2>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
      title="Kopieer"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span className="text-yellow-400">
      {"★".repeat(count)}
      <span className="text-slate-600">{"★".repeat(max - count)}</span>
    </span>
  );
}

function ProgressBar({ value, max, color = "#6366F1" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden w-full">
      <div
        className="h-2 rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: OVERZICHT
// ─────────────────────────────────────────────

function OverzichtView() {
  const totalPrompts = USERS.reduce((s, u) => s + u.prompts, 0);
  const activeUsers = USERS.filter((u) => u.activeDays > 0).length;

  return (
    <div className="space-y-6">
      <SectionTitle>Overzicht — {TENANT.name}</SectionTitle>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Actieve gebruikers" value={activeUsers} sub={`van de ${LICENSING.purchased} licenties`} color="#6366F1" />
        <KpiCard label="Totale prompts (30d)" value={totalPrompts} sub="↑ 18% t.o.v. vorige maand" color="#22C55E" />
        <KpiCard label="Adoptie score" value="44,4%" sub="Gemiddeld volwassenheidsniveau" color="#F59E0B" />
        <KpiCard label="Shadow AI apps" value={SHADOW_APPS.length} sub="Waarvan 1 kritiek risico" color="#EF4444" />
      </div>

      {/* Action table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#1E293B" }}>
        <div className="px-5 py-3 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300">Aanbevolen acties</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-700">
              <th className="px-5 py-2 text-left">Actie</th>
              <th className="px-5 py-2 text-left">Prioriteit</th>
              <th className="px-5 py-2 text-left">Impact</th>
            </tr>
          </thead>
          <tbody>
            {[
              { action: "4 licenties toewijzen aan inactieve medewerkers", prio: "Hoog", impact: "Adoptie ↑" },
              { action: "ElevenLabs blokkeren via Conditional Access", prio: "Kritiek", impact: "Risico ↓" },
              { action: "Onboarding starten voor Taylor S. & Avery D.", prio: "Middel", impact: "Gebruik ↑" },
              { action: "Governance beleid opstellen voor Shadow AI", prio: "Hoog", impact: "Compliance ↑" },
              { action: "Let's Copilot voltooien voor 3 gebruikers", prio: "Middel", impact: "Vaardigheid ↑" },
            ].map((row, i) => (
              <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-3 text-slate-200">{row.action}</td>
                <td className="px-5 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: row.prio === "Kritiek" ? "#EF444422" : row.prio === "Hoog" ? "#F9731622" : "#F59E0B22",
                      color: row.prio === "Kritiek" ? "#EF4444" : row.prio === "Hoog" ? "#F97316" : "#F59E0B",
                    }}
                  >
                    {row.prio}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-400">{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Source bar chart */}
      <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Copilot gebruik per bron (30 dagen)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SOURCE_DATA} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} />
            <YAxis dataKey="source" type="category" tick={{ fill: "#94A3B8", fontSize: 11 }} width={110} />
            <Tooltip
              contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }}
              cursor={{ fill: "#334155" }}
            />
            <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} name="Sessies" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: COPILOT ADOPTIE
// ─────────────────────────────────────────────

function AdoptieView() {
  const aiInsight = `Demo Organisatie BV heeft een adoptiescore van 44,4% bereikt — een solide start voor een organisatie van deze omvang. 5 van de 18 gelicentieerde medewerkers tonen geavanceerd gebruik (Advanced), wat erop wijst dat er een sterke kern van AI-ambassadeurs aanwezig is.

De grootste kansen liggen bij de 4 ongebruikte licenties en de 2 gebruikers die wel een licentie hebben maar nauwelijks actief zijn. Door gerichte onboarding en begeleiding voor deze groep kan de adoptiescore de komende 4 weken stijgen naar ca. 58%.

Aanbeveling: activeer het Let's Copilot leertraject voor Sam K., Jamie L. en Riley A. en koppel hen aan een interne AI-ambassadeur (Quinn B. of Alex B.) voor peer coaching.`;

  return (
    <div className="space-y-6">
      <SectionTitle>Copilot Adoptie</SectionTitle>

      {/* AI Insight */}
      <div className="rounded-xl p-5 border border-indigo-500/30" style={{ background: "#1E293B" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">✦ AI-inzicht</span>
          <CopyButton text={aiInsight} />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{aiInsight}</p>
      </div>

      {/* Licensing card */}
      <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Licentieoverzicht</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{LICENSING.purchased}</div>
            <div className="text-xs text-slate-500 mt-1">Gekocht</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{LICENSING.unassigned}</div>
            <div className="text-xs text-slate-500 mt-1">Niet toegewezen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{LICENSING.notActive}</div>
            <div className="text-xs text-slate-500 mt-1">Inactief</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">{LICENSING.noLicense}</div>
            <div className="text-xs text-slate-500 mt-1">Geen licentie</div>
          </div>
        </div>
        {/* License bar */}
        <div className="mt-4 h-3 rounded-full bg-slate-700 flex overflow-hidden">
          <div style={{ width: `${((LICENSING.purchased - LICENSING.unassigned - LICENSING.notActive) / TENANT.licenses) * 100}%`, background: "#6366F1" }} />
          <div style={{ width: `${(LICENSING.unassigned / TENANT.licenses) * 100}%`, background: "#F59E0B" }} />
          <div style={{ width: `${(LICENSING.notActive / TENANT.licenses) * 100}%`, background: "#F97316" }} />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-500">
          <span><span className="text-indigo-400">■</span> Actief</span>
          <span><span className="text-yellow-400">■</span> Niet toegewezen</span>
          <span><span className="text-orange-400">■</span> Inactief</span>
          <span><span className="text-slate-500">■</span> Geen licentie</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adoption score trend */}
        <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Adoptiescore trend (8 weken)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ADOPTION_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }}
                formatter={(v) => [`${v}%`, "Score"]}
              />
              <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} dot={{ fill: "#6366F1", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maturity pie */}
        <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Volwassenheid verdeling</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={MATURITY_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {MATURITY_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {MATURITY_BREAKDOWN.map((m, i) => (
              <span key={m.name} className="text-xs flex items-center gap-1">
                <span style={{ color: PIE_COLORS[i] }}>■</span>
                <span className="text-slate-400">{m.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* M365 stacked area */}
      <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">M365 Copilot gebruik per app (30 dagen)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={M365_USAGE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 9 }} interval={4} />
            <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }} />
            <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 11 }} />
            {["Teams", "Outlook", "Word", "Excel", "PowerPoint"].map((app) => (
              <Area key={app} type="monotone" dataKey={app} stackId="1" fill={APP_COLORS[app]} stroke={APP_COLORS[app]} fillOpacity={0.7} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: COPILOT GEBRUIKERS
// ─────────────────────────────────────────────

function GebruikersView() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => USERS.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()) || u.dept.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="space-y-6">
      <SectionTitle>Copilot Gebruikers</SectionTitle>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Zoek op naam, rol of afdeling…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "#1E293B" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-700">
              <th className="px-5 py-3 text-left">Naam</th>
              <th className="px-5 py-3 text-left">Rol / Afdeling</th>
              <th className="px-5 py-3 text-right">Actieve dagen</th>
              <th className="px-5 py-3 text-right">Prompts</th>
              <th className="px-5 py-3 text-left">Apps</th>
              <th className="px-5 py-3 text-left">Volwassenheid</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.name} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-200">{u.name}</td>
                <td className="px-5 py-3 text-slate-400">
                  {u.role} <span className="text-slate-600">·</span> {u.dept}
                </td>
                <td className="px-5 py-3 text-right text-slate-300">{u.activeDays}</td>
                <td className="px-5 py-3 text-right text-slate-300">{u.prompts}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {u.apps.map((app) => (
                      <M365Icon key={app} app={app} size={20} />
                    ))}
                    {u.apps.length === 0 && <span className="text-slate-600 text-xs">—</span>}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <MaturityBadge level={u.maturity} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  Geen gebruikers gevonden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: SHADOW AI
// ─────────────────────────────────────────────

function ShadowAIView() {
  const totalUsers = [...new Set(SHADOW_APPS.map((a) => a.users))].reduce((s, v) => s + v, 0);
  const highRisk = SHADOW_APPS.filter((a) => a.risk >= 3).length;
  const totalSessions = SHADOW_APPS.reduce((s, a) => s + a.sessions, 0);

  return (
    <div className="space-y-6">
      <SectionTitle>Shadow AI</SectionTitle>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Gedetecteerde apps" value={SHADOW_APPS.length} sub="Ongeautoriseerde AI-tools" color="#F59E0B" />
        <KpiCard label="Betrokken medewerkers" value={totalUsers} sub="Unieke gebruikers (overlap mogelijk)" color="#F97316" />
        <KpiCard label="Hoog/Kritiek risico" value={highRisk} sub="Vereisen directe actie" color="#EF4444" />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "#1E293B" }}>
        <div className="px-5 py-3 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300">Gedetecteerde Shadow AI-applicaties</h3>
          <p className="text-xs text-slate-500 mt-0.5">Totaal {totalSessions.toLocaleString()} sessies gedetecteerd</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-700">
              <th className="px-5 py-3 text-left">Applicatie</th>
              <th className="px-5 py-3 text-left">Categorie</th>
              <th className="px-5 py-3 text-right">Gebruikers</th>
              <th className="px-5 py-3 text-right">Sessies</th>
              <th className="px-5 py-3 text-right">Data (MB)</th>
              <th className="px-5 py-3 text-left">Risiconiveau</th>
            </tr>
          </thead>
          <tbody>
            {SHADOW_APPS.map((app) => (
              <tr key={app.name} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-200">{app.name}</td>
                <td className="px-5 py-3 text-slate-400">{app.category}</td>
                <td className="px-5 py-3 text-right text-slate-300">{app.users}</td>
                <td className="px-5 py-3 text-right text-slate-300">{app.sessions.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-slate-300">{app.dataMB}</td>
                <td className="px-5 py-3">
                  <RiskBadge risk={app.risk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl p-5 border border-red-500/20" style={{ background: "#1E293B" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-400 text-sm font-semibold">⚠ Aanbevolen actie</span>
        </div>
        <p className="text-sm text-slate-300">
          ElevenLabs (risico 4 — Kritiek) stuurt mogelijk gevoelige audiodata naar externe servers buiten de EU. Blokkeer deze applicatie via Microsoft Entra Conditional Access en informeer de betrokken medewerkers over het goedgekeurde alternatieven-beleid.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: MICROSOFT VIVA
// ─────────────────────────────────────────────

function VivaView() {
  return (
    <div className="space-y-6">
      <SectionTitle>Microsoft Viva Insights</SectionTitle>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Focus uren/week" value={VIVA.focusHoursPerWeek} sub="Gemiddeld per medewerker" color="#00B7C3" />
        <KpiCard label="Na kantooruren" value={`${VIVA.afterHoursPerWeek}u`} sub="Werk buiten werktijd" color="#F59E0B" />
        <KpiCard label="Vergadering uren" value={`${VIVA.meetingHoursPerWeek}u`} sub="Per week gemiddeld" color="#F97316" />
        <KpiCard label="Welzijnscore" value={`${VIVA.wellbeingScore}/100`} sub="Organisatiebrede score" color="#22C55E" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellbeing trend */}
        <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Welzijnsscore trend (30 dagen)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={VIVA_WELLBEING}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 9 }} interval={4} />
              <YAxis domain={[40, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }} />
              <Line type="monotone" dataKey="score" stroke="#00B7C3" strokeWidth={2} dot={false} name="Welzijn" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Meeting load */}
        <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Vergaderbelasting per dag</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MEETING_LOAD}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `${v}u`} />
              <Tooltip
                contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }}
                formatter={(v) => [`${v}u`, "Vergaderingen"]}
              />
              <Bar dataKey="uren" fill="#00B7C3" radius={[4, 4, 0, 0]} name="Uren" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl p-5 border border-yellow-500/20" style={{ background: "#1E293B" }}>
        <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">✦ AI-inzicht</div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Met gemiddeld 16 vergaderuren per week en slechts 11 focusuren loopt de organisatie het risico op een hoge cognitieve belasting. De na-kantooruren (4,2u/week) liggen boven de gezonde grens van 3u. Overweeg het invoeren van vergadervrije ochtenden en promoot de gebruik van Copilot in Teams om vergaderingen efficiënter te maken.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: LET'S COPILOT
// ─────────────────────────────────────────────

function LetsCopilotView() {
  const funnel = [
    { fase: "Intake", count: 12 },
    { fase: "Gestart", count: 10 },
    { fase: "Bezig", count: 8 },
    { fase: "Voltooid", count: 7 },
  ];

  const aiInsight = `11 van de 12 gelicentieerde medewerkers zijn gestart met Let's Copilot, wat een sterke betrokkenheid laat zien. De voltooiingsgraad van 71% is bovengemiddeld voor vergelijkbare organisaties (benchmark: 58%).

Bijzonder positief: Robin V. en Quinn B. hebben alle 10 lessen afgerond met scores van respectievelijk 96 en 94. Zij zijn ideale interne trainers.

Aandachtspunt: Sam K. (42%), Jamie L. (31%) en Riley A. (22%) hebben moeite met voortgang. Een persoonlijk gesprek of korte check-in door de manager kan helpen om de drempel te verlagen.`;

  return (
    <div className="space-y-6">
      <SectionTitle>Let's Copilot — Leerplatform</SectionTitle>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Unieke leerlingen" value={11} sub="van 12 gelicentieerden" color="#6366F1" />
        <KpiCard label="Sessies" value={54} sub="Totaal uitgevoerd" color="#22C55E" />
        <KpiCard label="Totale speeltijd" value="8u 22m" sub="Gemiddeld 46 min/persoon" color="#F59E0B" />
        <KpiCard label="Voltooiingsgraad" value="71%" sub="Benchmark: 58%" color="#00B7C3" />
      </div>

      {/* Funnel chart */}
      <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Leerfunnel</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={funnel} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 12]} />
            <YAxis dataKey="fase" type="category" tick={{ fill: "#94A3B8", fontSize: 11 }} width={70} />
            <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9" }} />
            <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} name="Gebruikers" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insight */}
      <div className="rounded-xl p-5 border border-indigo-500/30" style={{ background: "#1E293B" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">✦ AI-inzicht</span>
          <CopyButton text={aiInsight} />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{aiInsight}</p>
      </div>

      {/* Progress per user */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#1E293B" }}>
        <div className="px-5 py-3 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300">Voortgang per gebruiker</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-700">
              <th className="px-5 py-3 text-left">Naam</th>
              <th className="px-5 py-3 text-left">Topics</th>
              <th className="px-5 py-3 text-center">Lessen</th>
              <th className="px-5 py-3 text-left">Laatste activiteit</th>
              <th className="px-5 py-3 text-left" style={{ width: 140 }}>Voortgang</th>
            </tr>
          </thead>
          <tbody>
            {LEARNER_PROGRESS.map((u) => (
              <tr key={u.name} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-200">{u.name}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.topics.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-slate-700 text-slate-300">{t}</span>
                    ))}
                    {u.topics.length === 0 && <span className="text-slate-600 text-xs">—</span>}
                  </div>
                </td>
                <td className="px-5 py-3 text-center text-slate-300">
                  {u.lessons}/{u.totalLessons}
                </td>
                <td className="px-5 py-3 text-slate-400 text-xs">{u.lastActive}</td>
                <td className="px-5 py-3">
                  <ProgressBar value={u.lessons} max={u.totalLessons} color="#6366F1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Topic breakdown */}
      <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Voortgang per onderwerp</h3>
        <div className="space-y-4">
          {TOPIC_BREAKDOWN.map((t) => (
            <div key={t.topic}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{t.topic}</span>
                <span>{t.completed}/{t.started} voltooid</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${(t.completed / 12) * 100}%`, background: "#6366F1" }}
                />
                <div
                  className="h-3"
                  style={{ width: `${((t.started - t.completed) / 12) * 100}%`, background: "#334155" }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-slate-500">
          <span><span className="text-indigo-400">■</span> Voltooid</span>
          <span><span className="text-slate-600">■</span> Gestart</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: MIJN JOURNEY
// ─────────────────────────────────────────────

function JourneyView() {
  const score = 54;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      <SectionTitle>Mijn Journey — Volwassenheidsscore</SectionTitle>

      {/* Shadow AI alert */}
      <div className="rounded-xl p-4 border border-red-500/30 flex items-start gap-3" style={{ background: "#1E293B" }}>
        <span className="text-red-400 text-lg mt-0.5">⚠</span>
        <div>
          <span className="text-sm font-semibold text-red-400">Let op: Shadow AI gedetecteerd</span>
          <p className="text-xs text-slate-400 mt-0.5">7 medewerkers gebruiken niet-goedgekeurde AI-tools buiten het M365-ecosysteem. Stel een Shadow AI-beleid op om risico's te beperken.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score ring */}
        <div className="rounded-xl p-6 flex flex-col items-center justify-center" style={{ background: "#1E293B" }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="54" fill="none" stroke="#1E293B" strokeWidth="14" />
            <circle cx="80" cy="80" r="54" fill="none" stroke="#334155" strokeWidth="14" />
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#6366F1"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
            <text x="80" y="76" textAnchor="middle" fill="white" fontSize="28" fontWeight="700">{score}</text>
            <text x="80" y="96" textAnchor="middle" fill="#94A3B8" fontSize="11">/100</text>
          </svg>
          <div className="text-center mt-2">
            <div className="text-lg font-bold text-white">Gestructureerd</div>
            <div className="text-xs text-slate-400 mt-1">Fase 2 van 5 — Quick Wins</div>
          </div>
        </div>

        {/* Phase timeline */}
        <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Faseoverzicht</h3>
          <div className="space-y-3">
            {PHASES.map((phase, i) => (
              <div key={phase.name} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: phase.status === "done" ? "#22C55E22" : phase.status === "active" ? "#6366F122" : "#334155",
                    color: phase.status === "done" ? "#22C55E" : phase.status === "active" ? "#6366F1" : "#6B7280",
                    border: `2px solid ${phase.status === "done" ? "#22C55E" : phase.status === "active" ? "#6366F1" : "#475569"}`,
                  }}
                >
                  {phase.status === "done" ? "✓" : phase.status === "active" ? "▶" : i + 1}
                </div>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: phase.status === "done" ? "#22C55E" : phase.status === "active" ? "white" : "#6B7280" }}
                  >
                    {phase.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {phase.status === "done" ? "Afgerond" : phase.status === "active" ? "Huidige fase" : "Vergrendeld"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & improvements */}
        <div className="rounded-xl p-5 space-y-4" style={{ background: "#1E293B" }}>
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-2">Sterke punten</h3>
            <ul className="space-y-1 text-sm text-slate-300">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Hoge technische gereedheid (70)</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Goed leerengagement (71%)</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Sterke AI-ambassadeurs aanwezig</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verbeterpunten</h3>
            <ul className="space-y-1 text-sm text-slate-300">
              <li className="flex items-center gap-2"><span className="text-yellow-400">→</span> Governance & Beleid (40)</li>
              <li className="flex items-center gap-2"><span className="text-yellow-400">→</span> Meting & Rapportage (45)</li>
              <li className="flex items-center gap-2"><span className="text-yellow-400">→</span> Shadow AI aanpakken</li>
            </ul>
          </div>
          <div className="pt-2 border-t border-slate-700">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Grootste blokkade</h3>
            <p className="text-sm text-slate-300">Gebrek aan formeel AI-beleid en governance structuur</p>
          </div>
        </div>
      </div>

      {/* Domain scores */}
      <div className="rounded-xl p-5" style={{ background: "#1E293B" }}>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Domeinscores</h3>
        <div className="space-y-3">
          {DOMAIN_SCORES.map((d) => (
            <div key={d.domain} className="flex items-center gap-4">
              <span className="text-sm text-slate-400 w-44 shrink-0">{d.domain}</span>
              <div className="flex-1">
                <ProgressBar
                  value={d.score}
                  max={100}
                  color={d.score >= 60 ? "#22C55E" : d.score >= 45 ? "#F59E0B" : "#EF4444"}
                />
              </div>
              <span className="text-sm font-semibold text-slate-200 w-8 text-right">{d.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: USE CASES
// ─────────────────────────────────────────────

function UseCasesView() {
  const [industryFilter, setIndustryFilter] = useState("Alle");
  const [phaseFilter, setPhaseFilter] = useState("Alle");

  const industries = ["Alle", ...Array.from(new Set(USE_CASES.map((u) => u.industry)))];
  const phases = ["Alle", ...Array.from(new Set(USE_CASES.map((u) => u.phase)))];

  const filtered = USE_CASES.filter(
    (u) => (industryFilter === "Alle" || u.industry === industryFilter) && (phaseFilter === "Alle" || u.phase === phaseFilter)
  );

  const phaseColors: Record<string, string> = {
    "Quick Wins": "#22C55E",
    Uitrol: "#6366F1",
    Governance: "#F59E0B",
    Agents: "#00B7C3",
  };

  return (
    <div className="space-y-6">
      <SectionTitle>Use Cases</SectionTitle>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Branche:</span>
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                background: industryFilter === ind ? "#6366F1" : "#1E293B",
                color: industryFilter === ind ? "white" : "#94A3B8",
                border: `1px solid ${industryFilter === ind ? "#6366F1" : "#334155"}`,
              }}
            >
              {ind}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Fase:</span>
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                background: phaseFilter === phase ? "#6366F1" : "#1E293B",
                color: phaseFilter === phase ? "white" : "#94A3B8",
                border: `1px solid ${phaseFilter === phase ? "#6366F1" : "#334155"}`,
              }}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((uc) => (
          <div key={uc.title} className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "#1E293B" }}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{uc.title}</h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                style={{
                  background: `${phaseColors[uc.phase] ?? "#6366F1"}22`,
                  color: phaseColors[uc.phase] ?? "#6366F1",
                }}
              >
                {uc.phase}
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {uc.apps.map((app) => (
                <div key={app} className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "#0F172A" }}>
                  <M365Icon app={app} size={14} />
                  <span className="text-slate-400">{app}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>⏱ {uc.timeSaved}</span>
              <Stars count={uc.difficulty} />
            </div>
            <div className="text-xs text-slate-500">{uc.industry}</div>
            <button className="mt-auto w-full py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-indigo-500" style={{ background: "#6366F122", color: "#818CF8" }}>
              + Voeg toe aan mijn plan
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center text-slate-500">
            Geen use cases gevonden voor deze filters
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VIEW: PROMPTS
// ─────────────────────────────────────────────

function PromptsView() {
  const [search, setSearch] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadApp, setUploadApp] = useState("");
  const [uploadText, setUploadText] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filtered = useMemo(
    () =>
      PROMPTS.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.app.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  function handleUpload() {
    if (uploadTitle && uploadText) {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadForm(false);
        setUploadTitle("");
        setUploadApp("");
        setUploadText("");
      }, 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle>Prompts Bibliotheek</SectionTitle>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "#6366F1", color: "white" }}
        >
          <Upload size={14} />
          Upload eigen prompt
        </button>
      </div>

      {/* Upload form */}
      {showUploadForm && (
        <div className="rounded-xl p-5 border border-indigo-500/40" style={{ background: "#1E293B" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Nieuwe prompt toevoegen</h3>
            <button onClick={() => setShowUploadForm(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          {uploadSuccess ? (
            <div className="flex items-center gap-2 text-green-400 py-4 justify-center">
              <Check size={20} />
              <span className="font-semibold">Prompt toegevoegd!</span>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titel van de prompt"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Applicatie (bijv. Teams, Word)"
                value={uploadApp}
                onChange={(e) => setUploadApp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <textarea
                placeholder="Prompt tekst…"
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={handleUpload}
                disabled={!uploadTitle || !uploadText}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
                style={{ background: "#6366F1", color: "white" }}
              >
                Toevoegen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Zoek prompts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Prompt cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div key={p.title} className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "#1E293B" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <M365Icon app={p.app} size={22} />
                <div>
                  <div className="text-sm font-semibold text-white">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.category} · {p.app}</div>
                </div>
              </div>
              <CopyButton text={p.text} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{p.text}</p>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/50">
              <span className="text-xs text-slate-500">🔖 {p.saves}× opgeslagen</span>
              <button className="px-3 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-indigo-500" style={{ background: "#6366F122", color: "#818CF8" }}>
                Deel
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center text-slate-500">
            Geen prompts gevonden
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR NAV ITEMS
// ─────────────────────────────────────────────

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overzicht", label: "Overzicht", icon: <LayoutDashboard size={18} /> },
  { id: "adoptie", label: "Copilot Adoptie", icon: <Bot size={18} /> },
  { id: "gebruikers", label: "Copilot Gebruikers", icon: <Users size={18} /> },
  { id: "shadowai", label: "Shadow AI", icon: <Shield size={18} /> },
  { id: "viva", label: "Microsoft Viva", icon: <Heart size={18} /> },
  { id: "letscopilot", label: "Let's Copilot", icon: <BookOpen size={18} /> },
  { id: "journey", label: "Mijn Journey", icon: <Map size={18} /> },
  { id: "usecases", label: "Use Cases", icon: <Layers size={18} /> },
  { id: "prompts", label: "Prompts", icon: <MessageSquare size={18} /> },
];

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────

export default function InsightsDashboard() {
  const [activeView, setActiveView] = useState<View>("overzicht");
  const [collapsed, setCollapsed] = useState(false);

  function renderView() {
    switch (activeView) {
      case "overzicht": return <OverzichtView />;
      case "adoptie": return <AdoptieView />;
      case "gebruikers": return <GebruikersView />;
      case "shadowai": return <ShadowAIView />;
      case "viva": return <VivaView />;
      case "letscopilot": return <LetsCopilotView />;
      case "journey": return <JourneyView />;
      case "usecases": return <UseCasesView />;
      case "prompts": return <PromptsView />;
      default: return null;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0B1120", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-200 relative"
        style={{
          background: "#0F172A",
          width: collapsed ? 60 : 220,
          borderRight: "1px solid #1E293B",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-800">
          <CampaiLogo size={28} />
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight">campai</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                style={{
                  color: isActive ? "#A5B4FC" : "#94A3B8",
                  background: isActive ? "#1E293B" : "transparent",
                  borderLeft: isActive ? "2px solid #6366F1" : "2px solid transparent",
                }}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tenant info */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-slate-800">
            <div className="text-xs text-slate-500 truncate">{TENANT.name}</div>
            <div className="text-xs text-slate-600 truncate">{TENANT.industry}</div>
          </div>
        )}

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-slate-700"
          style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8" }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: "#0B1120", borderBottom: "1px solid #1E293B" }}
        >
          <div>
            <h1 className="text-white font-semibold">
              {NAV_ITEMS.find((n) => n.id === activeView)?.label}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{TENANT.name} · {new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {LICENSING.purchased} Copilot licenties · {TENANT.licenses} totaal
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              JK
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
