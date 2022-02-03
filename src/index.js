const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser.js')

const routes = require('./routes.js');

const server = http.createServer((request, response) => {

  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  console.log(`method: ${request.method} | endpoint: ${request.url}`);

  let {pathname} = parsedUrl;
  let id = null;
  
  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((obj) => (obj.endpoint === pathname && obj.method === request.method));

  response.send = (statusCode, body) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(body));
  }

  if (!route) {

    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(`cannot ${request.method} ${pathname}`);

  } else {

    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    const methods = ['POST', 'PUT']

    if (methods.includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else { 
      route.handler(request, response);
    }
  };
});

server.listen(3000, () => console.log('🥳 Running on http://localhost:3000'));
