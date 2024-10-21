'use strict';

const app = require('./src/routes');
const port = 8000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});