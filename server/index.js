const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})

app.get('/', (req, res)=>{
    res.send("hello i'm palak");
})