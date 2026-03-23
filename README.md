# Supermercado Guirão

Site institucional e promocional em HTML, CSS e JavaScript puro para o **Supermercado Guirão**, com foco em mobile, conversão por WhatsApp e publicação simples no **GitHub Pages**.

## Estrutura

- `index.html` — página principal
- `style.css` — estilos, responsividade, animações e temas
- `script.js` — interações do front-end
- `.nojekyll` — garante publicação estática direta no GitHub Pages
- `scripts/resolve-merge-keeping-site.sh` — utilitário para resolver merge local preservando esta versão do site

## Publicação no GitHub Pages

1. Envie o repositório para o GitHub.
2. Vá em **Settings > Pages**.
3. Em **Build and deployment**, escolha:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (ou o branch desejado)
   - **Folder**: `/ (root)`
4. Salve e aguarde a publicação.

## Como resolver o conflito localmente mantendo esta versão do site

Se o GitHub informar conflito entre `main` e este branch, faça o merge localmente e preserve os arquivos deste projeto:

```bash
git checkout seu-branch
git fetch origin
git merge origin/main
bash scripts/resolve-merge-keeping-site.sh
```

Depois disso:

```bash
git commit -m "Resolve merge with main keeping Guirão site version"
git push
```

## Observação

Este script foi criado porque o ambiente local desta tarefa não contém `remote` configurado nem uma cópia do branch `main`, então o conflito do GitHub não pode ser reproduzido integralmente aqui.
