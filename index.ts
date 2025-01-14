const express = require('express');

const app = express();

const {PORT} = process.env


// Create a route that responds with 'Hello World!' on the root path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
