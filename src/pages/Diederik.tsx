import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Compass,
  FileText,
  Flag,
  LayoutDashboard,
  Lightbulb,
  Lock,
  PenLine,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────
type Phase = 1 | 2 | 3 | 4 | 5;
type Status = "on-track" | "blocked" | "waiting" | "no-action";

interface Client {
  id: string;
  name: string;
  sector: string;
  employees: string;
  phase: Phase;
  score: number;
  status: Status;
  nextAction: string;
}

// ── Mock data ──────────────────────────────────────────────────────
const clients: Client[] = [
  { id: "contoso", name: "Contoso Manufacturing", sector: "Productie", employees: "250", phase: 2, score: 74, status: "on-track", nextAction: "Champion workshop" },
  { id: "northwind", name: "Northwind Legal", sector: "Juridisch", employees: "80", phase: 4, score: 68, status: "blocked", nextAction: "Governance review" },
  { id: "fabrikam", name: "Fabrikam Retail", sector: "Retail", employees: "120", phase: 1, score: 41, status: "waiting", nextAction: "Richtingskaart afronden" },
  { id: "alpine", name: "Alpine Logistics", sector: "Logistiek", employees: "340", phase: 3, score: 61, status: "on-track", nextAction: "Let's Copilot uitrol" },
  { id: "woodgrove", name: "Woodgrove Bank", sector: "Finance", employees: "600", phase: 4, score: 55, status: "blocked", nextAction: "AI-beleid opstellen" },
  { id: "tailspin", name: "Tailspin Toys", sector: "Retail", employees: "45", phase: 1, score: 28, status: "no-action", nextAction: "" },
];

const phaseLabels: Record<Phase, string> = {
  1: "Oriëntatie",
  2: "Quick Wins",
  3: "Uitrol",
  4: "Governance",
  5: "Agents",
};

const phaseColors: Record<Phase, string> = {
  1: "border-sky-200 bg-sky-50 text-sky-700",
  2: "border-blue-200 bg-blue-50 text-blue-700",
  3: "border-amber-200 bg-amber-50 text-amber-700",
  4: "border-purple-200 bg-purple-50 text-purple-700",
  5: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusConfig: Record<Status, { label: string; color: string; dot: string }> = {
  "on-track":  { label: "On track",       color: "text-success",         dot: "bg-success" },
  "blocked":   { label: "Blokkade",        color: "text-destructive",     dot: "bg-destructive" },
  "waiting":   { label: "Wacht op klant",  color: "text-warning",         dot: "bg-warning" },
  "no-action": { label: "Geen actie",      color: "text-muted-foreground", dot: "bg-border" },
};

// ── Sub-components ─────────────────────────────────────────────────
const PhaseChip = ({ phase }: { phase: Phase }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", phaseColors[phase])}>
    Fase {phase}
  </span>
);

const StatusDot = ({ status }: { status: Status }) => {
  const { label, color, dot } = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", color)}>
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      {label}
    </span>
  );
};

const ScoreBar = ({ score }: { score: number }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${score}%` }} />
    </div>
    <span className="text-sm font-semibold text-foreground">{score}</span>
  </div>
);

// ── Phase detail data ──────────────────────────────────────────────
const phaseDetails: Record<Phase, { doel: string; uitvragen: string[]; activiteiten: string[]; output: string[]; gate: string }> = {
  1: {
    doel: "Richting creëren, geen techniek. Helder krijgen waar Copilot waarde kan leveren.",
    uitvragen: ["Wat is de aanleiding?", "Welke teams staan onder druk?", "Waar lekt tijd, energie, kwaliteit?", "Hoe gevoelig is security/compliance?"],
    activiteiten: ["Werkproblemen clusteren", "Vertalen naar Copilot kansgebieden", "2–3 use cases selecteren", "Prioriteren: impact × haalbaarheid"],
    output: ["Richtingskaart met 2–3 use cases", "Indicatieve waarde per use case", "Logisch vervolgstap-advies"],
    gate: "Besluit en budget nodig — zonder akkoord start fase 2 niet.",
  },
  2: {
    doel: "Bewijzen dat Copilot écht werkt in het dagelijks werk van 2–5 kartrekkers.",
    uitvragen: ["Wie zijn de 2–3 champions?", "Welke use case willen ze testen?", "Wanneer is succes zichtbaar?"],
    activiteiten: ["Champion workshop plannen", "Use case → Copilot taken vertalen", "Prompts selecteren / aanpassen", "Wekelijks check-in (2 weken)"],
    output: ["Werkende Copilot scenario's", "Mini-succesverhalen", "Advies: opschalen of niet"],
    gate: "Champions gebruiken Copilot wekelijks aantoonbaar. Zonder bewijs blijft fase 2 actief.",
  },
  3: {
    doel: "Van een kleine groep champions naar brede adoptie met basisvaardigheden.",
    uitvragen: ["Hoeveel medewerkers gaan uitgerold?", "Welke training-vorm past?", "Zijn persoonlijke agents al gewenst?"],
    activiteiten: ["Training basisvaardigheden", "Gamified adoptie (Let's Copilot)", "Promptgebruik standaardiseren"],
    output: ["Adoptie-dashboard", "Actieve gebruikersbase", "Uitrolrapportage"],
    gate: "Basisvaardigheden aantoonbaar aanwezig bij X% van medewerkers.",
  },
  4: {
    doel: "Van individueel gebruik naar voorspelbaar, organisatiebreed Copilot-gebruik.",
    uitvragen: ["Hoe volwassen is gebruik per team?", "Is er al een AI-beleidswens?", "Wie is eigenaar van governance?"],
    activiteiten: ["AI/Copilot volwassenheidsscan", "AI-beleid vastleggen", "Tenant ready maken (DLP, classificatie)", "Copilot roadmap opstellen"],
    output: ["AI-beleid document", "Governance-framework", "Copilot roadmap v2"],
    gate: "Zonder beleid en volwassenheid → centrale agents geblokkeerd.",
  },
  5: {
    doel: "Gecontroleerd versnellen met centrale AI agents via Copilot Studio.",
    uitvragen: ["Welk proces wil je automatiseren?", "Wie wordt eigenaar van de agent?", "Zijn externe koppelingen nodig?"],
    activiteiten: ["Procesanalyse", "Agent ontwerp in Copilot Studio", "Test + livegang", "Lifecycle-afspraken"],
    output: ["Werkende centrale agent(s)", "Architectuurkeuzes gedocumenteerd", "Beheerafspraken"],
    gate: "Continue fase: abonnement op Copilot as a Service.",
  },
};

// ── Client detail tabs ─────────────────────────────────────────────
type ClientTab = "journey" | "champions" | "usecases" | "prompts" | "stories" | "output";

const ClientDetail = ({ client, onBack }: { client: Client; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<ClientTab>("journey");
  const detail = phaseDetails[client.phase];

  const tabs: { key: ClientTab; label: string; locked?: boolean }[] = [
    { key: "journey", label: "Journey" },
    { key: "champions", label: "Champions" },
    { key: "usecases", label: "Use Cases" },
    { key: "prompts", label: "Prompts" },
    { key: "stories", label: "Success Stories" },
    { key: "output", label: "Output" },
  ];

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-border/70 bg-gradient-panel shadow-panel overflow-hidden">
      {/* header */}
      <div className="border-b border-border/50 bg-surface/60 px-6 py-5">
        <button onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Alle klanten
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Klantkaart</p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">{client.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <PhaseChip phase={client.phase} />
              <StatusDot status={client.status} />
              <span className="text-sm text-muted-foreground">Score: <strong className="text-foreground">{client.score}</strong></span>
            </div>
          </div>
          <Button size="sm" variant="soft">
            <Plus className="h-3.5 w-3.5" /> Actie toevoegen
          </Button>
        </div>

        {/* journey progress bar */}
        <div className="mt-5 grid grid-cols-5 overflow-hidden rounded-xl border border-border/60">
          {([1, 2, 3, 4, 5] as Phase[]).map((p) => (
            <div
              key={p}
              className={cn(
                "border-r border-border/60 px-3 py-2.5 text-center text-xs font-semibold last:border-r-0 relative",
                p < client.phase && "bg-primary/8 text-primary",
                p === client.phase && "bg-primary text-primary-foreground",
                p > client.phase && "bg-surface text-muted-foreground",
              )}
            >
              <span className="block text-[10px] font-normal opacity-60 mb-0.5">Fase {p}</span>
              {phaseLabels[p]}
              {p < client.phase && (
                <BadgeCheck className="absolute right-2 top-2 h-3 w-3 text-primary" />
              )}
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="mt-4 flex gap-0 border-b border-border/50 -mb-px overflow-x-auto">
          {tabs.map(({ key, label, locked }) => (
            <button
              key={key}
              disabled={locked}
              onClick={() => !locked && setActiveTab(key)}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                activeTab === key
                  ? "border-primary text-foreground"
                  : locked
                  ? "cursor-not-allowed border-transparent text-muted-foreground/40"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              {locked && <Lock className="ml-1 inline h-3 w-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* tab content */}
      <div className="p-6">

        {/* JOURNEY */}
        {activeTab === "journey" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border/60 bg-surface overflow-hidden shadow-soft">
              <div className="bg-primary px-5 py-4 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-primary-foreground">Fase {client.phase} – {phaseLabels[client.phase]}</h3>
                  <p className="mt-1 text-sm text-primary-foreground/70">{detail.doel}</p>
                </div>
                <span className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  Actief
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border/60">
                {[
                  { label: "Uitvragen", items: detail.uitvragen },
                  { label: "Activiteiten", items: detail.activiteiten },
                  { label: "Output", items: detail.output },
                ].map(({ label, items }) => (
                  <div key={label} className="p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
                    <ul className="space-y-1.5 text-sm text-foreground">
                      {items.map((item) => <li key={item} className="flex gap-2"><span className="mt-0.5 text-primary">›</span>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-amber-200 bg-amber-50/60 px-5 py-3.5 flex items-center justify-between gap-4">
                <p className="text-sm text-amber-800"><strong>Gate {client.phase} → {client.phase + 1}:</strong> {detail.gate}</p>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="border-border/60 text-xs">⏸ Verlengen</Button>
                  <Button size="sm" variant="outline" className="border-destructive/40 text-destructive text-xs hover:bg-destructive/5">🚫 Blokkade</Button>
                  <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90 text-xs">✓ Gate openen</Button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Open acties</p>
                <Button size="sm" variant="soft"><Plus className="h-3 w-3" /> Actie</Button>
              </div>
              <div className="space-y-2">
                {[
                  { type: "Workshop", title: "Champion workshop inplannen", status: "Gepland" },
                  { type: "Voorbereiding", title: "Prompts selecteren uit bibliotheek", status: "Klaar" },
                ].map((a) => (
                  <div key={a.title} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface p-3.5 shadow-soft">
                    <div className="h-8 w-8 rounded-lg border border-primary/20 bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                      <Flag className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.type}</p>
                    </div>
                    <span className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      a.status === "Klaar" ? "border-success/30 bg-success/10 text-success" : "border-amber-200 bg-amber-50 text-amber-700"
                    )}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHAMPIONS */}
        {activeTab === "champions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Champions bij {client.name}</p>
              <Button size="sm" variant="soft"><Plus className="h-3 w-3" /> Champion</Button>
            </div>
            {[
              { name: "Lars de Vries", role: "Teamleider Operations", use: "Dagelijks", apps: "Teams, Outlook", uc: 3, status: "Actief" },
              { name: "Sarah Koster", role: "HR Manager", use: "2–3× week", apps: "Word, Outlook", uc: 1, status: "Opstart" },
            ].map((c) => (
              <div key={c.name} className="flex items-start gap-4 rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.role} · {c.use} · {c.apps}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      c.status === "Actief" ? "border-success/30 bg-success/10 text-success" : "border-amber-200 bg-amber-50 text-amber-700"
                    )}>{c.status}</span>
                    <span className="rounded-full border border-border/60 bg-surface px-2.5 py-0.5 text-xs text-muted-foreground">{c.uc} use cases</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full rounded-xl border-2 border-dashed border-border/60 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              + Champion toevoegen
            </button>
          </div>
        )}

        {/* USE CASES */}
        {activeTab === "usecases" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Klant-specifieke use cases</p>
              <Button size="sm" variant="soft"><Plus className="h-3 w-3" /> Uit bibliotheek</Button>
            </div>
            {[
              { title: "Teams meetings → transcript & acties", problem: "Te veel tijd kwijt aan notities", impact: "−45 min/week", champion: "Lars", prompts: 2, status: "Live" },
              { title: "Sneller mails schrijven in Outlook", problem: "Tijdrovende communicatie", impact: "−20 min/dag", champion: "Sarah", prompts: 1, status: "In test" },
            ].map((uc) => (
              <div key={uc.title} className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{uc.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{uc.problem} · Impact: {uc.impact}</p>
                    </div>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold flex-shrink-0",
                    uc.status === "Live" ? "border-success/30 bg-success/10 text-success" : "border-amber-200 bg-amber-50 text-amber-700"
                  )}>{uc.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">Champion: {uc.champion}</span>
                  <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">{uc.prompts} prompts</span>
                </div>
              </div>
            ))}
            <button className="w-full rounded-xl border-2 border-dashed border-border/60 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              + Use case toevoegen uit centrale bibliotheek
            </button>
          </div>
        )}

        {/* PROMPTS */}
        {activeTab === "prompts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Gebruikte prompts</p>
              <Button size="sm" variant="soft"><Plus className="h-3 w-3" /> Uit bibliotheek</Button>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <PenLine className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Vergadering samenvatten + actiepunten</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Teams meetings use case · v1.2 · Owner: Diederik</p>
                  <div className="mt-3 rounded-lg border border-border/50 bg-background p-3 text-xs leading-5 text-muted-foreground space-y-1.5">
                    <div><strong className="text-foreground">Context:</strong> Je bent aanwezig geweest bij een vergadering van [afdeling] bij [klantnaam].</div>
                    <div><strong className="text-foreground">Instructie:</strong> Maak een samenvatting van max. 5 punten en een actielijst met eigenaar en deadline.</div>
                    <div><strong className="text-foreground">Output:</strong> Koppen: Samenvatting / Actiepunten / Beslissingen.</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Approved</span>
                    <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">Teams</span>
                    <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">Laag risico</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STORIES */}
        {activeTab === "stories" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Success stories</p>
              <Button size="sm" variant="soft"><Plus className="h-3 w-3" /> Story</Button>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft flex items-start gap-3">
              <Trophy className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
              <div>
                <p className="font-semibold text-foreground">Teams meetings → acties in 2 klikken</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Champion: Lars de Vries · Impact: −45 min/week</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Export-klaar</span>
                  <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">Fase 2</span>
                </div>
              </div>
            </div>
            <button className="w-full rounded-xl border-2 border-dashed border-border/60 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              + Nieuwe success story vastleggen
            </button>
          </div>
        )}

        {/* OUTPUT */}
        {activeTab === "output" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Gegenereerde documenten</p>
              <Button size="sm" variant="soft"><Plus className="h-3 w-3" /> Genereren</Button>
            </div>
            {[
              { title: "Richtingskaart", subtitle: "Fase 1 output · v1.0 · 12 april 2026", shared: true },
              { title: "Roadmap v1", subtitle: "Beschikbaar na afsluiting fase 2 gate", shared: false, locked: true },
            ].map((doc) => (
              <div key={doc.title} className={cn("flex items-center gap-3 rounded-xl border border-border/60 bg-surface p-3.5 shadow-soft", doc.locked && "opacity-45")}>
                <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.subtitle}</p>
                </div>
                {doc.shared && <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Gedeeld</span>}
                {doc.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────
const Diederik = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeNav, setActiveNav] = useState<"dashboard" | "usecases" | "prompts">("dashboard");

  const kpis = [
    { label: "Actieve klanten", value: clients.length, note: "Verspreid over 4 fasen", variant: "default" },
    { label: "Open acties", value: 27, note: "6 zonder volgende actie", variant: "warning" },
    { label: "Blokkades", value: clients.filter((c) => c.status === "blocked").length, note: "2 wachten op governance-gate", variant: "destructive" },
    { label: "Success Stories", value: 12, note: "7 direct inzetbaar voor sales", variant: "success" },
  ];

  const navItems = [
    { key: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { key: "usecases" as const, label: "Use Cases", icon: Lightbulb },
    { key: "prompts" as const, label: "Prompts", icon: PenLine },
  ];

  return (
    <div className="relative min-h-screen">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute right-[15%] top-20 h-48 w-48 rounded-full bg-gradient-orbit blur-3xl animate-orbit" />
      </div>

      {/* topbar */}
      <nav className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Campai AI Compass</span>
            </Link>
            <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-surface p-1">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setActiveNav(key); setSelectedClient(null); }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    activeNav === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/journey">
              <Button size="sm" variant="soft">
                <Compass className="h-3.5 w-3.5" /> Naar journey
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">D</div>
              <span className="hidden text-sm font-medium text-foreground sm:block">Diederik</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* ── DASHBOARD ── */}
        {activeNav === "dashboard" && !selectedClient && (
          <div className="space-y-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow mb-2 inline-flex"><Sparkles className="h-3.5 w-3.5" /> Campai intern</span>
                <h1 className="text-3xl font-semibold text-foreground">Consultant Cockpit</h1>
                <p className="mt-1 text-muted-foreground">Overzicht van alle klanten in de Copilot adoptie journey.</p>
              </div>
              <Button variant="hero">
                <Plus className="h-4 w-4" /> Nieuwe klant
              </Button>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map(({ label, value, note, variant }) => (
                <Card key={label} className={cn("glass-panel rounded-xl border-l-4",
                  variant === "warning" ? "border-l-warning" :
                  variant === "destructive" ? "border-l-destructive" :
                  variant === "success" ? "border-l-success" :
                  "border-l-primary"
                )}>
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
                    <p className={cn("mt-1 text-xs", variant === "destructive" ? "font-semibold text-destructive" : "text-muted-foreground")}>{note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Portfolio table */}
            <Card className="glass-panel rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Klanten per fase</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Filter ▾</Button>
                    <Button size="sm" variant="outline" className="text-xs">Sorteren ▾</Button>
                  </div>
                </div>
              </CardHeader>
              <div>
                {/* table head */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground">
                  <div>Klant</div><div>Fase</div><div>Score</div><div>Status</div><div>Volgende actie</div>
                </div>
                {clients.map((client, i) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      "grid w-full grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 border-t border-border/50 px-5 py-3.5 text-left transition-colors hover:bg-surface",
                      i % 2 === 0 ? "bg-background" : "bg-surface/40",
                    )}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.sector} · {client.employees} mw.</p>
                    </div>
                    <div className="flex items-center"><PhaseChip phase={client.phase} /></div>
                    <div className="flex items-center"><ScoreBar score={client.score} /></div>
                    <div className="flex items-center"><StatusDot status={client.status} /></div>
                    <div className="flex items-center gap-1">
                      {client.status === "no-action" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                          <AlertTriangle className="h-3 w-3" /> Actie ontbreekt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-2">
                          {client.nextAction} <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* bottom row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* fase verdeling */}
              <Card className="glass-panel rounded-xl">
                <CardHeader><CardTitle className="text-base">Verdeling per fase</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {([1, 2, 3, 4, 5] as Phase[]).map((p) => {
                    const count = clients.filter((c) => c.phase === p).length;
                    return (
                      <div key={p} className="flex items-center gap-3 text-sm">
                        <PhaseChip phase={p} />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(count / clients.length) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right font-semibold text-foreground">{count} klant{count !== 1 ? "en" : ""}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* recente stories */}
              <Card className="glass-panel rounded-xl">
                <CardHeader><CardTitle className="text-base">Recente success stories</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Teams meetings → acties in 2 klikken", client: "Contoso Manufacturing", phase: 2 },
                    { title: "Weekstart in 5 min. met Copilot", client: "Alpine Logistics", phase: 3 },
                  ].map((s) => (
                    <div key={s.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface p-3.5">
                      <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.client} · <PhaseChip phase={s.phase as Phase} /></p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── CLIENT DETAIL ── */}
        {activeNav === "dashboard" && selectedClient && (
          <ClientDetail client={selectedClient} onBack={() => setSelectedClient(null)} />
        )}

        {/* ── USE CASES LIBRARY ── */}
        {activeNav === "usecases" && (
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow mb-2 inline-flex"><BookOpen className="h-3.5 w-3.5" /> Kennis</span>
                <h1 className="text-3xl font-semibold text-foreground">Use Case Bibliotheek</h1>
                <p className="mt-1 text-muted-foreground">24 bewezen Copilot-scenario's, gefilterd op fase en risico.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Filter op fase ▾</Button>
                <Button size="sm" variant="hero"><Plus className="h-4 w-4" /> Toevoegen</Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Teams meetings → transcript & acties", desc: "Verminder de tijd kwijt aan vergadernotities. Copilot maakt automatisch een samenvatting en actielijst.", phase: 2, app: "Teams", risk: "Laag risico", stories: 3, riskColor: "success" },
                { title: "Weekstart met Copilot", desc: "Persoonlijke dag/weekstart op basis van agenda, mails en taken. Inzicht in 2 minuten.", phase: 2, app: "Outlook · Teams", risk: "Laag risico", stories: 2, riskColor: "success" },
                { title: "AI-beleid opstellen", desc: "Structureer het AI-beleidsdocument op basis van templates en organisatiecontext.", phase: 4, app: "Word", risk: "Gemiddeld risico", stories: 0, riskColor: "warning" },
                { title: "Contracten samenvatten", desc: "Juridische documenten snel doorgronden. Copilot markeert relevante clausules en risico's.", phase: 3, app: "Word", risk: "Hoog risico", stories: 1, riskColor: "destructive" },
                { title: "Centrale agent: HR-onboarding", desc: "Automatiseer de onboarding-flow: welkomstmail, taakoverdracht, checklijst.", phase: 5, app: "Copilot Studio", risk: "Governance vereist", stories: 0, riskColor: "warning" },
                { title: "Slim zoeken door SharePoint", desc: "Medewerkers vinden sneller relevante documenten via Copilot.", phase: 2, app: "SharePoint", risk: "Laag risico", stories: 1, riskColor: "success" },
              ].map((uc) => (
                <Card key={uc.title} className="glass-panel rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-glow">
                  <CardContent className="p-5">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground leading-snug">{uc.title}</h3>
                      <PhaseChip phase={uc.phase as Phase} />
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{uc.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">{uc.app}</span>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        uc.riskColor === "success" ? "border-success/30 bg-success/10 text-success" :
                        uc.riskColor === "destructive" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                        "border-warning/40 bg-warning/10 text-warning-foreground"
                      )}>{uc.risk}</span>
                      {uc.stories > 0 && <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">{uc.stories} stories</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── PROMPT LIBRARY ── */}
        {activeNav === "prompts" && (
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow mb-2 inline-flex"><PenLine className="h-3.5 w-3.5" /> Kennis</span>
                <h1 className="text-3xl font-semibold text-foreground">Prompt Bibliotheek</h1>
                <p className="mt-1 text-muted-foreground">Gestructureerde prompts met context, instructie en output-format.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Status ▾</Button>
                <Button size="sm" variant="hero"><Plus className="h-4 w-4" /> Nieuwe prompt</Button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {[
                { title: "Vergadering samenvatten + actiepunten", app: "Teams", status: "Approved", version: "v1.2", risk: "Laag", context: "Je bent aanwezig geweest bij een vergadering van [afdeling] bij [klantnaam].", instruction: "Maak een samenvatting van max. 5 punten en een actielijst met eigenaar en deadline.", output: "Koppen: Samenvatting / Actiepunten / Beslissingen." },
                { title: "Professionele mail opstellen", app: "Outlook", status: "Approved", version: "v1.0", risk: "Laag", context: "Je schrijft namens [naam] bij [klantnaam].", instruction: "Schrijf een professionele mail op basis van: [kernboodschap]. Toon: zakelijk maar toegankelijk.", output: "Onderwerp + mailbody, max. 150 woorden." },
                { title: "AI-beleid concept genereren", app: "Word", status: "Draft", version: "v0.3", risk: "Gemiddeld", context: null, instruction: null, output: null },
              ].map((p) => (
                <Card key={p.title} className="glass-panel rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold flex-shrink-0",
                        p.status === "Approved" ? "border-success/30 bg-success/10 text-success" : "border-amber-200 bg-amber-50 text-amber-700"
                      )}>{p.status}</span>
                    </div>
                    {p.context && (
                      <div className="rounded-lg border border-border/50 bg-background p-3 text-xs leading-5 text-muted-foreground space-y-1.5">
                        <div><strong className="text-foreground">Context:</strong> {p.context}</div>
                        <div><strong className="text-foreground">Instructie:</strong> {p.instruction}</div>
                        <div><strong className="text-foreground">Output:</strong> {p.output}</div>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">{p.app}</span>
                      <span className="rounded-full border border-border/60 bg-panel px-2.5 py-0.5 text-xs text-muted-foreground">{p.version}</span>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        p.risk === "Laag" ? "border-success/30 bg-success/10 text-success" : "border-amber-200 bg-amber-50 text-amber-700"
                      )}>{p.risk} risico</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Diederik;
