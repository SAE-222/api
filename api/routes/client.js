const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_client,nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe  FROM Client');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des marques :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe} = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Client(nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nom,prenom,age,email,tel,date_inscription,motdepasse,Sexe]
        );

        res.status(200).json({ message: 'Produit ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;