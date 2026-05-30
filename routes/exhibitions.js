const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const exhibitionsFile = path.join(__dirname, '..', 'public', 'data', 'exhibition.json');

function readData() {
  const raw = fs.readFileSync(exhibitionsFile, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(exhibitionsFile, JSON.stringify(data, null, 2), 'utf8');
}

// GET - επιστρέφει όλες τις εκθέσεις
router.get('/', (req, res) => {
  try {
    res.json(readData());
  } catch (e) {
    res.status(500).json({ message: 'Σφάλμα ανάγνωσης' });
  }
});

// POST - προσθήκη νέας έκθεσης (απαιτεί token)
router.post('/', (req, res) => {
  const token = req.headers['authorization'];
  if (token !== 'abc123') return res.status(401).json({ message: 'Μη εξουσιοδοτημένος' });

  try {
    const data = readData();
    data.exhibition.push(req.body);
    writeData(data);
    res.status(201).json({ message: 'Η έκθεση προστέθηκε!' });
  } catch (e) {
    res.status(500).json({ message: 'Σφάλμα αποθήκευσης' });
  }
});

// DELETE - διαγραφή έκθεσης με index
router.delete('/:index', (req, res) => {
  const token = req.headers['authorization'];
  if (token !== 'abc123') return res.status(401).json({ message: 'Μη εξουσιοδοτημένος' });

  try {
    const idx = parseInt(req.params.index, 10);
    const data = readData();
    if (idx < 0 || idx >= data.exhibition.length) {
      return res.status(404).json({ message: 'Δεν βρέθηκε η έκθεση' });
    }
    data.exhibition.splice(idx, 1);
    writeData(data);
    res.json({ message: 'Η έκθεση διαγράφηκε!' });
  } catch (e) {
    res.status(500).json({ message: 'Σφάλμα διαγραφής' });
  }
});

module.exports = router;
