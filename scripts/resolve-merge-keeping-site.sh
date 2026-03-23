#!/usr/bin/env bash
set -euo pipefail

TARGET_REF="${1:-origin/main}"
FILES=(index.html style.css script.js README.md .nojekyll)

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Este script precisa ser executado dentro de um repositório Git."
  exit 1
fi

if ! git rev-parse --verify "$TARGET_REF" >/dev/null 2>&1; then
  echo "Referência '$TARGET_REF' não encontrada."
  echo "Dica: rode 'git fetch origin main' antes de executar este script."
  exit 1
fi

echo "Tentando fazer merge de '$TARGET_REF' no branch atual..."

if git merge --no-edit "$TARGET_REF"; then
  echo "Merge concluído sem conflitos."
  exit 0
fi

echo
printf '%s\n' "Foram encontrados conflitos. Mantendo a versão atual deste site para os arquivos principais..."

for file in "${FILES[@]}"; do
  if [ -e "$file" ] || git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
    git checkout --ours -- "$file" 2>/dev/null || true
    git add "$file"
    echo "- resolvido: $file"
  fi
done

if git diff --name-only --diff-filter=U | grep -q .; then
  echo
  echo "Ainda existem conflitos em outros arquivos. Resolva-os manualmente e depois faça o commit do merge."
  git diff --name-only --diff-filter=U
  exit 1
fi

git commit -m "Resolve merge with ${TARGET_REF} keeping Guirão site version"
echo
printf '%s\n' "Merge resolvido e commitado com sucesso. Agora você pode dar push no branch."
