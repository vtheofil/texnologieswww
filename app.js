const express = require('express');
const cors = require('cors');  
const path = require('path');
const auth = require('./routes/auth'); 
const exhibition = require('./routes/exhibitions');
const links = require('./routes/links');

const app = express();


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', auth);
app.use('/exhibition', exhibition);
app.use('/links', links);


app.use(express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ex.html'));
});
