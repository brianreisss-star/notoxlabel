/**
 * NoToxLabel - OpenAI Vision API Service
 * Analyzes product label images using GPT-4o vision capabilities
 */

import ingredientsDB from '../data/ingredients.json';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const getApiKey = () => {
    return localStorage.getItem('notoxlabel_openai_api_key') || localStorage.getItem('rotulimpo_openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || null;
};

export const setOpenAiKey = (key) => {
    localStorage.setItem('notoxlabel_openai_api_key', key);
};

export const isOpenAiConfigured = () => {
    return !!getApiKey();
};

/**
 * Search for ingredient in local database (Shared logic could be extracted)
 */
const findIngredientInDB = (name) => {
    if (!name) return null;
    const normalized = name.toLowerCase().trim();

    return ingredientsDB.ingredients.find(ing => {
        if (ing.name.toLowerCase() === normalized) return true;
        if (ing.aliases?.some(alias => alias.toLowerCase() === normalized)) return true;
        if (ing.name.toLowerCase().includes(normalized) || normalized.includes(ing.name.toLowerCase())) return true;
        return false;
    });
};

export const analyzeLabelOpenAI = async (imageBase64) => {
    // const apiKey = getApiKey();
    // if (!apiKey) throw new Error('API_KEY_MISSING');

    const images = Array.isArray(imageBase64) ? imageBase64 : [imageBase64];

    // Format images for OpenAI
    const content = [
        {
            type: "text",
            text: "Analise a(s) lista(s) de ingredientes desta(s) imagem(ns) de rótulo. Retorne APENAS um JSON válido seguindo estritamente a estrutura solicitada no system prompt."
        }
    ];

    images.forEach(img => {
        content.push({
            type: "image_url",
            image_url: {
                url: img, // OpenAI supports base64 data URLs directly
                detail: "high"
            }
        });
    });

    const systemPrompt = `Você é um especialista em análise de rótulos de alimentos e cosméticos. Sua missão é analisar a lista de ingredientes da imagem e retornar uma avaliação detalhada em JSON.

REGRAS:
1. Extraia TODOS os ingredientes visíveis na imagem
2. Para cada ingrediente, avalie o risco à saúde (1=crítico, 10=excelente)
3. Identifique ingredientes problemáticos e explique por quê
4. Considere o contexto brasileiro de regulamentação

Retorne APENAS um JSON válido no seguinte formato:
{
  "product_name": "Nome do produto se visível, ou 'Produto Analisado'",
  "category": "alimento|cosmético|medicamento|outro",
  "ingredients_detected": ["ingrediente1", "ingrediente2"],
  "overall_score": 1-10, // número inteiro
  "risk_level": "low|medium|high",
  "ingredients": [
    {
      "name": "Nome comum",
      "technical_name": "Nome técnico/científico",
      "risk_score": 1-10,
      "concerns": ["Preocupação1", "Preocupação2"],
      "description": "O que é este ingrediente",
      "why_used": "Por que é usado no produto",
      "health_impact": "Impacto na saúde"
    }
  ],
  "personalized_alerts": ["Alerta baseado nos ingredientes"],
  "alternatives": ["Alternativa mais saudável"],
  "summary": "Resumo geral do produto em 2-3 frases"
}`;

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'openai',
                mode: 'scan',
                data: { images }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API Error');
        }

        const data = await response.json();

        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('[OpenAIAPI] Unexpected data structure:', data);
            throw new Error('O servidor de IA retornou uma resposta vazia. Verifique sua conexão ou tente outra foto.');
        }

        const contentStr = data.choices[0].message.content;

        // Parse JSON from response
        let result;
        try {
            // Greedy JSON extraction (handles extra text or markdown code blocks from AI)
            const firstOpen = contentStr.indexOf('{');
            const lastClose = contentStr.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1) {
                const jsonStr = contentStr.substring(firstOpen, lastClose + 1);
                result = JSON.parse(jsonStr);

                // Check for unreadable image error
                if (result.error === 'IMAGE_UNREADABLE') {
                    throw new Error(result.message || 'Imagem ilegível para o GPT-4o. Tente focar melhor.');
                }
            } else {
                throw new Error('Não foi possível encontrar a análise no formato esperado.');
            }
        } catch (parseError) {
            console.error('[OpenAIAPI] JSON Parse Error:', parseError, contentStr);
            if (parseError.message.includes('ilegível') || parseError.message.includes('formato esperado')) throw parseError;
            throw new Error('Erro ao processar a resposta da IA. Tente uma foto mais clara.');
        }

        // Enrich with local database
        result.ingredients = result.ingredients.map(ing => {
            const dbMatch = findIngredientInDB(ing.name) || findIngredientInDB(ing.technical_name);
            if (dbMatch) {
                return {
                    ...ing,
                    risk_score: dbMatch.risk || ing.risk_score,
                    concerns: [...new Set([...(ing.concerns || []), ...(dbMatch.concerns || [])])],
                    health_impact: dbMatch.health_impact || ing.health_impact,
                    db_verified: true
                };
            }
            return { ...ing, db_verified: false };
        });

        return result;

    } catch (error) {
        console.error('OpenAI Analysis Error:', error);
        throw error;
    }
};

export const generateBlogPostOpenAI = async (topic, targetAudience = 'general') => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API_KEY_MISSING');

    const systemPrompt = `Você é um editor sênior de um portal de saúde e nutrição. 
    Escreva um artigo profundo e acessível sobre: "${topic}".
    Público: ${targetAudience}.
    Retorne JSON: { "title", "summary", "content_markdown", "tags", "estimated_read_time", "image_prompt" }`;

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Escreva sobre: ${topic}` }
            ],
            response_format: { type: "json_object" }
        })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
};
