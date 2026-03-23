#!/usr/bin/env bash
set -euo pipefail

FILES=(index.html style.css script.js README.md .nojekyll)

echo "Preservando a versão atual do site para os arquivos principais..."

for file in "${FILES[@]}"; do
  if git ls-files --error-unmatch "$file" >/dev/null 2>&1 || [ -f "$file" ]; then
    git checkout --ours -- "$file" 2>/dev/null || true
    git add "$file"
    echo "- resolvido: $file"
  fi
done

echo
printf '%s\n' "Arquivos principais preparados. Revise com 'git status' e conclua com um commit de merge."
