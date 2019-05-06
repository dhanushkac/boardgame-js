var express = require('express');
var app = express();

app.use('/', express.static('./public/'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
   console.log("server is up and running on ", PORT)
})