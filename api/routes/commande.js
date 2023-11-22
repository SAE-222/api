const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_commande,status,date_commande,adr_livraison,adr_facturation,code_postal,code_postal_facturation,id_client,id_promotion,id_panier FROM Commande');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des commande :', err);
        res.status(500).json({ error: err });
    }
});


router.post('/', async (req, res, next) => {
    try {
        const {status,date_commande,adr_livraison,adr_facturation,code_postal,code_postal_facturation,id_client,id_promotion,id_panier } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Commande (status,date_commande,adr_livraison,adr_facturation,code_postal,code_postal_facturation,id_client,id_promotion,id_panier) VALUES (?, ?, ?,?,?,?,?,?,?)',
            [status,date_commande,adr_livraison,adr_facturation,code_postal,code_postal_facturation,id_client,id_promotion,id_panier]
        );

        res.status(200).json({ message: 'Produit ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;