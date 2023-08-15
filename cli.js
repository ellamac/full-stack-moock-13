require('./index.js');
const https = require('http');

https
  .get(`http://localhost:3001/api/blogs`, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      JSON.parse(data).map((d) =>
        console.log(`${d.author}: '${d.title}', ${d.likes} likes`)
      );
    });
  })
  .on('error', (err) => {
    console.log('Error: ' + err.message);
  });
