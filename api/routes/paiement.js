const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_paiement,date_paiement,status,id_commande,id_client  FROM Paiement');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des commande :', err);
        res.status(500).json({ error: err });
    }
});


router.post('/', async (req, res, next) => {
    try {
        const {date_paiement,status,id_commande,id_client} = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Paiement (date_paiement,status,id_commande,id_client) VALUES (?, ?, ?,?)',
            [date_paiement,status,id_commande,id_client]
        );

        res.status(200).json({ message: 'Produit ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;