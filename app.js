#!/usr/bin/env node
const express = require('express');
const sys = require('sys');
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();

const hostname = '127.0.0.1';
const port = 3005;

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(req.body);
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null,  file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});

var upload = multer({ storage: storage }).single('foo');

app.get('/', function(req, res) {
    res.send('Hello World!')
});

app.get('/run', function(req, res) {
    exec("make test", function(err, stdout, stderr) {
        if(err) console.error(err);
        else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.send(`running? \n${stdout}`);
        }
    });
});

app.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        res.redirect('back');
    });
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}`)
});
