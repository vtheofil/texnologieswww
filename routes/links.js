const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const linksFile = path.join(__dirname, '..', 'data', 'links.json');

// Ανάγνωση συνδέσμων
router.get('/', (req, res) => {
    fs.readFile(linksFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Σφάλμα ανάγνωσης αρχείου' });
        }
        res.json(JSON.parse(data));
    });
});

// Δημιουργία νέου συνδέσμου
router.post('/', (req, res) => {
    const newLink = req.body;

    fs.readFile(linksFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Σφάλμα ανάγνωσης αρχείου' });
        }

        const links = JSON.parse(data);
        links.push(newLink);

        fs.writeFile(linksFile, JSON.stringify(links, null, 2), err => {
            if (err) {
                return res.status(500).json({ message: 'Σφάλμα αποθήκευσης δεδομένων' });
            }
            res.status(201).json({ message: 'Ο σύνδεσμος προστέθηκε επιτυχώς!' });
        });
    });
});

module.exports = router;
