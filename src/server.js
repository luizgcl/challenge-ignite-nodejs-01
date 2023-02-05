import http from 'node:http';
import { file } from './http/middleware/file.js';
import { json } from './http/middleware/json.js';
import { routes } from './http/routes/routes.js';
import { extractQueryParams } from './http/utils/query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (req.url.includes('import') && req.method.toLowerCase() === 'post') {
    await file(req, res);
  } else
    await json(req, res);

  const route = routes.find(route => route.method === method && route.path.test(url));

  if (route) {
    const { groups } = req.url.match(route.path);
    const { query, ...params } = groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404, { 'Content-Type': 'application/json'}).end();
});

server.listen(3333);