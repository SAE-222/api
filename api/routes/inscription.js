const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const secret_key = crypto.randomBytes(64).toString('hex');

router.post('/', async (req, res, next) => {
    try {
        const { nom,prenom,age,email,phone,password,sex } = req.body;
        const hashedPassword = bcrypt.hashSync(password,10)

        const conn = await connectToDatabase();
        await conn.query('INSERT INTO Client (nom,prenom,age,email,phone,motdepasse,sexe) VALUES (?, ?)', [nom,prenom,age,email,phone,hashedPassword,sex]);

        res.status(200).json({ message: 'Bienvenue' });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout de l"enregistrement :', err);
        res.status(500).json({ error: err });
    }
  });

  module.exports = router;