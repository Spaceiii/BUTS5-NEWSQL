const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./models/User');
require('./models/Blog');

mongoose.connect(keys.mongoURI)

const app = express();
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  optionsSuccessStatus: 204, // Pour les navigateurs plus anciens
  credentials: true, // Autoriser les cookies et les informations d'identification
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ extended: true }));

// TODO SWAGGER DOC

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);


app.get('/', (req, res) => {
  res.send('Salut!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Le serveur ecoute sur le port: `, PORT);
});