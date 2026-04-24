import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Brain, Compass, MoveRight, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-24 h-64 w-64 rounded-full bg-gradient-orbit blur-3xl animate-orbit" />
        <div className="absolute right-[10%] top-[36rem] h-72 w-72 rounded-full bg-gradient-orbit blur-3xl animate-orbit" style={{ animationDelay: "3s" }} />
      </div>

      {/* nav */}
      <nav className="relative z-10 border-b border-border/40 bg-background/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-1.5 text-primary">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold text-foreground">Campai AI Compass</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/journey"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              De Journey
            </Link>
            <Link
              to="/diederik"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Consultant
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">

        {/* ── HERO ── */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="eyebrow mb-6 inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            AI maturity journey voor MKB
          </span>

          <h1 className="text-balance text-5xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Ontdek waar jullie
            <br />
            organisatie staat met AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Geen saaie vragenlijst, maar een begeleide journey die in 10 minuten zichtbaar maakt waar kansen, blokkades en prioriteiten liggen — met een concreet 3-maandsplan.
          </p>

          {/* PRIMARY CTA — groot en centraal */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/journey">
              <Button
                size="xl"
                variant="hero"
                className="h-16 rounded-2xl px-10 text-lg font-semibold shadow-glow transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_hsl(var(--glow)/0.4)]"
              >
                Start de journey
                <MoveRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/journey">
              <Button size="xl" variant="soft" className="h-16 rounded-2xl px-8 text-base">
                Bekijk voorbeeldresultaat
              </Button>
            </Link>
          </div>

          {/* trust chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Duurt ~10 minuten", "Geen account nodig", "Direct resultaat"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground"
              >
                <BadgeCheck className="h-3.5 w-3.5 text-success" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── WAT JE KRIJGT ── */}
        <div className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, title: "AI-volwassenheidsscore", text: "Zichtbaar getal dat laat zien hoe volwassen jullie AI-gebruik is." },
            { icon: Compass, title: "3-maands roadmap", text: "Concrete prioriteiten voor de komende kwartaal, afgestemd op jullie context." },
            { icon: Brain, title: "Thematisch advies", text: "Per domein (gebruik, governance, security) een gerichte aanbeveling." },
            { icon: Sparkles, title: "Copilot-fit analyse", text: "Is Microsoft Copilot nu al zinvol? De scan geeft een eerlijk antwoord." },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title} className="glass-panel rounded-xl transition-all hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="mb-4 w-fit rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── HOE HET WERKT ── */}
        <div className="mt-24">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3 inline-flex">Werkwijze</p>
            <h2 className="text-3xl font-semibold text-foreground">Van vraag naar richting in 3 stappen</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { step: "01", title: "Vul je profiel in", text: "Organisatienaam, sector, grootte en Microsoft-context. Duurt 1 minuut." },
              { step: "02", title: "Doorloop de journey", text: "4 checkpoints: gebruik, governance, security en adoptie. Sliders en keuzes, geen essays." },
              { step: "03", title: "Ontvang je resultaat", text: "Maturity score, profieltype, aanbevelingen en een 3-maands roadmap. Direct bruikbaar." },
            ].map(({ step, title, text }) => (
              <div key={step} className="glass-panel rounded-xl p-6">
                <div className="mb-4 text-4xl font-semibold text-primary/25">{step}</div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONSULTANT BANNER ── */}
        <div className="mt-24">
          <Card className="glass-panel overflow-hidden rounded-2xl">
            <CardContent className="grid items-center gap-8 p-8 lg:grid-cols-[1fr_auto]">
              <div className="flex items-start gap-5">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Campai intern</p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">Consultant cockpit</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Overzicht van alle klanten, hun fase in de Copilot journey, adoptiescore en volgende acties.
                    Voor Campai-consultants.
                  </p>
                </div>
              </div>
              <Link to="/diederik">
                <Button variant="soft" size="lg" className="whitespace-nowrap">
                  Open cockpit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* ── FOOTER CTA ── */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-semibold text-foreground">Klaar om te beginnen?</h2>
          <p className="mt-3 text-muted-foreground">10 minuten. Geen account. Direct inzicht.</p>
          <div className="mt-8">
            <Link to="/journey">
              <Button
                size="xl"
                variant="hero"
                className="h-14 rounded-2xl px-10 text-base font-semibold shadow-glow"
              >
                Start de journey
                <MoveRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

      </main>

      <footer className="relative z-10 border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        © 2026 Campai · AI Journey Portaal
      </footer>
    </div>
  );
};

export default Index;
