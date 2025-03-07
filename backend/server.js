const express = require('express');

const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'easyway'
})
app.get('/', (re,res)=> {
    return res.json("From Backend Side")
})

app.get('/easyway', (re,res)=> {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result)=> {
        if(err) return res.json(err);
        return res.json(result);
    })  
})

app.listen(8081, ()=> {
    console.log("Server is running on port 8081")
})