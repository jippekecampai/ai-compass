import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import JourneyExperience from "@/components/ai-journey/JourneyExperience";

// ── Campai brand tokens ─────────────────────────────────────────────────────
const C = {
  navy: "#0B1F3A",
  blue: "#1565D8",
  lime: "#C4D400",
  white: "#FFFFFF",
  offwhite: "#F8F9FA",
} as const;

// ── Campai C-dot logo ───────────────────────────────────────────────────────
const CampaiLogo = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path
      d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C24.8 36 29.12 33.84 32 30.4L28 27.36C26.12 29.68 23.22 31.2 20 31.2C13.92 31.2 9.2 26.479 9.2 20.4C9.2 14.321 13.92 9.6 20 9.6C23.22 9.6 26.12 11.12 28 13.44L32 10.4C29.12 6.96 24.8 4 20 4Z"
      fill={C.blue}
    />
    <circle cx="30.5" cy="10.5" r="4" fill={C.blue} />
  </svg>
);

// ── Stars ───────────────────────────────────────────────────────────────────
const Stars = () => (
  <span className="inline-flex items-center gap-0.5" aria-label="4.5 sterren">
    {[1, 2, 3, 4].map((i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#F5C518">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
    {/* half star */}
    <svg width="13" height="13" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="#F5C518" />
          <stop offset="50%" stopColor="#D1D5DB" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="url(#half)"
      />
    </svg>
  </span>
);

// ── Journey page ────────────────────────────────────────────────────────────
const Journey = () => {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    // Tiny timeout to let React re-render before scrolling
    setTimeout(() => {
      document.getElementById("journey-app")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.navy }} className="py-2 text-xs text-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2">
            <Stars />
            <a
              href="https://campai.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              Blije klanten
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-5">
            <a
              href="tel:0793637050"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3" />
              079 363 70 50
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: C.white, borderColor: "#E5E7EB" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
            <CampaiLogo size={34} />
            <span
              style={{ color: C.blue, fontFamily: "'Sora', sans-serif" }}
              className="text-xl font-bold tracking-tight"
            >
              campai
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              style={{ color: "#374151" }}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              ← Terug naar home
            </Link>
            <Link
              to="/diederik"
              style={{ color: "#374151" }}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Consultant cockpit
            </Link>
            <a
              href="https://campai.nl"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#374151" }}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              campai.nl ↗
            </a>
          </div>

          {/* CTA pill */}
          <a
            href="https://campai.nl/contact"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: C.lime, color: C.navy }}
            className="rounded-full px-5 py-2 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            Neem contact op
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: C.navy }}
        className="relative overflow-hidden py-20 sm:py-28"
      >
        {/* subtle gradient orbs */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${C.blue}, transparent 70%)` }}
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${C.lime}, transparent 70%)` }}
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">

            {/* Left: copy */}
            <div>
              <div
                style={{ backgroundColor: C.lime, color: C.navy }}
                className="mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest"
              >
                AI Maturity Journey · MKB
              </div>

              <h1
                style={{ fontFamily: "'Sora', sans-serif", color: C.white }}
                className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              >
                ONTDEK WAAR<br />
                JULLIE ORGANISATIE<br />
                STAAT MET AI
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                Geen saaie vragenlijst, maar een begeleide journey die in 10 minuten zichtbaar maakt waar kansen, blokkades en prioriteiten liggen — met een concreet 3-maandsplan.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  style={{ backgroundColor: C.lime, color: C.navy }}
                  className="rounded-full px-8 py-3.5 text-base font-extrabold shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all"
                  onClick={handleStart}
                >
                  Ja, start de journey! →
                </button>
                <a
                  href="https://campai.nl/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: C.white,
                    border: `1.5px solid rgba(255,255,255,0.35)`,
                  }}
                  className="rounded-full px-7 py-3.5 text-base font-semibold hover:border-white/60 hover:bg-white/5 transition-all"
                >
                  Liever een gesprek
                </a>
              </div>

              {/* Trust chips */}
              <div className="mt-9 flex flex-wrap gap-5">
                {[
                  "Duurt ~10 minuten",
                  "Geen account nodig",
                  "Direct resultaat",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    <span style={{ color: C.lime }} className="text-base font-bold">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: feature cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  num: "01",
                  title: "AI-volwassenheidsscore",
                  text: "Een helder getal dat laat zien hoe ver jullie AI-reis al gevorderd is.",
                },
                {
                  num: "02",
                  title: "3-maands roadmap",
                  text: "Concrete prioriteiten voor het komend kwartaal, afgestemd op jullie context.",
                },
                {
                  num: "03",
                  title: "Thematisch advies",
                  text: "Per domein — gebruik, governance, security — een gerichte aanbeveling.",
                },
                {
                  num: "04",
                  title: "Copilot-fit analyse",
                  text: "Is Microsoft Copilot nu al zinvol? De scan geeft een eerlijk antwoord.",
                },
              ].map(({ num, title, text }) => (
                <div
                  key={num}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  className="rounded-2xl p-5"
                >
                  <div
                    style={{ color: C.lime }}
                    className="mb-3 text-3xl font-black leading-none opacity-40"
                  >
                    {num}
                  </div>
                  <h3
                    style={{ color: C.white, fontFamily: "'Sora', sans-serif" }}
                    className="text-base font-bold"
                  >
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOE WERKT HET ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.offwhite }} className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 text-center">
            <div
              style={{ backgroundColor: C.lime, color: C.navy }}
              className="mb-4 inline-flex rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest"
            >
              Werkwijze
            </div>
            <h2
              style={{ fontFamily: "'Sora', sans-serif", color: C.navy }}
              className="text-3xl font-black uppercase"
            >
              VAN VRAAG NAAR RICHTING IN 3 STAPPEN
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Vul je profiel in",
                text: "Organisatienaam, sector, grootte en Microsoft-context. Duurt minder dan 1 minuut.",
              },
              {
                step: "02",
                title: "Doorloop de journey",
                text: "4 checkpoints: gebruik, governance, security en adoptie. Sliders en keuzes, geen essays.",
              },
              {
                step: "03",
                title: "Ontvang je resultaat",
                text: "Maturity score, profieltype, aanbevelingen en een 3-maands roadmap. Direct bruikbaar.",
              },
            ].map(({ step, title, text }) => (
              <div
                key={step}
                style={{
                  backgroundColor: C.white,
                  border: "1.5px solid #E5E7EB",
                }}
                className="rounded-2xl p-7 shadow-sm"
              >
                <div
                  style={{ color: C.navy, fontFamily: "'Sora', sans-serif" }}
                  className="mb-4 text-5xl font-black opacity-15"
                >
                  {step}
                </div>
                <h3
                  style={{ color: C.navy, fontFamily: "'Sora', sans-serif" }}
                  className="text-lg font-bold"
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              style={{ backgroundColor: C.lime, color: C.navy }}
              className="rounded-full px-10 py-4 text-base font-extrabold shadow-md hover:opacity-90 hover:scale-[1.02] transition-all"
              onClick={handleStart}
            >
              Start de journey gratis →
            </button>
          </div>
        </div>
      </section>

      {/* ── JOURNEY APP ──────────────────────────────────────────────────── */}
      <div id="journey-app" style={{ backgroundColor: C.white }}>
        <JourneyExperience initialPhase={started ? "profile" : "intro"} />
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: C.navy }} className="py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <CampaiLogo size={30} />
              <span
                style={{ color: C.white, fontFamily: "'Sora', sans-serif" }}
                className="text-lg font-bold"
              >
                campai
              </span>
            </Link>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              © 2026 Campai · AI Journey Portaal
            </p>
            <div className="flex items-center gap-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <a href="https://campai.nl" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                campai.nl
              </a>
              <Link to="/" className="hover:text-white transition-colors">
                AI Compass home
              </Link>
              <Link to="/diederik" className="hover:text-white transition-colors">
                Consultant cockpit
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Journey;
