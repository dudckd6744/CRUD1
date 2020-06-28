var express = require('express');
var app = express();
var template = require('./lib/template')
var qs = require('querystring');
var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'djajsl11',
    database:'test1'
})
db.connect();

app.get('/', (req,res)=>{
    db.query('SELECT*FROM page', function(err, pages) {
        if(err){
            throw err;
        }
        var title = 'Welcome no';
        var description = 'come on!!'
        var list = template.list(pages)
        var html = template.HTML(list,title,`
        <h2>${title}</h2>${description}`,
        '<a href="/create">create</a>')
        res.send(html)
    })
})

app.get('/page/:pageId' ,(req, res)=>{
    var queryData=(req.params.pageId);
    db.query('SELECT*FROM page', function(err, pages) {
        if(err){
            throw err;
        }
        db.query(`SELECT*FROM page WHERE id=${queryData}`,function (err1, page) {
            console.log(page)
            if(err1){
                throw err1;
            }
    var title = page[0].title;
    var description = page[0].description;
    var list = template.list(pages)
    var html = template.HTML(list,title,`
    <h2>${title}</h2>${description}`,
    `<a href="/create">create</a> | <a href="/update/page/${queryData}">update</a>
    <form action = "/delete_process" method = "post">
    <input type = "hidden" name="id" value = "${queryData}">
    <input type = "submit" value="delete">
    </form>
    `)
    res.send(html)
        })
    })
})

app.get('/create', (req, res) =>{
    db.query('SELECT*FROM page', function(err, pages) {
        if(err){
            throw err;
        }
        var title = 'Create';
        var list = template.list(pages)
        var html = template.HTML(list,title,`
        <form action = "/create_process" method ="post">
        <p>
        <input type = "text" name="title" placeholder="title">
        </p>
        <p>
        <textarea name= "description" placeholder="description"></textarea>
        </p>
        <p>
        <input type ="submit" value="create">
        </p>
        </form>`,
        '<a href="/page/create">create</a>')
        res.send(html)
    })
})

app.post('/create_process', (req,res)=>{
    var body = '';
    req.on('data',function (data) {
        body += data;
    })
    req.on('end',function() {
        var post = qs.parse(body)
        db.query(`INSERT INTO page (title,description,created,author_id)
        VALUES(?,?,now(),?)`,[post.title,post.description,1],function(err, result) {
            if(err){
                throw err;
            }
            res.redirect(`/page/${result.insertId}`)
        })
    })  
})

app.get(`/update/page/:pageId`, (req,res)=> {
    var queryData=(req.params.pageId);
    db.query('SELECT*FROM page', function(err, pages) {
        if(err){
            throw err;
        }
        db.query(`SELECT*FROM page WHERE id=${queryData}`,function (err1, page) {
            if(err1){
                throw err1;
            }
    var list = template.list(pages)
    var html = template.HTML(list,page[0].title,`
    <form action = "/update_process" method ="post">
    <input type = "hidden" name = "id" value = "${page[0].id}">
    <p>
    <input type = "text" name="title" placeholder="title" value = ${page[0].title}>
    </p>
    <p>
    <textarea name= "description" placeholder="description">${page[0].description}</textarea>
    </p>
    <p>
    <input type ="submit" value="update">
    </p>
    </form>`,
    `<a href="/create">create</a> | <a href="/update/${page[0].id}">update</a>`)
    res.send(html)
        })
    })
})

app.post('/update_process', (req,res) =>{
    var body = '';
    req.on('data',function (data) {
        body += data;
    })
    req.on('end',function() {
        var post = qs.parse(body)
        db.query('UPDATE page SET title=? , description=?, author_id=1 WHERE id =?',[post.title,post.description,post.id], function(err,result) {
            res.redirect(`/page/${post.id}`)
        })
    })  
})

app.post('/delete_process',(req,res)=> {
    var body = '';
    req.on('data',function (data) {
        body += data;
    })
    req.on('end',function() {
        var post = qs.parse(body)
        db.query('DELETE FROM page WHERE id =?', [post.id],function(err, result) {
            if(err){
                throw err;
            }
            res.redirect(`/`)

        })
        
    })  
})

app.listen(5000, ()=>console.log('Example app listening in port 5000!!'))