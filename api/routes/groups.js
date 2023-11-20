const express = require('express');
const router = express.Router();
const conn = require('../../conn');

router.get('/', (req, res, next) => {
    conn.then((c) => {
        c.query('SELECT * FROM Catégories WHERE id_parent IS NULL').then((rows) => {
            res.status(200).json(rows);
        }).catch((err) => {
            res.status(500).json({error: err});
        });
    }).catch((err) => {
        res.status(500).json({error: err});
    });
});

router.post('/?name=:name&label=:label', (req, res, next) => {
    conn.then((c) => {
        c.query('INSERT INTO Catégories (name, label) VALUES (?, ?)', [req.params.name, req.params.label]).then((rows) => {
            res.status(200).json(rows);
        }).catch((err) => {
            res.status(500).json({error: err});
        });
    }).catch((err) => {
        res.status(500).json({error: err});
    });
});

module.exports = router;