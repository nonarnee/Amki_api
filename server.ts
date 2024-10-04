import next from 'next';
import fs from 'node:fs';
import { createServer } from 'node:https';
import type { ServerOptions } from 'node:https';

const hostname = 'localhost';
const port = 3000;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions: ServerOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
        try {
            await handle(req, res);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    })
        .once('error', (err) => {
            throw err;
        })
        .listen(port, () => {
            console.log(`> Ready on https://${hostname}:${port}`);
    });
});
