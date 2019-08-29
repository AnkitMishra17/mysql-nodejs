const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql      = require('mysql');

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const viewsPath = path.join(__dirname, "/views");

app.set('view engine', 'ejs')
app.set("views", viewsPath)

app.use('/public',express.static(path.join(__dirname, "../public")));

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'opdemy'
  });
  
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('Connection Established');
  });  

app.get('/', (req,res) =>{
    
    var sql = 'SELECT * FROM opdemytask';
    connection.query(sql, function (error, results, fields) {
        if (error){
            throw error;
        }else{
            let outputimg = new Array();
            for(var i = 0; i< results.length;i++){
                outputimg[i] = Buffer.from(results[i].Image).toString('base64');
            }
            const data = results;
            res.render('home',{output:data,myimg:outputimg});
        }    
    });
});

const server = app.listen(port, (req, res) => {
    console.log(`Server started at port ${port}..`)
  });