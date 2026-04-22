export type DomainKey =
  | "usage"
  | "governance"
  | "security"
  | "data"
  | "adoption"
  | "useCases"
  | "strategy"
  | "tooling";

export type QuestionType = "choice" | "multi" | "slider" | "priority";

export type QuestionOption = {
  value: string;
  label: string;
  hint?: string;
  score?: number;
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  help: string;
  type: QuestionType;
  domain: DomainKey;
  weight: number;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
};

export type ThemeStop = {
  id: string;
  title: string;
  summary: string;
  icon: string;
  colorToken: "primary" | "accent" | "warning" | "success";
  questions: AssessmentQuestion[];
};

export const toolLandscape = [
  "Microsoft Copilot",
  "ChatGPT",
  "Claude",
  "Perplexity",
  "Gemini",
  "GitHub Copilot",
  "Midjourney / image AI",
  "Power Platform AI",
];

export const themeStops: ThemeStop[] = [
  {
    id: "basecamp",
    title: "Startpunt",
    summary: "Breng in kaart hoe AI nu al leeft in de organisatie.",
    icon: "Compass",
    colorToken: "primary",
    questions: [
      {
        id: "current-ai-usage",
        prompt: "Hoe breed wordt AI vandaag al gebruikt binnen jullie organisatie?",
        help: "Denk aan individueel experimenteren én structureel gebruik in teams.",
        type: "choice",
        domain: "usage",
        weight: 1.2,
        options: [
          { value: "none", label: "Nauwelijks of niet", score: 10 },
          { value: "individual", label: "Vooral individueel en ad hoc", score: 30 },
          { value: "team", label: "In meerdere teams voor specifieke taken", score: 60 },
          { value: "broad", label: "Breed ingebed in werkprocessen", score: 85 },
          { value: "core", label: "AI is al strategisch onderdeel van de operatie", score: 100 },
        ],
      },
      {
        id: "tool-awareness",
        prompt: "Welke AI-tools zijn op dit moment bekend of in gebruik?",
        help: "Selecteer alles wat relevant is; dit bepaalt niet alleen de score, maar helpt het advies verfijnen.",
        type: "multi",
        domain: "tooling",
        weight: 0.8,
        options: toolLandscape.map((tool, index) => ({
          value: tool.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          label: tool,
          score: Math.min(20 + index * 8, 70),
        })),
      },
    ],
  },
  {
    id: "governance-gate",
    title: "Richting & kaders",
    summary: "Ontdek of eigenaarschap, beleid en security klaar zijn om op te schalen.",
    icon: "ShieldCheck",
    colorToken: "warning",
    questions: [
      {
        id: "governance",
        prompt: "In hoeverre zijn er al afspraken, beleid of eigenaarschap rond AI?",
        help: "Bijvoorbeeld richtlijnen, verantwoord gebruik, eigenaarschap en besluitvorming.",
        type: "slider",
        domain: "governance",
        weight: 1.4,
        min: 0,
        max: 100,
        step: 10,
      },
      {
        id: "security",
        prompt: "Hoe stevig zijn security, privacy en compliance rond AI geregeld?",
        help: "Kijk naar data-uitwisseling, privacy, risico-inschatting en interne bewustwording.",
        type: "slider",
        domain: "security",
        weight: 1.4,
        min: 0,
        max: 100,
        step: 10,
      },
    ],
  },
  {
    id: "operations-ridge",
    title: "Werkpraktijk",
    summary: "Meet de kracht van data, use cases, vaardigheden en adoptie.",
    icon: "Layers3",
    colorToken: "accent",
    questions: [
      {
        id: "data-readiness",
        prompt: "Hoe bruikbaar en toegankelijk is jullie data- en informatiehuishouding voor AI?",
        help: "Denk aan vindbaarheid, kwaliteit, toegangsrechten en versnippering.",
        type: "slider",
        domain: "data",
        weight: 1.2,
        min: 0,
        max: 100,
        step: 10,
      },
      {
        id: "adoption-skills",
        prompt: "Hoe klaar zijn medewerkers om AI veilig en effectief in te zetten?",
        help: "Denk aan enthousiasme, vaardigheden, training en ambassadeurs.",
        type: "slider",
        domain: "adoption",
        weight: 1.1,
        min: 0,
        max: 100,
        step: 10,
      },
      {
        id: "use-cases",
        prompt: "Hoe concreet zijn kansrijke AI-use cases al in beeld?",
        help: "Bijvoorbeeld backoffice, sales, service, operations of kenniswerk.",
        type: "choice",
        domain: "useCases",
        weight: 1.2,
        options: [
          { value: "unclear", label: "Nog vooral ideeën en losse signalen", score: 20 },
          { value: "list", label: "Er is een ruwe lijst met kansen", score: 45 },
          { value: "prioritized", label: "Use cases zijn geprioriteerd", score: 70 },
          { value: "active-pilots", label: "Er lopen pilots of gecontroleerde experimenten", score: 85 },
          { value: "embedded", label: "AI-use cases leveren al aantoonbare waarde", score: 100 },
        ],
      },
    ],
  },
  {
    id: "summit",
    title: "Ambitie & versnelling",
    summary: "Laat zien hoe veranderbereidheid, leiderschap en tooling elkaar versterken.",
    icon: "Flag",
    colorToken: "success",
    questions: [
      {
        id: "leadership",
        prompt: "Hoe actief stuurt het leiderschap op AI-kansen en prioriteiten?",
        help: "Kijk naar visie, sponsoring, tempo en besluitkracht.",
        type: "slider",
        domain: "strategy",
        weight: 1.3,
        min: 0,
        max: 100,
        step: 10,
      },
      {
        id: "roadblocks",
        prompt: "Waar zit nu de grootste blokkade om echt door te pakken?",
        help: "Kies de factor die nu het meest remt; dit voedt de roadmap en aanbevelingen.",
        type: "priority",
        domain: "strategy",
        weight: 0.9,
        options: [
          { value: "focus", label: "Geen scherpe focus of eigenaarschap", score: 30 },
          { value: "governance", label: "Beleid, security of compliance is te onduidelijk", score: 25 },
          { value: "skills", label: "Te weinig kennis of adoptie in teams", score: 40 },
          { value: "data", label: "Data, systemen en integraties zijn nog niet klaar", score: 35 },
          { value: "businesscase", label: "Waarde en ROI zijn nog niet concreet genoeg", score: 45 },
        ],
      },
    ],
  },
];

export const maturityLevels = [
  { min: 0, label: "Beginner", description: "AI leeft vooral in losse experimenten en vraagt eerst richting en basisafspraken." },
  { min: 30, label: "Verkennend", description: "Er is beweging, maar nog geen samenhangend fundament om veilig op te schalen." },
  { min: 50, label: "Gestructureerd", description: "De organisatie ontwikkelt een herkenbare aanpak en kan versnellen met gerichte prioriteiten." },
  { min: 70, label: "Schaalbaar", description: "AI is serieus ingebed en klaar voor bredere adoptie en waardecreatie." },
  { min: 85, label: "Strategisch", description: "AI is een expliciet onderdeel van sturing, innovatie en concurrentiekracht." },
];

export const archetypes = [
  { max: 30, label: "Ontdekker" },
  { max: 50, label: "Experimenterende organisatie" },
  { max: 70, label: "Zoekende versneller" },
  { max: 85, label: "Georganiseerde toepasser" },
  { max: 100, label: "Strategische koploper" },
];

export const domainLabels: Record<DomainKey, string> = {
  usage: "AI-gebruik",
  governance: "Governance",
  security: "Security",
  data: "Data readiness",
  adoption: "Adoptie & skills",
  useCases: "Use cases",
  strategy: "Sturing & ambitie",
  tooling: "Tooling",
};