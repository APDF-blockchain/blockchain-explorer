const express = require('express');

const app = express();

app.use(express.static('./dist/blockchain-explorer'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/blockchain-explorer/'}),
);

app.listen(process.env.PORT || 9999);