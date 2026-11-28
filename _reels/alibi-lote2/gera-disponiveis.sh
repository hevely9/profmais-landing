# lista as imagens baixadas para o kit decidir o substituto de cada foto que faltar
cd "$(dirname "$0")"
echo "export const DISPONIVEIS: string[] = [$(ls public/img/*.jpg 2>/dev/null | xargs -n1 basename | sed 's/\.jpg$//' | sed 's/.*/"&"/' | paste -sd,)];" > src/disponiveis.ts
cat src/disponiveis.ts
