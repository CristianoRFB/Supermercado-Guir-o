#!/usr/bin/env bash
set -euo pipefail

TARGET_REF="${1:-origin/main}"
NEW_BRANCH="${2:-guirao-site-clean}"
CURRENT_BRANCH="$(git branch --show-current)"
FILES=(index.html style.css script.js README.md .nojekyll .github/workflows/static-checks.yml scripts/resolve-merge-keeping-site.sh)

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Este script precisa ser executado dentro de um repositório Git."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Seu working tree não está limpo. Faça commit ou stash antes de continuar."
  exit 1
fi

if ! git rev-parse --verify "$TARGET_REF" >/dev/null 2>&1; then
  echo "Referência '$TARGET_REF' não encontrada."
  echo "Dica: rode 'git fetch origin main' antes de executar este script."
  exit 1
fi

if [ "$CURRENT_BRANCH" = "$NEW_BRANCH" ]; then
  echo "O novo branch precisa ter um nome diferente do branch atual."
  exit 1
fi

echo "Criando branch '$NEW_BRANCH' a partir de '$TARGET_REF'..."
git switch -c "$NEW_BRANCH" "$TARGET_REF"

echo "Reaplicando os arquivos do site vindos de '$CURRENT_BRANCH'..."
git checkout "$CURRENT_BRANCH" -- "${FILES[@]}"

git add "${FILES[@]}"

git commit -m "Reapply Guirão site on top of ${TARGET_REF}"

echo
echo "Branch limpo criado com sucesso: $NEW_BRANCH"
echo "Próximo passo: git push -u origin $NEW_BRANCH"
echo "Depois, abra um novo PR a partir desse branch limpo."
