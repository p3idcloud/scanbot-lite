'use strict';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const app = require('./src/entry');
const port = 80;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});