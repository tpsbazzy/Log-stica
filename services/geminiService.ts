
import { GoogleGenAI, Type } from "@google/genai";
import { Order, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOrderProblem = async (order: Order): Promise<AIAnalysis> => {
  const prompt = `Analise o seguinte pedido logístico e identifique riscos:
    Código: ${order.trackingCode}
    Transportadora: ${order.carrier}
    Status Atual: ${order.status}
    Data de Envio: ${order.shippedDate}
    Última Atualização: ${order.lastUpdate}
    Histórico: ${JSON.stringify(order.events)}

    Forneça uma análise técnica e sugira a melhor ação comercial.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, description: "low, medium, high" },
          classification: { type: Type.STRING, description: "Classificação curta do problema" },
          suggestedAction: { type: Type.STRING, description: "Ação sugerida (ex: Abrir manifestação, Reenvio)" },
          reasoning: { type: Type.STRING, description: "Explicação técnica da análise" }
        },
        required: ["riskLevel", "classification", "suggestedAction", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text) as AIAnalysis;
};

export const generateCustomerMessage = async (order: Order, tone: 'professional' | 'empathetic' = 'empathetic'): Promise<string> => {
  const prompt = `Como um gerente de sucesso do cliente de um e-commerce, escreva uma mensagem de atualização de pedido para o cliente ${order.customerName}.
    Problema: ${order.status}
    Código de Rastreio: ${order.trackingCode}
    Tom de voz: ${tone}
    Idioma: Português do Brasil.
    A mensagem deve ser curta, direta, resolver a ansiedade do cliente e informar o que estamos fazendo para resolver.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Erro ao gerar mensagem.";
};
