// importing http package and URL constructor
const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser.js') // importing bodyParser function

const routes = require('./routes.js'); // importing the routes

const server = http.createServer((request, response) => { //creating the server

  const parsedUrl = new URL(`http://localhost:3000${request.url}`); // creating the parsed URL to extract information

  console.log(`method: ${request.method} | endpoint: ${request.url}`);

  let {pathname} = parsedUrl;
  let id = null;
  
  const splitEndpoint = pathname.split('/').filter(Boolean); // removing empty values from the array

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  // verifying if the route exists
  const route = routes.find((obj) => (obj.endpoint === pathname && obj.method === request.method)); 

  // function to avoid repeating the writeHead/end methods
  response.send = (statusCode, body) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(body));
  }

  if (!route) {
    
    response.send(404, `cannot ${request.method} ${pathname}`);

  } else {

    request.query = Object.fromEntries(parsedUrl.searchParams); // transforming searchParams of the parsedUrl into an JS object
    request.params = { id }; // injecting the ID of the user into the request.params

    const methods = ['POST', 'PUT']

    // checking if the url is POST or PUT methods
    if (methods.includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else { 
      route.handler(request, response);
    }
  };
});

// executing the server to run on port 3000 
server.listen(3000, () => console.log('🚀 Running on http://localhost:3000'));
