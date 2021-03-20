var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var express = require('express');

const path = require('path');
// const mysql = require('mysql');
const router = express.Router();

const cont = require('../cont/cont')


router.use(express.static('public'));
console.log(path.resolve(__dirname, '..'));



router.get('/get_config_screen', function(req, res){
  res.json({"as":"-<>-"})
})

module.exports = router;
