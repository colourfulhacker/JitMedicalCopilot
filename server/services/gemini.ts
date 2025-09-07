import { GoogleGenAI } from "@google/genai";

// Use the provided API key
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyClIULNUcJl4-ySTSnNfoIPILpkMMf4A8c" 
});

export interface BusinessPlanResponse {
  title: string;
  summary: string;
  steps: Array<{
    phase: string;
    duration: string;
    tasks: string[];
  }>;
  pricing: {
    inr: string;
    usd: string;
    breakdown: string;
  };
  risks: string[];
  success_metrics: string[];
  timeline: string;
}

export interface CommunicationResponse {
  subject: string;
  content: string;
  type: string;
}

export async function generateBusinessPlan(
  description: string, 
  category: string
): Promise<BusinessPlanResponse> {
  try {
    const systemPrompt = `You are an expert business consultant and MD assistant for Jit Banerjee, a successful entrepreneur in HealthTech and IT Development sectors in India. 

Create a comprehensive, executive-level business action plan that includes:
1. Clear implementation phases with specific tasks
2. Realistic pricing in INR and USD (use current exchange rate ~83 INR/USD)
3. Risk assessment and mitigation strategies
4. Measurable success metrics
5. Professional timeline estimates

Focus on practical, actionable steps that can be implemented immediately. Consider Indian market dynamics, compliance requirements (NDHM, HIPAA for healthcare), and both B2B SaaS and custom development business models.

Respond with JSON in this exact format:
{
  "title": "Professional plan title",
  "summary": "Executive summary of the strategy",
  "steps": [
    {
      "phase": "Phase name",
      "duration": "Time estimate",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ],
  "pricing": {
    "inr": "Amount in INR",
    "usd": "Amount in USD", 
    "breakdown": "Detailed pricing explanation"
  },
  "risks": ["Risk 1", "Risk 2"],
  "success_metrics": ["Metric 1", "Metric 2"],
  "timeline": "Overall timeline summary"
}`;

    const userPrompt = `Category: ${category}
Business Challenge: ${description}

Generate a detailed action plan for this business challenge, focusing on practical implementation steps, realistic financial projections, and measurable outcomes suitable for MD-level decision making.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  phase: { type: "string" },
                  duration: { type: "string" },
                  tasks: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["phase", "duration", "tasks"]
              }
            },
            pricing: {
              type: "object",
              properties: {
                inr: { type: "string" },
                usd: { type: "string" },
                breakdown: { type: "string" }
              },
              required: ["inr", "usd", "breakdown"]
            },
            risks: {
              type: "array",
              items: { type: "string" }
            },
            success_metrics: {
              type: "array",
              items: { type: "string" }
            },
            timeline: { type: "string" }
          },
          required: ["title", "summary", "steps", "pricing", "risks", "success_metrics", "timeline"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    console.log(`Raw Business Plan JSON: ${rawJson}`);

    if (rawJson) {
      const data: BusinessPlanResponse = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from Gemini model");
    }
  } catch (error) {
    console.error("Error generating business plan:", error);
    throw new Error(`Failed to generate business plan: ${error}`);
  }
}

export async function generateCommunication(
  type: string,
  context: string,
  recipients?: string
): Promise<CommunicationResponse> {
  try {
    let systemPrompt = "";
    let communicationType = "";

    switch (type) {
      case "executive-email":
        systemPrompt = `You are drafting a professional executive email for Jit Banerjee, Managing Director of HealthTech and IT Development ventures. Write in a formal, authoritative tone suitable for board members, investors, or senior stakeholders. Include clear action items and next steps.`;
        communicationType = "Executive Email";
        break;
      
      case "investor-pitch":
        systemPrompt = `You are creating an investor pitch document for Jit Banerjee's business ventures. Focus on market opportunity, competitive advantages, financial projections, and funding requirements. Use compelling language that demonstrates strong ROI potential and market traction.`;
        communicationType = "Investor Pitch";
        break;
      
      case "client-proposal":
        systemPrompt = `You are drafting a professional client proposal for HealthTech or IT Development services. Include technical approach, project timeline, deliverables, and pricing. Demonstrate expertise and value proposition clearly.`;
        communicationType = "Client Proposal";
        break;
      
      case "compliance-report":
        systemPrompt = `You are preparing a compliance report for healthcare or IT regulatory requirements. Address NDHM, HIPAA, data security, and audit findings. Use precise regulatory language and include remediation plans.`;
        communicationType = "Compliance Report";
        break;
      
      default:
        systemPrompt = `You are drafting professional business communication for an executive in HealthTech and IT Development.`;
        communicationType = "Business Communication";
    }

    systemPrompt += `\n\nRespond with JSON in this exact format:
{
  "subject": "Professional subject line",
  "content": "Complete communication content with proper formatting and professional structure",
  "type": "${communicationType}"
}`;

    const userPrompt = `Context and Requirements: ${context}
${recipients ? `Recipients: ${recipients}` : ''}

Generate a professional ${communicationType.toLowerCase()} that addresses the provided context with appropriate executive-level language, structure, and content.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            content: { type: "string" },
            type: { type: "string" }
          },
          required: ["subject", "content", "type"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    console.log(`Raw Communication JSON: ${rawJson}`);

    if (rawJson) {
      const data: CommunicationResponse = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from Gemini model");
    }
  } catch (error) {
    console.error("Error generating communication:", error);
    throw new Error(`Failed to generate communication: ${error}`);
  }
}

export async function generateMarketAnalysis(
  sector: string,
  region: string = "India"
): Promise<string> {
  try {
    const systemPrompt = `You are a market research analyst providing insights for business expansion in ${region}. Focus on market size, growth potential, competitive landscape, regulatory environment, and strategic recommendations.`;

    const userPrompt = `Provide a comprehensive market analysis for the ${sector} sector in ${region}. Include current market dynamics, growth opportunities, key challenges, and strategic recommendations for market entry or expansion.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return response.text || "Unable to generate market analysis";
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw new Error(`Failed to generate market analysis: ${error}`);
  }
}

export async function generateComplianceChecklist(
  industry: string,
  regulations: string[]
): Promise<string[]> {
  try {
    const systemPrompt = `You are a compliance expert creating actionable checklists for ${industry} businesses. Focus on practical steps, documentation requirements, and implementation timelines.`;

    const userPrompt = `Create a comprehensive compliance checklist for ${industry} covering these regulations: ${regulations.join(', ')}. Provide specific, actionable items that can be implemented and tracked.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const content = response.text || "";
    // Parse the response into a checklist array
    return content.split('\n').filter(line => 
      line.trim() && (line.includes('•') || line.includes('-') || line.includes('1.'))
    ).map(line => line.trim());
  } catch (error) {
    console.error("Error generating compliance checklist:", error);
    throw new Error(`Failed to generate compliance checklist: ${error}`);
  }
}
