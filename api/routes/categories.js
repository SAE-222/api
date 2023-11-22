const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');


router.get('/', async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const conn = await connectToDatabase();
        const categories = await conn.query(
            'SELECT id_categories, nom, label ' +
            'FROM Categories ' +
            'WHERE id_parent = ?',
            [categoryId]
        );

        res.status(200).json(categories);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des catégories filles :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
