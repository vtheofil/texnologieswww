const express = require('express');
const router = express.Router();


// Μόνο ο διαχειριστής με το παρακάτω username και password
const users = [
    { username: 'admin', password: 'admin123', token:'abc123' }
];

// Μέθοδος για είσοδο
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Έλεγχος για τον χρήστη "admin"
    const user = users.find(u => u.username === username && u.password === password);

    if(user){
      res.json({token:user.token});
    } else {
      res.status(401).json({message: 'Λαθος όνομα ή κωδικός'})
    }

    
});



module.exports = router;
