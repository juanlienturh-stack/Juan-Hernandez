import { GoogleGenAI, Type } from "@google/genai";
import { BodyScan, FaceScan, FoodEntry, Routine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeBodyScan(images: string[]): Promise<Partial<BodyScan>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analiza estas imágenes de un escaneo corporal 3D (frontal, lateral, trasero). Estima el porcentaje de grasa, masa muscular, agua, perímetros (pecho, cintura, cadera, muslo, brazo), WHR, análisis postural y mapa de calor muscular. Devuelve un JSON estructurado." },
          ...images.map(img => ({ inlineData: { data: img.split(',')[1], mimeType: "image/jpeg" } }))
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fatPercentage: { type: Type.NUMBER },
          musclePercentage: { type: Type.NUMBER },
          waterPercentage: { type: Type.NUMBER },
          measurements: {
            type: Type.OBJECT,
            properties: {
              chest: { type: Type.NUMBER },
              waist: { type: Type.NUMBER },
              hip: { type: Type.NUMBER },
              thigh: { type: Type.NUMBER },
              arm: { type: Type.NUMBER }
            }
          },
          whr: { type: Type.NUMBER },
          posturalAnalysis: { type: Type.STRING },
          muscleHeatMap: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function analyzeFaceScan(image: string): Promise<Partial<FaceScan>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analiza esta imagen de un rostro. Evalúa simetría, edad percibida, salud de la piel (imperfecciones, tono, tonicidad), genera una rutina de skincare (mañana/noche), identifica la forma del rostro y recomienda 5 cortes de pelo modernos. Devuelve un JSON estructurado." },
          { inlineData: { data: image.split(',')[1], mimeType: "image/jpeg" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symmetryScore: { type: Type.NUMBER },
          perceivedAge: { type: Type.NUMBER },
          skinHealth: {
            type: Type.OBJECT,
            properties: {
              imperfections: { type: Type.ARRAY, items: { type: Type.STRING } },
              tone: { type: Type.STRING },
              tonicity: { type: Type.STRING }
            }
          },
          skincareRoutine: {
            type: Type.OBJECT,
            properties: {
              morning: { type: Type.ARRAY, items: { type: Type.STRING } },
              night: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          faceShape: { type: Type.STRING },
          recommendedHaircuts: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function analyzeFood(image: string): Promise<Partial<FoodEntry>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Identifica los alimentos en esta foto de un plato. Estima las porciones, calorías totales y macronutrientes (proteína, carbohidratos, grasas). Devuelve un JSON estructurado." },
          { inlineData: { data: image.split(',')[1], mimeType: "image/jpeg" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateRoutine(prompt: string): Promise<Partial<Routine>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: `Genera una rutina de ejercicio basada en este pedido: "${prompt}". Devuelve un JSON estructurado con nombre de la rutina y lista de ejercicios (exerciseId, sets, reps, rest).` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                exerciseId: { type: Type.STRING },
                sets: { type: Type.NUMBER },
                reps: { type: Type.NUMBER },
                rest: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
