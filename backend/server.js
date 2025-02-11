// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const app = require('./controller/app');
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})