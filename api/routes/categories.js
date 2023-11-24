const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');


router.get('/:param', async (req, res, next) => {
    try {
        const param = req.params.param;
        const conn = await connectToDatabase();
        let categories = [];

        if (!isNaN(param)) { // Vérifie si le paramètre est un nombre (ID)
            const parentCategory = await conn.query(
                'SELECT id_parent FROM Categories WHERE id_categories = ?',
                [param]
            );

            if (parentCategory.length === 0) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            }

            const parentId = parentCategory[0].id_parent;

            categories = await conn.query(
                'SELECT id_categories AS id, nom AS name, label ' +
                'FROM Categories ' +
                'WHERE id_parent = ?',
                [parentId]
            );

            res.status(200).json({ parentId, subCategories: categories });
        } else { // Si ce n'est pas un nombre, considère que c'est un nom de catégorie
            const parentCategory = await conn.query(
                'SELECT id_categories, id_parent FROM Categories WHERE nom = ?',
                [param]
            );

            if (parentCategory.length === 0) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            }

            const parentId = parentCategory[0].id_parent;

            categories = await conn.query(
                'SELECT id_categories AS id, nom AS name, label ' +
                'FROM Categories ' +
                'WHERE id_parent = ?',
                [parentId]
            );

            res.status(200).json({ parentId, subCategories: categories });
        }

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des catégories :', err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;
