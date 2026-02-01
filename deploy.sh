#!/bin/bash

# Script de Deploy Automático para Vercel
# Uso: npm run deploy "mensagem do commit"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando deploy automático...${NC}\n"

# Verificar se há mudanças
if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança detectada.${NC}"
    exit 0
fi

# Mostrar arquivos modificados
echo -e "${BLUE}📝 Arquivos modificados:${NC}"
git status -s
echo ""

# Adicionar todos os arquivos
echo -e "${BLUE}📦 Adicionando arquivos...${NC}"
git add .

# Commit com mensagem
COMMIT_MSG="${1:-Update: $(date +'%Y-%m-%d %H:%M:%S')}"
echo -e "${BLUE}💾 Fazendo commit: ${COMMIT_MSG}${NC}"
git commit -m "$COMMIT_MSG"

# Push para GitHub
echo -e "${BLUE}⬆️  Enviando para GitHub...${NC}"
git push origin main

echo -e "\n${GREEN}✅ Deploy iniciado com sucesso!${NC}"
echo -e "${GREEN}🌐 A Vercel vai atualizar o site em ~1-2 minutos${NC}"
echo -e "${GREEN}🔗 https://notoxlabel.com.br${NC}\n"
