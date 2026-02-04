export const config = {
    runtime: 'edge', // Use Edge Runtime for speed
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { provider, mode, data } = await req.json();

        // 1. Validate Provider & Keys
        const apiKey = provider === 'openai'
            ? process.env.OPENAI_API_KEY
            : process.env.CLAUDE_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: `Server API Key missing for ${provider}` }), { status: 500 });
        }

        // 2. Handle Logic based on Mode
        if (mode === 'scan') {
            return await handleScan(provider, apiKey, data);
        } else if (mode === 'blog') {
            return await handleBlog(provider, apiKey, data);
        } else {
            return new Response(JSON.stringify({ error: 'Invalid mode' }), { status: 400 });
        }

    } catch (error) {
        console.error('API Handler Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// ==========================================
// SCAN HANDLER (Claude & OpenAI)
// ==========================================
async function handleScan(provider, apiKey, { images }) {
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
      "overall_score": 1-10,
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

    if (provider === 'openai') {
        const content = [
            { type: "text", text: "Analise a(s) lista(s) de ingredientes desta(s) imagem(ns) de rótulo. Retorne APENAS um JSON válido." }
        ];
        images.forEach(img => content.push({ type: "image_url", image_url: { url: img, detail: "high" } }));

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content }],
                max_tokens: 4000,
                response_format: { type: "json_object" }
            })
        });
        const json = await response.json();
        return new Response(JSON.stringify(json));
    }

    else {
        // Claude
        const imageBlocks = images.map(img => {
            const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
            let mediaType = 'image/jpeg';
            if (img.includes('image/png')) mediaType = 'image/png';
            if (img.includes('image/webp')) mediaType = 'image/webp';
            return { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } };
        });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 4096,
                messages: [{ role: 'user', content: [...imageBlocks, { type: 'text', text: "Analise e retorne apenas o JSON." }] }],
                system: systemPrompt
            })
        });
        const json = await response.json();
        return new Response(JSON.stringify(json));
    }
}

// ==========================================
// BLOG HANDLER
// ==========================================
async function handleBlog(provider, apiKey, { topic, targetAudience }) {
    const systemPrompt = `Você é um editor sênior de um portal de saúde. Escreva um artigo sobre: "${topic}". Público: ${targetAudience}. Retorne JSON: { "title", "summary", "content_markdown", "tags", "estimated_read_time", "image_prompt" }`;

    if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: topic }],
                response_format: { type: "json_object" }
            })
        });
        const json = await response.json();
        return new Response(JSON.stringify(json));
    } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 4096,
                messages: [{ role: 'user', content: topic }],
                system: systemPrompt
            })
        });
        const json = await response.json();
        return new Response(JSON.stringify(json));
    }
}
