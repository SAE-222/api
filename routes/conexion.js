const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');

router.post('/', async (req, res, next) => {
  try {
      const { email, mdp } = req.body;

      const conn = await connectToDatabase();
      await conn.query('SELECT nom,prenom FROM Client WHERE email=(?) AND motdepasse=(?)', [email, mdp]);

      res.status(200).json({ message: 'Bienvenue' });

      conn.end();
  } catch (err) {
      console.error('Erreur lors de l\'ajout de l"enregistrement :', err);
      res.status(500).json({ error: err });
  }
});

module.exports = router;