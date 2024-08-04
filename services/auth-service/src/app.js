const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Auth service listening on port ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('Error starting server', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
