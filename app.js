require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const coursesRouter = require('./routes/coursesRouter');
const userRouter = require('./routes/userRouter');
const { connectToMongo } = require('./config/db');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const staticPath = path.join(__dirname, 'public', req.path);
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !fs.existsSync(staticPath)) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.redirect('/');
});

app.use('/api/courses', coursesRouter);
app.use('/api/users', userRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

if (process.env.NODE_ENV !== 'production') {
  connectToMongo().then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });
} else {
  connectToMongo();
}

module.exports = app;
