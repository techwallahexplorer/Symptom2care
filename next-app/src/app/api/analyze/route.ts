import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Using fallback logic.");
      return NextResponse.json(
        { error: "AI analysis is currently unavailable." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { symptoms, duration, intensity, age, gender, medicalHistory } = body;

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json(
        { error: "Symptoms are required for analysis." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an AI assistant helping to triage medical symptoms. Provide a risk assessment based on the following information:
Symptoms: ${symptoms.join(", ")}
Duration: ${duration || "Not specified"}
Intensity: ${intensity || "Not specified"}
Age: ${age || "Not specified"}
Gender: ${gender || "Not specified"}
Medical History: ${medicalHistory || "None"}

Please provide a JSON response with the following structure:
{
  "riskLevel": "Low" | "Moderate" | "High",
  "score": number (0-100),
  "analysis": "A brief explanation of the assessment",
  "recommendation": "Next steps (e.g., 'Rest and hydrate', 'See a doctor within 24 hours', 'Go to the emergency room immediately')",
  "possibleConditions": ["Condition 1", "Condition 2"]
}

Ensure the response is ONLY valid JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response in case there's markdown formatting
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    let parsedData;
    
    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // Try parsing the raw text if no markdown
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        console.error("Failed to parse Gemini response as JSON:", responseText);
        throw new Error("Invalid response format from AI");
      }
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to perform symptom analysis." },
      { status: 500 }
    );
  }
}
