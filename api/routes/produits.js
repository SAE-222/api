const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../conn');

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT id_produit, description, prix,nom,taille,disponibilite,stock,id_categories,id_promotion,id_marque FROM Produit');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des groupes :', err);
        res.status(500).json({ error: err });
    }
});


router.post('/', async (req, res, next) => {
    try {
        const {description, prix, nom, disponibilite, stock, id_categories, id_promotion, id_marque } = req.body;

        const conn = await connectToDatabase();
        const result = await conn.query(
            'INSERT INTO Produit (description, prix, nom,taille, disponibilite, stock, id_categories, id_promotion, id_marque) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [description, prix, nom, disponibilite, stock, id_categories, id_promotion, id_marque]
        );

        res.status(200).json({ message: 'Produit ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:IdProduit', (req, res) => {
    const IdProduit = req.params.IdProduit;
    const query = 'DELETE FROM Produit WHERE id_produit = ?';
  
    const conn = connectToDatabase()
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