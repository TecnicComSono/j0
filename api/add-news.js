const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { title, content, image } = req.body;

        // Nome do arquivo para a nova notícia
        const filename = title.replace(/ /g, '_') + '.html';

        // Criar conteúdo para a notícia
        const newsContent = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>${title} | j0</title>
</head>
<body>
    <h1>${title}</h1>
    <p>${content}</p>
    <img src="${image}" alt="${title}">
</body>
</html>
`;

        // Caminho para salvar a notícia
        const filePath = path.join(process.cwd(), 'public', filename);

        // Salvar o arquivo
        fs.writeFileSync(filePath, newsContent);

        // Atualizar o index.html para adicionar um link para a nova notícia
        const indexPath = path.join(process.cwd(), 'public', 'index.html');
        let indexContent = fs.readFileSync(indexPath, 'utf8');

        const newLink = `
<a href="${filename}" class="news-button">
    <h2>${title}</h2>
    <p>${content.substring(0, 100)}...</p>
</a>
`;

        const insertPosition = indexContent.lastIndexOf('</div>');
        indexContent = [
            indexContent.slice(0, insertPosition),
            newLink,
            indexContent.slice(insertPosition)
        ].join('');

        fs.writeFileSync(indexPath, indexContent);

        res.status(200).send('Notícia criada e index atualizada');
    } else {
        res.status(405).send('Método não permitido');
    }
}
