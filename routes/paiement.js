const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../configs/conn');

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

        res.status(200).json({ message: 'Paiement ajouté avec succès', result });

        conn.end();
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err);
        res.status(500).json({ error: err });
    }
    res.status(200).json({ message: 'Paiement ajouté avec succès',});
});

router.delete('/:IdPaiement',async (req, res) => {
    const IdPaiement = req.params.IdPaiement;
    const query = 'DELETE FROM Paiement WHERE id_paiement = ?';
  
    const conn = await connectToDatabase()
    conn.query(query, [IdPaiement], (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression du paiement :', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Paiement non trouvé' });
        } else {
          res.json({ message: 'Paiement supprimé avec succès' });
        }
      }
    });
});

module.exports = router;