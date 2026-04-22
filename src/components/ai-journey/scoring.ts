import { archetypes, domainLabels, maturityLevels, themeStops, type DomainKey } from "./assessment-data";

export type ProfileForm = {
  organizationName: string;
  contactName: string;
  email: string;
  role: string;
  companySize: string;
  industry: string;
  microsoftContext: string;
};

export type AnswersState = Record<string, string | number | string[]>;

export type DomainScore = {
  key: DomainKey;
  label: string;
  score: number;
};

export type Recommendation = {
  theme: string;
  priority: "Nu" | "Binnen 30 dagen" | "Binnen 90 dagen";
  text: string;
  relatedSolution: string;
};

export type AssessmentResult = {
  overallScore: number;
  maturityLevel: string;
  maturityDescription: string;
  archetype: string;
  domainScores: DomainScore[];
  strengths: string[];
  opportunities: string[];
  recommendations: Recommendation[];
  roadmap: Array<{ month: string; title: string; detail: string }>;
  copilotFit: {
    fit: "high" | "medium" | "low";
    summary: string;
  };
};

const emptyDomainAccumulator = (): Record<DomainKey, { weighted: number; weights: number }> => ({
  usage: { weighted: 0, weights: 0 },
  governance: { weighted: 0, weights: 0 },
  security: { weighted: 0, weights: 0 },
  data: { weighted: 0, weights: 0 },
  adoption: { weighted: 0, weights: 0 },
  useCases: { weighted: 0, weights: 0 },
  strategy: { weighted: 0, weights: 0 },
  tooling: { weighted: 0, weights: 0 },
});

const normalizeAnswer = (questionId: string, value: string | number | string[]) => {
  const question = themeStops.flatMap((theme) => theme.questions).find((item) => item.id === questionId);
  if (!question) return 0;

  if (question.type === "slider" && typeof value === "number") {
    return value;
  }

  if ((question.type === "choice" || question.type === "priority") && typeof value === "string") {
    return question.options?.find((option) => option.value === value)?.score ?? 0;
  }

  if (question.type === "multi" && Array.isArray(value)) {
    const scores = value
      .map((item) => question.options?.find((option) => option.value === item)?.score ?? 0)
      .sort((a, b) => b - a);
    const top = scores.slice(0, 3);
    if (!top.length) return 0;
    return Math.min(100, Math.round(top.reduce((sum, current) => sum + current, 0) / top.length + value.length * 4));
  }

  return 0;
};

export const calculateAssessmentResult = (profile: ProfileForm, answers: AnswersState): AssessmentResult => {
  const domainAccumulator = emptyDomainAccumulator();

  themeStops.forEach((theme) => {
    theme.questions.forEach((question) => {
      const rawValue = answers[question.id];
      if (rawValue === undefined) return;

      const score = normalizeAnswer(question.id, rawValue);
      domainAccumulator[question.domain].weighted += score * question.weight;
      domainAccumulator[question.domain].weights += question.weight;
    });
  });

  const domainScores = (Object.keys(domainAccumulator) as DomainKey[]).map((key) => {
    const bucket = domainAccumulator[key];
    const score = bucket.weights === 0 ? 0 : Math.round(bucket.weighted / bucket.weights);
    return { key, label: domainLabels[key], score };
  });

  const weightMap: Record<DomainKey, number> = {
    usage: 1.05,
    governance: 1.2,
    security: 1.2,
    data: 1.1,
    adoption: 1,
    useCases: 1.15,
    strategy: 1.1,
    tooling: 0.8,
  };

  const overallScore = Math.round(
    domainScores.reduce((sum, domain) => sum + domain.score * weightMap[domain.key], 0) /
      domainScores.reduce((sum, domain) => sum + weightMap[domain.key], 0),
  );

  const maturity = [...maturityLevels].reverse().find((level) => overallScore >= level.min) ?? maturityLevels[0];
  const archetype = archetypes.find((entry) => overallScore <= entry.max)?.label ?? archetypes[archetypes.length - 1].label;

  const sorted = [...domainScores].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3).map((item) => `${item.label} laat al duidelijke basis zien.`);
  const opportunities = [...sorted]
    .reverse()
    .slice(0, 3)
    .map((item) => `${item.label} biedt nu de meeste versnelling als jullie hier gericht op investeren.`);

  const selectedTools = Array.isArray(answers["tool-awareness"]) ? answers["tool-awareness"] : [];
  const governanceScore = domainScores.find((item) => item.key === "governance")?.score ?? 0;
  const securityScore = domainScores.find((item) => item.key === "security")?.score ?? 0;
  const useCaseScore = domainScores.find((item) => item.key === "useCases")?.score ?? 0;
  const adoptionScore = domainScores.find((item) => item.key === "adoption")?.score ?? 0;
  const dataScore = domainScores.find((item) => item.key === "data")?.score ?? 0;

  const hasMicrosoftSignal =
    selectedTools.includes("microsoft-copilot") || profile.microsoftContext.toLowerCase().includes("microsoft");

  const copilotFit = hasMicrosoftSignal
    ? governanceScore >= 50 && securityScore >= 50 && useCaseScore >= 50
      ? {
          fit: "high" as const,
          summary:
            "Microsoft Copilot sluit goed aan: er is voldoende basis om van losse prompts naar productiviteitswinst en teamadoptie te bewegen.",
        }
      : governanceScore < 35 || securityScore < 35 || useCaseScore < 35 || dataScore < 35
        ? {
            fit: "low" as const,
            summary:
              "Copilot is nu waarschijnlijk nog te vroeg; eerst fundament, kaders en prioritaire use cases aanscherpen voorkomt teleurstellende adoptie.",
          }
        : {
            fit: "medium" as const,
            summary:
              "Microsoft Copilot kan interessant zijn, maar het meeste rendement ontstaat pas zodra governance, security en use cases scherper zijn uitgewerkt.",
          }
    : governanceScore >= 60 && useCaseScore >= 60 && adoptionScore >= 55
      ? {
          fit: "medium" as const,
          summary:
            "Copilot lijkt een logische vervolgstap zodra jullie Microsoft-context en prioritaire use cases concreet zijn gemaakt.",
        }
      : {
          fit: "low" as const,
          summary:
            "De grootste winst zit nu eerst in fundament en focus; een Copilot-traject is waarschijnlijk sterker zodra beleid, adoptie en data verder zijn aangescherpt.",
        };

  const recommendations: Recommendation[] = [
    {
      theme: "Governance & beleid",
      priority: governanceScore < 45 ? "Nu" : "Binnen 30 dagen",
      text:
        governanceScore < 45
          ? "Leg eigenaarschap, spelregels en besluitvorming vast zodat experimenten niet los zand blijven."
          : "Verfijn bestaande kaders naar heldere richtlijnen per team en use case.",
      relatedSolution: "AI governance sprint",
    },
    {
      theme: "Security & compliance",
      priority: securityScore < 50 ? "Nu" : "Binnen 30 dagen",
      text:
        securityScore < 50
          ? "Maak direct duidelijk welke data wel en niet in publieke of generatieve AI-tools mag worden gebruikt."
          : "Vertaal beleid naar praktische checklists voor medewerkers en proceseigenaren.",
      relatedSolution: "Security baseline voor AI",
    },
    {
      theme: "Use cases & ROI",
      priority: useCaseScore < 60 ? "Binnen 30 dagen" : "Binnen 90 dagen",
      text:
        useCaseScore < 60
          ? "Selecteer 3 concrete use cases met aantoonbare tijdswinst of kwaliteitsverbetering als vliegwiel."
          : "Breng waarde, eigenaarschap en KPI’s per use case samen in een compacte businesscase.",
      relatedSolution: "Use case workshop",
    },
    {
      theme: "Adoptie & skills",
      priority: adoptionScore < 55 ? "Binnen 30 dagen" : "Binnen 90 dagen",
      text:
        adoptionScore < 55
          ? "Bouw een kleine groep ambassadeurs en geef teams praktische training op echte werksituaties."
          : "Versnel adoptie met formats, voorbeeldprompts en korte leerroutines binnen teams.",
      relatedSolution: "Adoptieprogramma",
    },
    {
      theme: "Data readiness",
      priority: dataScore < 50 ? "Binnen 30 dagen" : "Binnen 90 dagen",
      text:
        dataScore < 50
          ? "Breng databronnen, toegankelijkheid en informatiekwaliteit in kaart voordat jullie op schaal automatiseren."
          : "Verbind de meest relevante kennisbronnen en maak eigenaarschap expliciet.",
      relatedSolution: "Data readiness scan",
    },
  ];

  const topBlocker = typeof answers["roadblocks"] === "string" ? answers["roadblocks"] : "focus";

  const roadmap = [
    {
      month: "Maand 1",
      title: topBlocker === "governance" ? "AI-kaders aanscherpen" : "Scherpste use cases kiezen",
      detail:
        topBlocker === "governance"
          ? "Bepaal eigenaarschap, spelregels, risicozones en beslismomenten voor pilots."
          : "Selecteer een compacte set processen waar AI binnen 90 dagen zichtbaar rendement kan leveren.",
    },
    {
      month: "Maand 2",
      title: topBlocker === "skills" ? "Teams activeren" : "Pilotontwerp en securitycheck",
      detail:
        topBlocker === "skills"
          ? "Train sleutelteams, introduceer voorbeeldscenario’s en activeer ambassadeurs."
          : "Vertaal prioriteiten naar één of twee gecontroleerde pilots met heldere security- en compliance-afspraken.",
    },
    {
      month: "Maand 3",
      title: copilotFit.fit === "high" ? "Opschalen met Copilot-kans" : "Fundament borgen en opschaalbesluit",
      detail:
        copilotFit.fit === "high"
          ? "Evalueer de pilot, onderbouw business value en bepaal waar Copilot of vergelijkbare tooling het meeste effect heeft."
          : "Toets voortgang, sluit hiaten in beleid of data en bepaal daarna welke tooling als volgende stap het beste past.",
    },
  ];

  return {
    overallScore,
    maturityLevel: maturity.label,
    maturityDescription: maturity.description,
    archetype,
    domainScores,
    strengths,
    opportunities,
    recommendations,
    roadmap,
    copilotFit,
  };
};