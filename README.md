# Supermercado Guirão

Site institucional e promocional em HTML, CSS e JavaScript puro para o **Supermercado Guirão**, com foco em mobile, conversão por WhatsApp e publicação simples no **GitHub Pages**.

## Estrutura

- `index.html` — página principal
- `style.css` — estilos, responsividade, animações e temas
- `script.js` — interações do front-end
- `.nojekyll` — garante publicação estática direta no GitHub Pages
- `scripts/resolve-merge-keeping-site.sh` — resolve merge com `main` mantendo esta versão do site
- `.github/workflows/static-checks.yml` — valida o HTML e o JavaScript em push/pull request

## Publicação no GitHub Pages

1. Envie o repositório para o GitHub.
2. Vá em **Settings > Pages**.
3. Em **Build and deployment**, escolha:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (ou o branch desejado)
   - **Folder**: `/ (root)`
4. Salve e aguarde a publicação.

## Como resolver o conflito do PR localmente

Se o GitHub indicar conflito entre seu branch e `main`, rode localmente:

```bash
git checkout seu-branch
git fetch origin main
bash scripts/resolve-merge-keeping-site.sh origin/main
git push
```

O script tenta fazer o merge automaticamente. Se houver conflito nos arquivos principais do site, ele mantém a versão atual de:

- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `.nojekyll`

Se ainda restarem conflitos em outros arquivos, o script lista quais são para você resolver manualmente.

## Se o PR continuar conflitando

Se mesmo após o merge helper o PR continuar com conflito, use este fluxo para criar **um branch novo, limpo, baseado em `main`**, reaplicando apenas os arquivos do site:

```bash
git checkout seu-branch
git fetch origin main
bash scripts/rebuild-branch-from-main.sh origin/main guirao-site-clean
git push -u origin guirao-site-clean
```

Depois, abra um novo PR usando o branch `guirao-site-clean`. Esse caminho costuma resolver conflitos quando o problema está no histórico do branch, e não no conteúdo final dos arquivos.

## Validação automática no PR

O workflow `.github/workflows/static-checks.yml` roda automaticamente no GitHub para:

- verificar a sintaxe do `script.js` com `node --check`
- validar o parse básico do `index.html` com Python

## Observação

O ambiente local desta tarefa não contém `remote` configurado nem uma cópia local do branch `main`, então o conflito do GitHub não pode ser reproduzido integralmente aqui. Mesmo assim, o script e o workflow foram preparados para o cenário real do PR.
