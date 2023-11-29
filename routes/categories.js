const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');
const cors = require('cors');
router.use(cors({methods: ['GET','POST']}));

router.get('/:param', async (req, res, next) => {
    try {
        const param = req.params.param;
        const conn = await connectToDatabase();
        let categories = [];

        if (!isNaN(param)) { // Vérifie si le paramètre est un nombre (ID)
            categories = await getCategoriesWithSubs(conn, param);
        } else { // Si ce n'est pas un nombre, considère que c'est un nom de catégorie
            const parentCategory = await conn.query(
                'SELECT id_categories FROM Categories WHERE nom = ?',
                [param]
            );

            if (parentCategory.length === 0) {
                return res.status(404).json({ error: "Catégorie parente non trouvée" });
            }

            const parentId = parentCategory[0].id_categories;
            categories = await getCategoriesWithSubs(conn, parentId);
        }

        res.status(200).json(categories);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des catégories :', err);
        res.status(500).json({ error: err });
    }
});

async function getCategoriesWithSubs(conn, categoryId) {
    const categories = await conn.query(
        'SELECT id_categories AS id, nom AS name, label ' +
        'FROM Categories ' +
        'WHERE id_parent = ?',
        [categoryId]
    );

    if (categories.length > 0) {
        const subs = await Promise.all(categories.map(async (category) => {
            const subCategories = await getCategoriesWithSubs(conn, category.id);
            category.subs = subCategories;
            return category;
        }));
        return subs;
    }

    return categories;
}


router.post('/', async (req, res, next) => {
    try {
        const { nom,id_parent,label } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Marque (nom,id_parent,label) VALUES (?, ?, ?)',
            [nom,id_parent,label]
        );

        res.status(200).json({ message: 'Marque ajoutée avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Catégorie ajouté avec succès',});
});


module.exports = router;
