const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const coursesRouter = require('./routes/coursesRouter');

// Static files
app.use(express.static(path.join(__dirname, 'views')));

// Json body
app.use(express.json());

// Routes
app.get('/home', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API routes
app.use('/api/courses', coursesRouter);

// 404 Page
app.use((req, res) => {
  res.status(404).redirect('/404.html');
});

// 500 Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).redirect('/500.html');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
