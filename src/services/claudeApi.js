/**
 * NoToxLabel - Claude Vision API Service
 * Analyzes product label images using Claude's vision capabilities
 */

import ingredientsDB from '../data/ingredients.json';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Get API key from environment or localStorage (for demo purposes)
const getApiKey = () => {
    // In production, use environment variable
    // For demo, allow setting via localStorage
    return localStorage.getItem('notoxlabel_claude_api_key') || localStorage.getItem('rotulimpo_claude_api_key') || import.meta.env.VITE_CLAUDE_API_KEY || null;
};

/**
 * Analyze product label images using Claude Vision
 * @param {string|string[]} imageBase64 - Base64 encoded image data or array of data
 * @returns {Promise<Object>} - Analysis result
 */
export const analyzeLabel = async (imageBase64) => {
    // const apiKey = getApiKey(); // Deprecated: Managed by Backend
    // if (!apiKey) throw new Error('API_KEY_MISSING');

    const images = Array.isArray(imageBase64) ? imageBase64 : [imageBase64];

    // Prepare image blocks for Claude
    const imageBlocks = images.map(img => {
        const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
        let mediaType = 'image/jpeg';
        if (img.includes('image/png')) mediaType = 'image/png';
        if (img.includes('image/webp')) mediaType = 'image/webp';

        return {
            type: 'image',
            source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data
            }
        };
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

    try {
        console.log(`[ClaudeAPI] Initiating analysis via Backend Proxy...`);

        // PRODUCTION: Call Vercel Serverless Function
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'claude',
                mode: 'scan',
                data: { images }
            })
        });

        // FALLBACK: If API fails (e.g. running locally without Vercel), verify if we have local key 
        // Logic for local dev fallback omitted to enforce security best practices.

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[ClaudeAPI] Error Response:', errorData);
            // Fallback to text if message is missing
            const msg = errorData.error?.message || JSON.stringify(errorData.error) || response.statusText;
            throw new Error(`API: ${msg}`);
        }

        const data = await response.json();
        const content = data.content[0]?.text || '';
        console.log('[ClaudeAPI] Raw Response received.');

        // Parse JSON from response
        let result;
        try {
            // Greedy JSON extraction (handles extra text from AI)
            const firstOpen = content.indexOf('{');
            const lastClose = content.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1) {
                const jsonStr = content.substring(firstOpen, lastClose + 1);
                result = JSON.parse(jsonStr);

                // Check for unreadable image error returned as JSON
                if (result.error === 'IMAGE_UNREADABLE') {
                    throw new Error(result.message || 'Imagem ilegível. Tente focar melhor nos ingredientes.');
                }
            } else {
                throw new Error('Não foi possível ler os ingredientes. Verifique a nitidez da foto.');
            }
        } catch (parseError) {
            console.error('[ClaudeAPI] JSON Parse Error:', parseError, content);
            if (parseError.message.includes('ilegível')) throw parseError;
            throw new Error('Não conseguimos processar esta imagem. Tente tirar outra foto mais próxima dos ingredientes.');
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
        console.error('Analysis Error:', error);
        throw error;
    }
};

/**
 * Search for ingredient in local database
 */
const findIngredientInDB = (name) => {
    if (!name) return null;
    const normalized = name.toLowerCase().trim();

    return ingredientsDB.ingredients.find(ing => {
        if (ing.name.toLowerCase() === normalized) return true;
        if (ing.aliases?.some(alias => alias.toLowerCase() === normalized)) return true;
        // Partial match
        if (ing.name.toLowerCase().includes(normalized) || normalized.includes(ing.name.toLowerCase())) return true;
        return false;
    });
};

/**
 * Check if API key is configured
 */
export const isApiKeyConfigured = () => {
    return !!getApiKey();
};

/**
 * Set API key in localStorage (for demo/testing)
 */
export const setApiKey = (key) => {
    localStorage.setItem('notoxlabel_claude_api_key', key);
};

/**
 * Get cached analysis if available
 */
export const getCachedAnalysis = (imageHash) => {
    const cache = JSON.parse(localStorage.getItem('notoxlabel_analysis_cache') || localStorage.getItem('rotulimpo_analysis_cache') || '{}');
    const cached = cache[imageHash];

    if (cached) {
        // Check if expired (7 days)
        const age = Date.now() - cached.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
            return cached.result;
        }
    }
    return null;
};

/**
 * Cache analysis result
 */
export const cacheAnalysis = (imageHash, result) => {
    const cache = JSON.parse(localStorage.getItem('rotulimpo_analysis_cache') || '{}');
    cache[imageHash] = {
        result,
        timestamp: Date.now()
    };
    localStorage.setItem('notoxlabel_analysis_cache', JSON.stringify(cache));
};

/**
 * Simple hash function for image data
 */
export const hashImage = async (base64Data) => {
    // Use first 1000 chars + last 1000 chars + length as simple hash
    const data = base64Data.slice(0, 1000) + base64Data.slice(-1000) + base64Data.length;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate a complete blog post using Claude
 * @param {string} topic - Broad topic or specific title
 * @param {string} targetAudience - 'general', 'medical', 'athletes', 'parents'
 * @returns {Promise<Object>} - The generated article
 */
export const generateBlogPost = async (topic, targetAudience = 'general') => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API_KEY_MISSING');

    const systemPrompt = `Você é um editor sênior de um portal de saúde e nutrição chamado NoToxLabel. 
    Sua missão é escrever artigos profundos, baseados em ciência, mas acessíveis.
    
    Público Alvo: ${targetAudience === 'medical' ? 'Profissionais de Saúde (tom técnico)' : 'Consumidor Final (tom educativo e empoderador)'}
    
    Estrutura do Artigo (JSON):
    {
        "title": "Título chamativo e otimizado para SEO",
        "summary": "Resumo de 2 linhas para cards",
        "content_markdown": "O corpo do artigo em Markdown. Use h2, h3, bullet points, e negrito. Inclua seção de referências científicas no final.",
        "tags": ["tag1", "tag2"],
        "estimated_read_time": "X min",
        "image_prompt": "Prompt detalhado para gerar uma imagem de capa para este artigo"
    }`;

    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307', // FASTEST & CHEAPEST
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: `Escreva um artigo completo sobre: "${topic}". Foque em mitos vs verdades e impacto na longevidade.`
                    }
                ],
                system: systemPrompt
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API Error');
        }

        const data = await response.json();
        const content = data.content[0]?.text || '';

        // Parse JSON
        const firstOpen = content.indexOf('{');
        const lastClose = content.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            return JSON.parse(content.substring(firstOpen, lastClose + 1));
        }
        throw new Error('Failed to parse AI response');

    } catch (error) {
        console.error('Blog Generation Error:', error);
        throw error;
    }
};
