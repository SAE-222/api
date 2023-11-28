const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez entrer un email et/ou mot de passe.' });
  }

  if(password.length<8){
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide' });
  }

  try {
    const conn = await connectToDatabase();

    const existingUser = await conn.query('SELECT * FROM Client WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      conn.release();
      return res.status(400).json({ error: 'Email déjà enregistré.' });
    }

    const hashedPassword = bcrypt.hash(password, 10)
    const clientResult = await conn.query('INSERT INTO Client (email) VALUES (?)', [email]);
    const clientId = clientResult.insertId;
    await conn.query('INSERT INTO Connexion (id_client, password) VALUES (?, ?)', [clientId, hashedPassword]);

    conn.release();

    res.status(201).json({ message: 'L\'enregistrement c\'est bien effectué.'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;