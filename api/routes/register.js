const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const secret_key = crypto.randomBytes(64).toString('hex');

router.post('/',async (req, res) => {
    const {nom,prenom,age,email,phone,password,sex } = req.body;
    const hashedPassword = bcrypt.hashSync(password,10)
    
    const conn = await connectToDatabase();
    await conn.query(
      'SELECT * FROM Client WHERE email = ?',
      [email],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de la requête SQL :', err);
          res.status(500).json({ error: 'Erreur serveur' });
        } else if (results.length > 0) {
          res.status(409).json({ error: 'Un email est déjà enregistré. Veuillez en choisir une autre' });
        } else {
          connection.query(
            'INSERT INTO Client (nom,prenom,age,email,phone,motdepasse,sexe) VALUES (?, ?)', [nom,prenom,age,email,phone,hashedPassword,sex],
            (err, results) => {
              if (err) {
                console.error('Erreur lors de l\'inscription :', err);
                res.status(500).json({ error: 'Erreur serveur' });
              } else {
                const token = jwt.sign({email,hashedPassword},secret_key);
                res.json({token});
              }
            }
          );
        }
      }
    );
  });

module.exports = router;