# Vincent van Gogh — Βιογραφική Ιστοσελίδα

Ιστοσελίδα αφιερωμένη στον ζωγράφο Vincent van Gogh, φτιαγμένη ως εργασία για το μάθημα Τεχνολογίες Διαδικτύου. Περιλαμβάνει βιογραφία, gallery πινάκων, εκθέσεις και σύστημα διαχείρισης με login.

## Τεχνολογίες

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Δεδομένα:** JSON αρχεία (χωρίς database)
- **Fonts:** Google Fonts (Playfair Display, Lato)

## Δομή του project

```
texnologieswww/
├── app.js                    # Express server, routing
├── routes/
│   ├── auth.js               # Login endpoint, token authentication
│   ├── exhibitions.js        # CRUD για εκθέσεις (GET / POST / DELETE)
│   └── links.js              # CRUD για συνδέσμους (GET / POST / DELETE)
├── public/
│   ├── website_VanGogh.html  # Single-page app (SPA), όλο το UI
│   ├── script.js             # Client-side logic
│   ├── images/               # Εικόνες πινάκων
│   └── data/
│       ├── exhibition.json   # Δεδομένα εκθέσεων
│       ├── internet_links.json
│       └── Books.json
└── package.json
```

## Εκκίνηση

```bash
npm install
node app.js
```

Ανοίξτε στο browser: `http://localhost:3000`

## Λειτουργίες

### Δημόσια τμήματα
- **Βιογραφία** — Πρώιμα χρόνια, Καριέρα, Κληρονομιά
- **Πίνακες** — Gallery σε 3 κατηγορίες (Τοπία, Προσωπογραφίες, Πειραματικά)
- **Εκθέσεις** — Πίνακας με εκθέσεις ανά τον κόσμο φορτωμένος από JSON
- **Σύνδεσμοι** — Βιβλία και διαδικτυακοί πόροι από JSON

### Σύστημα Διαχείρισης (Admin)
Το admin panel χρησιμοποιεί **token-based authentication**:

1. Ο χρήστης συνδέεται με username/password μέσω `POST /auth/login`
2. Ο server επιστρέφει ένα token
3. Το token αποθηκεύεται στο `localStorage` του browser
4. Κάθε αίτημα προσθήκης/διαγραφής στέλνει το token στο `Authorization` header
5. Ο server ελέγχει το token πριν εκτελέσει οποιαδήποτε αλλαγή

Μετά το login ο admin μπορεί να:
- **Προσθέσει** νέες εκθέσεις (αποθηκεύονται στο `exhibition.json`)
- **Διαγράψει** εκθέσεις από τη λίστα
- **Προσθέσει** νέους διαδικτυακούς συνδέσμους
- **Διαγράψει** συνδέσμους

### REST API endpoints

| Method | Endpoint | Περιγραφή | Auth |
|--------|----------|-----------|------|
| POST | `/auth/login` | Σύνδεση διαχειριστή | — |
| GET | `/exhibition` | Λήψη εκθέσεων | — |
| POST | `/exhibition` | Προσθήκη έκθεσης | ✓ |
| DELETE | `/exhibition/:index` | Διαγραφή έκθεσης | ✓ |
| GET | `/links` | Λήψη συνδέσμων | — |
| POST | `/links` | Προσθήκη συνδέσμου | ✓ |
| DELETE | `/links/:index` | Διαγραφή συνδέσμου | ✓ |

## Αρχιτεκτονική

Η εφαρμογή λειτουργεί ως **Single Page Application (SPA)**. Όλο το περιεχόμενο βρίσκεται σε ένα HTML αρχείο και η πλοήγηση γίνεται με JavaScript — κάθε φορά που ο χρήστης κλικάρει σε κατηγορία, το αντίστοιχο `<section>` γίνεται ορατό ενώ τα υπόλοιπα κρύβονται (`display: none`).

Το layout χρησιμοποιεί **CSS Grid** με 4 zones: `header`, `nav`, `aside + main`, `footer`.

## Admin credentials (για development)

```
username: admin
password: admin123
```
