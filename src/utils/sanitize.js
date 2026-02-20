/**
 * Input sanitization utility using DOMPurify
 * Prevents XSS attacks in user-generated content
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize user input text (strips all HTML)
 */
export const sanitizeText = (input) => {
    if (!input || typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
};

/**
 * Sanitize HTML content (allows safe tags for blog/markdown)
 */
export const sanitizeHTML = (html) => {
    if (!html || typeof html !== 'string') return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr',
            'ul', 'ol', 'li',
            'strong', 'em', 'b', 'i', 'u',
            'a', 'blockquote', 'code', 'pre',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'img', 'span', 'div', 'section', 'article'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
    });
};

/**
 * Sanitize message content (strips HTML, limits length)
 */
export const sanitizeMessage = (content, maxLength = 2000) => {
    const clean = sanitizeText(content);
    return clean.substring(0, maxLength);
};

/**
 * Sanitize post content (strips HTML, limits length)
 */
export const sanitizePost = (content, maxLength = 5000) => {
    const clean = sanitizeText(content);
    return clean.substring(0, maxLength);
};
