import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Compass,
  Flag,
  Layers3,
  Mail,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { domainLabels, themeStops, type AssessmentQuestion } from "./assessment-data";
import { calculateAssessmentResult, type AnswersState, type ProfileForm } from "./scoring";

const iconMap = {
  Compass,
  ShieldCheck,
  Layers3,
  Flag,
};

const companySizes = ["1-25", "26-100", "101-250", "251-1000", "1000+"];
const roles = ["Directie", "MT", "IT-verantwoordelijke", "Teamlead", "Innovatiemanager", "Overig"];

const defaultProfile: ProfileForm = {
  organizationName: "",
  contactName: "",
  email: "",
  role: roles[0],
  companySize: companySizes[1],
  industry: "",
  microsoftContext: "",
};

const initialAnswers = Object.fromEntries(
  themeStops.flatMap((theme) =>
    theme.questions.map((question) => [question.id, question.type === "multi" ? [] : question.type === "slider" ? 50 : ""]),
  ),
) as AnswersState;

const getColorClasses = (tone: "primary" | "accent" | "warning" | "success") => {
  switch (tone) {
    case "accent":
      return "border-accent/70 bg-accent/50 text-accent-foreground";
    case "warning":
      return "border-warning/40 bg-warning/15 text-foreground";
    case "success":
      return "border-success/35 bg-success/10 text-foreground";
    case "primary":
    default:
      return "border-primary/25 bg-primary/10 text-foreground";
  }
};

const questionValueLabel = (value: number) => {
  if (value < 30) return "kwetsbaar";
  if (value < 55) return "in ontwikkeling";
  if (value < 75) return "werkbaar";
  return "sterk";
};

const JourneyQuestion = ({
  question,
  value,
  onChange,
}: {
  question: AssessmentQuestion;
  value: string | number | string[];
  onChange: (value: string | number | string[]) => void;
}) => {
  if (question.type === "slider") {
    const numericValue = typeof value === "number" ? value : 50;
    return (
      <div className="space-y-4 rounded-xl border border-border/70 bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{question.prompt}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{question.help}</p>
          </div>
          <div className="rounded-full border border-border/60 bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {questionValueLabel(numericValue)}
          </div>
        </div>

        <div className="space-y-3">
          <input
            aria-label={question.prompt}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            max={question.max}
            min={question.min}
            step={question.step}
            type="range"
            value={numericValue}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Nog pril</span>
            <span className="text-sm font-semibold text-foreground">{numericValue}/100</span>
            <span>Goed geborgd</span>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === "multi") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-4 rounded-xl border border-border/70 bg-surface p-5 shadow-soft">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{question.prompt}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{question.help}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options?.map((option) => {
            const isActive = selected.includes(option.value);
            return (
              <button
                key={option.value}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all duration-300",
                  isActive
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border/70 bg-panel hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface",
                )}
                type="button"
                onClick={() => {
                  onChange(
                    isActive ? selected.filter((item) => item !== option.value) : [...selected, option.value],
                  );
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  {isActive ? <BadgeCheck className="h-4 w-4 text-primary" /> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-surface p-5 shadow-soft">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{question.prompt}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{question.help}</p>
      </div>
      <div className="grid gap-3">
        {question.options?.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              className={cn(
                "rounded-xl border p-4 text-left transition-all duration-300",
                active
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border/70 bg-panel hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface",
              )}
              type="button"
              onClick={() => onChange(option.value)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-foreground">{option.label}</div>
                  {option.hint ? <div className="mt-1 text-sm text-muted-foreground">{option.hint}</div> : null}
                </div>
                {active ? <ArrowRight className="h-4 w-4 text-primary" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const JourneyExperience = () => {
  const [phase, setPhase] = useState<"intro" | "profile" | "journey" | "results">("intro");
  const [activeStop, setActiveStop] = useState(0);
  const [profile, setProfile] = useState<ProfileForm>(defaultProfile);
  const [answers, setAnswers] = useState<AnswersState>(initialAnswers);

  const totalQuestions = useMemo(() => themeStops.reduce((sum, stop) => sum + stop.questions.length, 0), []);
  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter((value) =>
        Array.isArray(value) ? value.length > 0 : typeof value === "number" ? true : Boolean(value),
      ).length,
    [answers],
  );

  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const result = useMemo(() => calculateAssessmentResult(profile, answers), [profile, answers]);

  const activeTheme = themeStops[activeStop];
  const currentIcon = iconMap[activeTheme.icon as keyof typeof iconMap] ?? Compass;
  const CurrentIcon = currentIcon;

  const profileReady = profile.organizationName && profile.contactName && profile.email && profile.industry;

  const onAnswerChange = (questionId: string, value: string | number | string[]) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  return (
    <div className="journey-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-gradient-orbit blur-3xl animate-orbit" />
        <div className="absolute right-[12%] top-[28rem] h-56 w-56 rounded-full bg-gradient-orbit blur-3xl animate-orbit" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6 animate-fade-in">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> AI maturity journey voor MKB
            </span>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Ontdek waar jullie organisatie vandaag staat met AI — en wat de slimste volgende stap is.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Geen saaie vragenlijst, maar een begeleide journey die zichtbaar maakt waar kansen, blokkades en prioriteiten liggen.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="xl" variant="hero" onClick={() => setPhase("profile")}>
                Start de journey
                <MoveRight className="h-4 w-4" />
              </Button>
              <Button size="xl" variant="soft" onClick={() => setPhase("results")}>
                Bekijk voorbeeldresultaat
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                "AI-volwassenheidsscore",
                "Roadmap voor 3 maanden",
                "Thema-advies en quick wins",
                "Gerichte CTA’s voor intake of workshop",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-border/60 bg-surface px-4 py-4 text-sm text-foreground shadow-soft">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="glass-panel overflow-hidden rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Journey preview</p>
                  <CardTitle className="mt-2 text-2xl">Van verkenning naar gerichte versnelling</CardTitle>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 p-3 text-primary shadow-glow">
                  <Brain className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {themeStops.map((stop, index) => {
                const Icon = iconMap[stop.icon as keyof typeof iconMap] ?? Compass;
                return (
                  <div
                    key={stop.id}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-4 transition-all duration-300",
                      index === activeStop ? "border-primary/30 bg-primary/10 shadow-glow" : "border-border/60 bg-surface",
                    )}
                  >
                    <div className={cn("rounded-full border p-3", getColorClasses(stop.colorToken))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">{stop.title}</div>
                      <div className="text-sm text-muted-foreground">{stop.summary}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <Card className="glass-panel rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Waar je staat</p>
                  <h2 className="section-title mt-2 text-2xl">Altijd zicht op voortgang en opbrengst</h2>
                </div>
                <div className="score-ring grid h-20 w-20 place-items-center rounded-full p-1 shadow-glow" style={{ ["--score-angle" as string]: `${result.overallScore * 3.6}deg` }}>
                  <div className="grid h-full w-full place-items-center rounded-full bg-background text-center">
                    <div>
                      <div className="text-xl font-semibold text-foreground">{result.overallScore}</div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">score</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Voortgang</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid gap-3">
                  {result.domainScores.slice(0, 5).map((domain) => (
                    <div key={domain.key} className="rounded-xl border border-border/60 bg-surface p-4">
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
                        <span>{domain.label}</span>
                        <span>{domain.score}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${domain.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {phase === "profile" ? (
              <Card className="glass-panel rounded-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Eerst even jullie vertrekpunt</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: "organizationName", label: "Organisatienaam", type: "text", span: "sm:col-span-2" },
                    { key: "contactName", label: "Naam contactpersoon", type: "text", span: "" },
                    { key: "email", label: "E-mail", type: "email", span: "" },
                    { key: "industry", label: "Branche", type: "text", span: "" },
                    { key: "microsoftContext", label: "Microsoft 365 / licentiecontext", type: "text", span: "" },
                  ].map((field) => (
                    <label key={field.key} className={cn("grid gap-2", field.span)}>
                      <span className="text-sm font-medium text-foreground">{field.label}</span>
                      <input
                        className="h-11 rounded-xl border border-border/70 bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                        type={field.type}
                        value={profile[field.key as keyof ProfileForm]}
                        onChange={(event) =>
                          setProfile((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                      />
                    </label>
                  ))}

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">Functie / rol</span>
                    <select
                      className="h-11 rounded-xl border border-border/70 bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                      value={profile.role}
                      onChange={(event) => setProfile((current) => ({ ...current, role: event.target.value }))}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">Bedrijfsgrootte</span>
                    <select
                      className="h-11 rounded-xl border border-border/70 bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                      value={profile.companySize}
                      onChange={(event) => setProfile((current) => ({ ...current, companySize: event.target.value }))}
                    >
                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                    <Button size="xl" variant="hero" disabled={!profileReady} onClick={() => setPhase("journey")}>
                      Naar de journey
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="xl" variant="soft" onClick={() => setPhase("intro")}>
                      Terug
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {phase === "journey" ? (
              <Card className="glass-panel rounded-xl animate-fade-in">
                <CardHeader className="border-b border-border/50 pb-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("rounded-full border p-3", getColorClasses(activeTheme.colorToken))}>
                          <CurrentIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">Checkpoint {activeStop + 1}</p>
                          <CardTitle className="text-2xl">{activeTheme.title}</CardTitle>
                        </div>
                      </div>
                      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{activeTheme.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {themeStops.map((stop, index) => (
                        <button
                          key={stop.id}
                          className={cn(
                            "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all",
                            index === activeStop
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border/60 bg-surface text-muted-foreground hover:border-primary/30",
                          )}
                          type="button"
                          onClick={() => setActiveStop(index)}
                        >
                          {stop.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  {activeTheme.questions.map((question) => (
                    <JourneyQuestion
                      key={question.id}
                      question={question}
                      value={answers[question.id]}
                      onChange={(value) => onAnswerChange(question.id, value)}
                    />
                  ))}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      size="xl"
                      variant="soft"
                      disabled={activeStop === 0}
                      onClick={() => setActiveStop((current) => Math.max(0, current - 1))}
                    >
                      Vorige
                    </Button>
                    {activeStop < themeStops.length - 1 ? (
                      <Button size="xl" variant="hero" onClick={() => setActiveStop((current) => current + 1)}>
                        Volgende checkpoint
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="xl" variant="hero" onClick={() => setPhase("results")}>
                        Bekijk resultaten
                        <Target className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {phase === "results" ? (
              <div className="space-y-6 animate-fade-in">
                <Card className="glass-panel rounded-xl overflow-hidden">
                  <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                    <div className="space-y-4">
                      <div className="eyebrow">AI-volwassenheid</div>
                      <div>
                        <h2 className="text-3xl font-semibold text-foreground">{result.maturityLevel}</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{result.maturityDescription}</p>
                      </div>
                      <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">AI-profieltype</p>
                        <p className="mt-2 text-lg font-semibold text-foreground">{result.archetype}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {result.domainScores.map((domain) => (
                        <div key={domain.key} className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-foreground">{domain.label}</span>
                            <span className="text-sm font-semibold text-primary">{domain.score}/100</span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${domain.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                  <Card className="glass-panel rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">Topprioriteiten voor 3 maanden</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.roadmap.map((step, index) => (
                        <div key={step.month} className="flex gap-4 rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{step.month}</p>
                            <h3 className="mt-1 text-base font-semibold text-foreground">{step.title}</h3>
                            <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass-panel rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">Advies & quick wins</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.recommendations.map((recommendation) => (
                        <div key={recommendation.theme} className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base font-semibold text-foreground">{recommendation.theme}</h3>
                            <span className="rounded-full border border-border/60 bg-panel px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                              {recommendation.priority}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{recommendation.text}</p>
                          <p className="mt-3 text-sm font-medium text-primary">{recommendation.relatedSolution}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                  <Card className="glass-panel rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">Interpretatie en benchmarkduiding</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                        <p className="text-sm font-semibold text-foreground">Wat valt op</p>
                        <ul className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
                          {result.strengths.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft">
                        <p className="text-sm font-semibold text-foreground">Waar de meeste potentie zit</p>
                        <ul className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
                          {result.opportunities.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-surface p-4 shadow-soft lg:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full border border-primary/20 bg-primary/10 p-2 text-primary">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Copilot-fit</p>
                            <p className="mt-2 text-sm leading-7 text-muted-foreground">{result.copilotFit.summary}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-panel rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">Zet de volgende stap</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { title: "Plan een intakegesprek", icon: Mail, subtitle: "Vertaal de scan naar een concreet plan." },
                        { title: "Boek een workshop", icon: Target, subtitle: "Werk use cases, governance en prioriteiten uit met je team." },
                        { title: "Ontvang het rapport per mail", icon: BadgeCheck, subtitle: "Deel de uitkomst intern met directie of MT." },
                        { title: "Verken Microsoft Copilot", icon: Brain, subtitle: "Alleen wanneer jullie context daar klaar voor is." },
                      ].map((action) => {
                        const ActionIcon = action.icon;
                        return (
                          <button
                            key={action.title}
                            className="w-full rounded-xl border border-border/60 bg-surface p-4 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
                            type="button"
                          >
                            <div className="flex items-start gap-4">
                              <div className="rounded-full border border-primary/20 bg-primary/10 p-3 text-primary">
                                <ActionIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-foreground">{action.title}</h3>
                                <p className="mt-1 text-sm leading-7 text-muted-foreground">{action.subtitle}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm leading-7 text-muted-foreground">
                        Klaar voor sales-opvolging: organisatie, contactpersoon, scoreprofiel en conversie-intentie kunnen direct worden opgeslagen zodra Cloud-data wordt gekoppeld.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="xl" variant="hero" onClick={() => setPhase("journey")}>
                    Journey opnieuw bekijken
                  </Button>
                  <Button size="xl" variant="soft" onClick={() => setPhase("profile")}>
                    Gegevens aanpassen
                  </Button>
                </div>
              </div>
            ) : null}

            {phase === "intro" ? (
              <Card className="glass-panel rounded-xl animate-fade-in">
                <CardContent className="grid gap-4 p-6 lg:grid-cols-3">
                  {[
                    {
                      title: "Helder vertrekpunt",
                      text: "Brengt AI-gebruik, governance, security en adoptie samen in één duidelijk beeld.",
                    },
                    {
                      title: "Slim advies",
                      text: "Geeft thematisch advies dat meebeweegt met de antwoorden en maturityscore.",
                    },
                    {
                      title: "Commerciële follow-up",
                      text: "Stuurt intelligent naar intake, workshop of Copilot-verkenning wanneer dat logisch is.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-border/60 bg-surface p-5 shadow-soft">
                      <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {Object.entries(domainLabels).slice(0, 3).map(([key, label]) => {
            const score = result.domainScores.find((item) => item.key === key)?.score ?? 0;
            return (
              <Card key={key} className="glass-panel rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">{score}/100</p>
                    </div>
                    <div className="rounded-full border border-border/60 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      live score
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default JourneyExperience;