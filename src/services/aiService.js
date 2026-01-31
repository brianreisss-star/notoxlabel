/**
 * NoToxLabel - Unified AI Service Provider
 * Switches between Claude and OpenAI based on configuration.
 */

import * as claudeApi from './claudeApi';
import * as openaiApi from './openaiApi';

const PREFERRED_PROVIDER_KEY = 'notoxlabel_ai_provider';

export const getProvider = () => {
    return localStorage.getItem(PREFERRED_PROVIDER_KEY) || 'claude';
};

export const setProvider = (provider) => {
    if (provider === 'claude' || provider === 'openai') {
        localStorage.setItem(PREFERRED_PROVIDER_KEY, provider);
    }
};

export const isConfigured = () => {
    const provider = getProvider();
    if (provider === 'claude') return claudeApi.isApiKeyConfigured();
    if (provider === 'openai') return openaiApi.isOpenAiConfigured();
    return false;
};

export const analyzeLabel = async (imageBase64) => {
    const provider = getProvider();
    console.log(`[AIService] Analyzing with provider: ${provider}`);

    if (provider === 'openai') {
        return openaiApi.analyzeLabelOpenAI(imageBase64);
    } else {
        return claudeApi.analyzeLabel(imageBase64);
    }
};

export const generateBlogPost = async (topic, targetAudience) => {
    const provider = getProvider();
    console.log(`[AIService] Generating blog with provider: ${provider}`);

    if (provider === 'openai') {
        return openaiApi.generateBlogPostOpenAI(topic, targetAudience);
    } else {
        return claudeApi.generateBlogPost(topic, targetAudience);
    }
};

export const hashImage = claudeApi.hashImage; // Shared utility
export const getCachedAnalysis = claudeApi.getCachedAnalysis; // Shared cache
export const cacheAnalysis = claudeApi.cacheAnalysis; // Shared cache
