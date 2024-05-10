const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.post('/add-news', (req, res) => {
    const { title, content, image } = req.body;

    // Gera um nome de arquivo único para a nova notícia
    const filename = title.replace(/ /g, '_') + '.html';

    // Crie um novo arquivo HTML para a notícia
    const newsContent = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>${title} | j0</title>
        <link rel="stylesheet" href="style.css"> <!-- Ou outra folha de estilo -->
    </head>
    <body>
        <h1>${title}</h1>
        <p>${content}</p>
        <img src="${image}" alt="${title}">
    </body>
    </html>
    `;

    fs.writeFileSync(path.join(__dirname, filename), newsContent);

    // Adiciona o link ao index.html
    const indexPath = path.join(__dirname, '../index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    const newLink = `
    <a href="${filename}" class="news-button">
        <h2>${title}</h2>
        <p>${content.substring(0, 100)}...</p>
    </a>
    `;

    // Adiciona o link ao final do conteúdo existente
    const insertPosition = indexContent.lastIndexOf('</div>'); // onde adicionar
    indexContent = [
        indexContent.slice(0, insertPosition),
        newLink,
        indexContent.slice(insertPosition)
    ].join('');

    fs.writeFileSync(indexPath, indexContent);

    res.status(200).send('Notícia criada e index atualizada');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
