const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

require('./models/User');
require('./models/Blog');
require('./services/passport');

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
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

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