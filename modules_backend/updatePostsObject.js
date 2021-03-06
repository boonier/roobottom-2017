'use strict';

const path = require('path');
const through = require('through2');
const moment = require('moment');

module.exports = function(site) {
  let posts = [];
  return through.obj(function (file, enc, cb) {
    let fileobj = path.parse(file.path);
    file.page.id = fileobj.name;
    file.page.category = fileobj.dir.split('/').slice(-1)[0];
    file.page.humanDate = moment(file.page.date).format('dddd, MMMM Do YYYY');
    posts.push(file.page);
    this.push(file);
    cb();
  },
  function(cb) {
    posts.sort((a,b) => {
        return b.date - a.date;
    });
    for (let key in posts) {
      let next = parseInt(key)-1;
      let prev = parseInt(key)+1;
      //console.log(posts[key].title);
      if(next in posts) {
        posts[key].next = {};
        posts[key].next.title = posts[next].title;
        posts[key].next.id = posts[next].id;
        posts[key].next.date = posts[next].date;
        posts[key].next.category = posts[next].category;
      }
      if(prev in posts) {
        posts[key].prev = {};
        posts[key].prev.title = posts[prev].title;
        posts[key].prev.id = posts[prev].id;
        posts[key].prev.date = posts[prev].date;
        posts[key].prev.category = posts[prev].category;
      }
    };
    site.posts = posts;
    cb();
  });
}
