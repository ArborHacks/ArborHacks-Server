#!/usr/bin/env node
const express = require('express');
const https = require('https');
const exec = require('child_process').exec;
const multer = require('multer');
const cors = require('cors');
const sys = require('sys');
const fs = require('fs');

// variable and function declarations
const app = express();

app.use(cors());

const port = 3000;

var ssl_certs = {
	key: fs.readFileSync('keys/key.pem'),
	cert: fs.readFileSync('keys/cert.pem')
};

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});

var upload = multer({ storage: storage }).single('foo');

// routes
app.get('/api', function(req, res) {
    res.send('Hello World!')
});

app.get('/api/run', function(req, res) {
    exec("ls", function(err, stdout, stderr) {
        if(err) console.error(err);
        else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`running? \n${stdout}`);
        }
    });
});

app.post('/api/upload', function(req, res) {
    upload(req, res, function(err) {
        exec("ls -l", function(err, stdout, stderr) {
            if(err) console.error(err);
            else {
                res.send({'text': stdout});
            }
        });
    });
});

// app.listen(port, function() {
    // console.log(`Example app listening on port ${port}`)
// });

https.createServer(ssl_certs, app).listen(port);
