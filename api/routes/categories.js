const express = require('express');
const router = express.Router();
const conn = require('../../conn');

// SELECT * FROM Catégories WHERE id_parent IN(SELECT id FROM Catégories WHERE id_parent IS NULL)

router.get('/', (req, res, next) => {
    conn.then((c) => {
        c.query('SELECT * FROM Catégories WHERE id_parent IN(SELECT id FROM Catégories WHERE id_parent IS NULL)').then((rows) => {

            for (categorie of rows) {
                c.query('SELECT * FROM Catégories WHERE id_parent = ?', [categorie.id]).then((rows) => {
                    categorie.subs = rows;
                }).catch((err) => {
                    res.status(500).json({error: err});
                });
            }

            res.status(200).json(rows);
        }).catch((err) => {
            res.status(500).json({error: err});
        });
    }).catch((err) => {
        res.status(500).json({error: err});
    });
});

router.post('/?name=:name&label=:label&parent=:parent', (req, res, next) => {
    conn.then((c) => {
        c.query('INSERT INTO Catégories (name, label, id_parent) VALUES (?, ?, ?)', [req.params.name, req.params.label, req.params.parent]).then((rows) => {
            res.status(200).json(rows);
        }).catch((err) => {
            res.status(500).json({error: err});
        });
    }).catch((err) => {
        res.status(500).json({error: err});
    });
});

module.exports = router;