const express = require('express');
const path = require('path');
const app = express();
const coursesRouter = require('./routes/coursesRouter');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/home', (req, res) => {
  res.redirect('/');
});
app.use('/api/courses', coursesRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'views', '500.html'));
});

const { connectToMongo } = require('./config/db');
connectToMongo().then(() => {
  app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  });
});
