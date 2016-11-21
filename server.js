"use strict";
const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const path = require('path');

const filePath = './public';
const tasksList = [
      {id: Math.random() + '', message: "Submit CS homework", completed: false},
      {id: Math.random() + '', message: "Complete Data Mining assignment", completed: false},
      {id: Math.random() + '', message: "Go to brainstorming event in AC", completed: false},
];

const server = http.createServer(function(req, res){
    const location = path.join(filePath, req.url);
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;    

    fs.readFile(location, function(err, data) {

       if(method === 'GET') {
            if(req.url.indexOf('/todos')>= 0) {
                let localTodos = tasksList;

                if(parsedQuery.searchtext) {
                    localTodos = localTodos.filter(function(obj) {
                        return obj.message.toLowerCase().indexOf(parsedQuery.searchtext.toLowerCase()) >= 0;
                    });
                }
                return res.end(JSON.stringify({items : localTodos}));
            }
        }

 
    if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {

            
            let body = '';
            req.on('data', function (chunk) {
                body = body + chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  
                jsonObj.id = Math.random() + ''; 
                tasksList[tasksList.length] = jsonObj;   

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }
    
     if(method === 'DELETE') {
        
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < tasksList.length; i=i+1) {
                if(id === tasksList[i].id) {
                    tasksList.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
    if(method === 'PUT') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body = body + chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); 

                
                for(let i = 0; i < tasksList.length; i=i+1) {
                    if(tasksList[i].id === jsonObj.id) { 
                        tasksList[i] = jsonObj; 
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(jsonObj));
                    }
                }

                res.statusCode = 404;
                return res.end('Task cannot be updated');
            });
            return;
        }
    }
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }
        res.statusCode = 200;
        return res.end(data);
    
});
});
server.listen(12);