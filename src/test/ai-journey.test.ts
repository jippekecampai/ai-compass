import { describe, expect, it } from "vitest";

import { calculateAssessmentResult } from "@/components/ai-journey/scoring";

describe("calculateAssessmentResult", () => {
  it("geeft een schaalbare score terug bij brede volwassenheid", () => {
    const result = calculateAssessmentResult(
      {
        organizationName: "Voorbeeld BV",
        contactName: "Jamie",
        email: "jamie@example.com",
        role: "MT",
        companySize: "101-250",
        industry: "Zakelijke dienstverlening",
        microsoftContext: "Microsoft 365 E5 met Copilot-verkenning",
      },
      {
        "current-ai-usage": "team",
        "tool-awareness": ["microsoft-copilot", "chatgpt", "claude"],
        governance: 70,
        security: 70,
        "data-readiness": 65,
        "adoption-skills": 60,
        "use-cases": "prioritized",
        leadership: 75,
        roadblocks: "businesscase",
      },
    );

    expect(result.overallScore).toBeGreaterThan(60);
    expect(result.copilotFit.fit).toBe("high");
    expect(result.roadmap).toHaveLength(3);
  });

  it("blijft voorzichtig als fundament ontbreekt", () => {
    const result = calculateAssessmentResult(
      {
        organizationName: "Starter BV",
        contactName: "Alex",
        email: "alex@example.com",
        role: "Directie",
        companySize: "1-25",
        industry: "Retail",
        microsoftContext: "Beperkt Microsoft gebruik",
      },
      {
        "current-ai-usage": "none",
        "tool-awareness": ["chatgpt"],
        governance: 10,
        security: 20,
        "data-readiness": 25,
        "adoption-skills": 20,
        "use-cases": "unclear",
        leadership: 30,
        roadblocks: "governance",
      },
    );

    expect(result.overallScore).toBeLessThan(35);
    expect(result.copilotFit.fit).toBe("low");
    expect(result.recommendations[0].priority).toBe("Nu");
  });
});