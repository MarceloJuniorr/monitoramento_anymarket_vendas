import express from 'express';
 import { verificacaoTabelas } from './controllers/queryController.js';
import routes from './routes.js';
import config from './config.js';

const app = express();
const PORT = config.port;

import { fileURLToPath } from 'url'; // Importe a função fileURLToPath
import { dirname, join } from 'path';

// Obtenha o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    verificacaoTabelas();
});
