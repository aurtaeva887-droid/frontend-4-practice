import { database } from './database.js';
const DELAY_MS = 800;

export default function apiPlugin() {
    return {
        name: 'api-plugin',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url.startsWith('/api/')) return next();
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                const url = new URL(req.url, `http://${req.headers.host}`);
                
                if (url.pathname === '/api/booking/today') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(database.today));
                    return;
                }
                if (url.pathname === '/api/slots') {
                    const day = url.searchParams.get('day');
                    const month = url.searchParams.get('month');
                    const year = url.searchParams.get('year');
                    const slots = database.slots[`${year}-${month}-${day}`];
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ date: { day, month, year }, slots: slots || [] }));
                    return;
                }
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
            });
        }
    };
}