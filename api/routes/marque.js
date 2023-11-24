const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_marque,nom,logo_marque,pays,adresse,tel  FROM Marque');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des marques :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { nom,logo_marque,pays,adresse,tel } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Marque (nom,logo_marque,pays,adresse,tel) VALUES (?, ?, ?,?,?)',
            [nom,logo_marque,pays,adresse,tel]
        );

        res.status(200).json({ message: 'Marque ajoutée avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;