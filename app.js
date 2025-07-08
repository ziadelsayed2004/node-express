const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const coursesRouter = require('./routes/coursesRouter');

// ========== Middleware ==========
app.use(express.json()); // To parse JSON body
app.use(express.static(path.join(__dirname, 'public'))); // Static files (CSS, JS, images)


// ========== Routes ==========

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Redirect /home to /
app.get('/home', (req, res) => {
  res.redirect('/');
});

// API routes
app.use('/api/courses', coursesRouter);


// ========== Error Handlers ==========

// 404 Not Found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'views', '500.html'));
});


// ========== Start Server ==========
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
