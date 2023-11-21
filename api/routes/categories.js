const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');


router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const categories = await conn.query('SELECT * FROM Categories WHERE id_parent IS NULL');

        res.status(200).json(categories);

        conn.end(); // Fermer la connexion après l'utilisation
    } catch (err) {
        console.error('Erreur lors de la récupération des catégories :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { nom, id_parent } = req.body;

        let idParentToInsert = null;

        if (id_parent !== null) {
            idParentToInsert = String(id_parent);
        }

        const conn = await connectToDatabase();
        await conn.query('INSERT INTO Categories (nom, id_parent) VALUES (?, ?)', [nom, idParentToInsert]);

        // Retourner une réponse sans inclure la valeur insérée dans le résultat
        res.status(200).json({ message: 'Produit ajouté avec succès' });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});





module.exports = router;