const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');
const bcrypt = require('bcrypt');
const cors = require('cors');
router.use(cors({methods: ['POST']}));

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez entrer un email et/ou mot de passe.' });
  }

  if(password.length < 8){
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
      await conn.release();
      return res.status(400).json({ error: 'Email déjà enregistré.' });
    }

    const insertClientResult = await conn.query('INSERT INTO Client (email) VALUES (?)', [email]);
    if (insertClientResult.affectedRows !== 1) {
        await conn.release();
        return res.status(500).json({ error: 'Erreur serveur' });
    }

    const clientResult = await conn.query('SELECT * FROM Client WHERE email = ?', [email]);
    if (clientResult.length !== 1) {
        await conn.release();
        return res.status(500).json({ error: 'Erreur serveur' });
    }

    const firstResponse = clientResult[0];

    const clientId = firstResponse.id_client;
    const hashedPassword = await bcrypt.hash(password, 10)
    await conn.query('INSERT INTO Connexion (id_client, password) VALUES (?, ?)', [clientId, hashedPassword]);

    await conn.release();

    const response = {
        id_client: clientId,
        email: firstResponse.email,
        password: hashedPassword
    }

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;