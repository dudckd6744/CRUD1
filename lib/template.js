module.exports = {
    HTML:function(list,title, body, contral) {
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${contral}
        ${body}
        </body>
        </html>
        `;
    },  
    list:function (pages) {
        var list = '<ol>'
        var i = 0;
        while(i < pages.length){
            list = list + `<li><a href="/page/${pages[i].id}">${pages[i].title}</a></li>`
            i = i+1;
        }
        list = list + '</ol>'
        return list;
    }
}