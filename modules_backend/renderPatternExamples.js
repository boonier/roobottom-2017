'use strict';

const through = require('through2');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const env = nunjucks.configure('',{autoescape:false});


module.exports = function() {
    return through.obj(function (file, enc, cb) {

        var patternFile = path.join(__dirname, '../_source/patterns/' + file.example.type + '/' + file.example.name + '/' + file.example.name + '.html')
        var pattern = fs.readFileSync(patternFile);
        var updated = env.renderString(pattern.toString() + file.contents.toString(),file.example.data);
        updated = marked(updated.trim());

        file.contents = new Buffer(updated, 'utf8');

        this.push(file);
        cb();
    });
}