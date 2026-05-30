const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const linksFile = path.join(__dirname, '..', 'public', 'data', 'internet_links.json');

function readData() {
  const raw = fs.readFileSync(linksFile, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(linksFile, JSON.stringify(data, null, 2), 'utf8');
}

// GET - επιστρέφει όλους τους συνδέσμους
router.get('/', (req, res) => {
  try {
    res.json(readData());
  } catch (e) {
    res.status(500).json({ message: 'Σφάλμα ανάγνωσης' });
  }
});

// POST - προσθήκη νέου συνδέσμου (απαιτεί token)
router.post('/', (req, res) => {
  const token = req.headers['authorization'];
  if (token !== 'abc123') return res.status(401).json({ message: 'Μη εξουσιοδοτημένος' });

  try {
    const data = readData();
    data.links.push(req.body);
    writeData(data);
    res.status(201).json({ message: 'Ο σύνδεσμος προστέθηκε!' });
  } catch (e) {
    res.status(500).json({ message: 'Σφάλμα αποθήκευσης' });
  }
});

// DELETE - διαγραφή συνδέσμου με index
router.delete('/:index', (req, res) => {
  const token = req.headers['authorization'];
  if (token !== 'abc123') return res.status(401).json({ message: 'Μη εξουσιοδοτημένος' });

  try {
    const idx = parseInt(req.params.index, 10);
    const data = readData();
    if (idx < 0 || idx >= data.links.length) {
      return res.status(404).json({ message: 'Δεν βρέθηκε ο σύνδεσμος' });
    }
    data.links.splice(idx, 1);
    writeData(data);
    res.json({ message: 'Ο σύνδεσμος διαγράφηκε!' });
  } catch (e) {
    res.status(500).json({ message: 'Σφάλμα διαγραφής' });
  }
});

module.exports = router;
