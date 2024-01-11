const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');
const cors = require('cors');
router.use(cors({methods: ['GET','POST','DELETE','PUT']}));

router.get('/', async (req, res, next) => {
    try {
        const conn = await connectToDatabase();
        const groups = await conn.query('SELECT * FROM Panier');

        res.status(200).json(groups);

        conn.end();
    } catch (err) {
        console.error('Erreur lors de la récupération des paniers :', err);
        res.status(500).json({ error: err });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {quantité,id_client,id_produit} = req.body;

        const conn = await connectToDatabase();
        const result_IdProduit = await conn.query('SELECT prix FROM Produit WHERE id_produit = ?', [id_produit]);
        const prix_produit = result_IdProduit[0].prix;
        const total = prix_produit * quantité 
        const result = await conn.query(
            'INSERT INTO Panier (quantité,total,id_client) VALUES (?,?,?) RETURNING id_panier',
            [quantité,total,id_client]
        );
        await conn.query('INSERT INTO Panier_produit (id_produit,id_panier) VALUES (?, ?)', [id_produit, result[0].id_panier]);

        res.status(200).json({ message: 'Panier ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du panier :', err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:IdPanier',async (req, res) => {
  const IdPanier = req.params.IdPanier;
  try {
    const conn = await connectToDatabase();

    await conn.query('DELETE FROM Panier_produit WHERE id_panier = ?', [IdPanier]);

    await conn.query('DELETE FROM Panier WHERE id_panier = ?', [IdPanier]);

    conn.release();

    res.status(200).json({ message: 'Panier supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:IdPanier',async(req,res) => {
    const IdPanier = req.params.IdPanier;
    const {IdProduit,quantité} = req.body;
    try{
        const conn = await connectToDatabase();
        await conn.query('UPDATE Panier_produit SET id_produit = ? WHERE id_panier = ? ' , [IdProduit,IdPanier]);
        const result = await conn.query('SELECT prix FROM Produit WHERE id_produit = ?', [IdProduit]);
        const prix_produit = result[0].prix;
        const total = prix_produit * quantité 
        await conn.query('UPDATE Panier SET quantité = ?, total = ? WHERE id_panier = ?', [quantité, total, IdPanier]);
        conn.release();

        res.status(200).json({ message: 'Panier mis à jour avec succès' });
    } catch (error){
        console.error(error);
        res.status(500).json({error : 'Erreur serveur' });
    }
});

module.exports = router;