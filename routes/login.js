const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');
router.post('/',async (req, res,next) => {
  const { email, mdp } = req.body;

  const conn = await connectToDatabase();
  await conn.query(
    'SELECT * FROM Client WHERE email=(?) AND motdepasse=(?)',[email, mdp],(err, results) => {
      if (err) {
        console.error('Erreur lors de la requête SQL :', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else if (results.length > 0) {
        const token = jwt.sign({ email: results[0].email}, secretKey);
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
    }
  );
});

module.exports = router;