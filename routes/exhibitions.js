const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const exhibitionsFile = path.join(__dirname, '..', 'data', 'exhibitions.json');

// Διαχείριση εκθέσεων: Ανάγνωση εκθέσεων
router.get('/', (req, res) => {
    fs.readFile(exhibitionsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Σφάλμα ανάγνωσης αρχείου' });
        }
        res.json(JSON.parse(data));
    });
});

// Δημιουργία νέας έκθεσης
router.post('/', (req, res) => {
    const newExhibition = req.body;

    fs.readFile(exhibitionsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Σφάλμα ανάγνωσης αρχείου' });
        }

        const exhibitions = JSON.parse(data);
        exhibitions.push(newExhibition);

        fs.writeFile(exhibitionsFile, JSON.stringify(exhibitions, null, 2), err => {
            if (err) {
                return res.status(500).json({ message: 'Σφάλμα αποθήκευσης δεδομένων' });
            }
            res.status(201).json({ message: 'Η έκθεση προστέθηκε επιτυχώς!' });
        });
    });
});

module.exports = router;