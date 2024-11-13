import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const apiKey = process.env.HUGGINGFACE_API_KEY;
console.log("Hugging Face API Key:", apiKey); // Adicione este log para verificar a chave da API

const hf = new HfInference(apiKey);

export async function POST(req: NextRequest) {
  const { item } = await req.json();

  if (!item) {
    return NextResponse.json(
      { message: "Prompt e imageUrl são obrigatórios" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    console.error("Chave da API da Hugging Face não está definida");
    return NextResponse.json(
      { message: "Chave da API da Hugging Face não está definida" },
      { status: 500 }
    );
  }

  try {
    const stream = hf.chatCompletionStream({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Responda em português: Liste apenas 3 alimentos comestíveis comuns e fáceis de encontrar com a quantidade de cada um, sem descrição, sem início de resposta, com apenas o nome e número listando, para substituir o ${item} seguindo uma dieta de uma nutricionista.`,
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    let result = "";
    for await (const chunk of stream) {
      result += chunk.choices[0]?.delta?.content || "";
    }

    console.log("Resposta da API da Hugging Face:", result);

    return NextResponse.json({ options: result }, { status: 200 });
  } catch (error) {
    console.error("Erro ao acessar a API da Hugging Face:", error);
    return NextResponse.json(
      { message: "Erro ao acessar a API da Hugging Face" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Método não permitido" },
    { status: 405 }
  );
}
