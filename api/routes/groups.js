const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_categories AS id, nom AS name, label FROM Categories');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des groupes :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { nom,id_parent,label } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Categories (nom,id_parent,label) VALUES (?, ?, ?)',
            [nom,id_parent,label]
        );

        res.status(200).json({ message: 'Produit ajouté avec succès',
        });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});
module.exports = router;