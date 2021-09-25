const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

app.get('/', (req,res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})