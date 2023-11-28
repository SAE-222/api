const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');
router.get('/categories/:identifier', async (req, res, next) => {
    try {
        const identifier = req.params.identifier;
        const conn = await connectToDatabase();

        let categoryId;
        if (!isNaN(identifier)) {
            // Si l'identifiant est numérique, considérons que c'est un ID
            categoryId = parseInt(identifier);
        } else {
            // Si ce n'est pas un nombre, traitons-le comme un nom de catégorie
            const categoryByName = await conn.query(
                'SELECT id_categories FROM Categories WHERE nom = ?',
                [identifier]
            );
            if (categoryByName.length === 0) {
                // Si aucune catégorie n'est trouvée avec ce nom, renvoyer une erreur 404
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }
            categoryId = categoryByName[0].id_categories;
        }

        // Fonction récursive pour récupérer toutes les catégories filles
        async function fetchChildCategories(parentId) {
            const childCategories = await conn.query(
                'SELECT id_categories FROM Categories WHERE id_parent = ?',
                [parentId]
            );
            let categories = [];
            for (const category of childCategories) {
                categories.push(category.id_categories);
                const subCategories = await fetchChildCategories(category.id_categories);
                categories = categories.concat(subCategories);
            }
            return categories;
        }

        // Récupérer toutes les catégories filles de manière récursive
        const allChildCategories = await fetchChildCategories(categoryId);

        // Ajouter aussi la catégorie parente
        allChildCategories.push(categoryId);

        // Récupérer les produits associés à toutes les catégories filles et à la catégorie parente
        const products = await conn.query(
            'SELECT id_produit, description, prix, nom, taille, disponibilite, stock, id_categories, id_promotion, id_marque ' +
            'FROM Produit ' +
            'WHERE id_categories IN (?)',
            [allChildCategories]
        );

        // Récupérer les liens des images pour chaque produit
        const productsWithImages = [];
        for (let product of products) {
            const images = await conn.query(
                'SELECT liens FROM Photo WHERE id_produit = ?',
                [product.id_produit]
            );
            const imageLinks = images.map(img => img.liens);
            productsWithImages.push({ ...product, images: imageLinks });
        }

        res.status(200).json(productsWithImages);
        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des produits :', err);
        res.status(500).json({ error: err });
    }
});


router.post('/', async (req, res, next) => {
    try {
        const {description, prix, nom, disponibilite, stock,taille, id_categories, id_promotion, id_marque } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Produit (description, prix, nom, disponibilite, stock,taille, id_categories, id_promotion, id_marque) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [description, prix, nom, disponibilite, stock,taille, id_categories, id_promotion, id_marque]
        );

        res.status(200).json({ message: 'Produit ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:IdProduit',async (req, res) => {
    const IdProduit = req.params.IdProduit;
    const query = 'DELETE FROM Produit WHERE id_produit = ?';
  
    const conn = await connectToDatabase()
    conn.query(query, [IdProduit], (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression du produit :', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Produit non trouvé' });
        } else {
          res.json({ message: 'Produit supprimé avec succès' });
        }
      }
    });
});
module.exports = router;