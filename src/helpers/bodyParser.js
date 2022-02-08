// function to handle data sent by POST/PUT methods
function bodyParser(request, callback) {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk; // chunk is a fragment of data
  });

  request.on('end', () => {
    body = JSON.parse(body); // parsing the object into a JS object (to inject the modify/creation into the users mock)
    request.body = body;
    callback() // executing the callback function
  });
};

module.exports = bodyParser;