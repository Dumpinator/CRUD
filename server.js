
const express = require('express')
const http = require('http')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const dateFormat = require('dateformat')
const moment = require('moment')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000);


app.set('view engine', 'ejs')
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'))
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

const connection = mysql.createConnection({
    host: 'process.env.HOST',
    user: 'process.env.USER',
    password: 'process.env.PASSWORD',
    database: 'process.env.DATABASE'
})

const siteTitle = "tuto node"
const baseURL = "/"

app.get('/', (req, res) => {
   
    connection.query('SELECT * FROM messages WHERE 1', (err, results, fields) => {
        if (err) throw err.message
        
        res.render('pages/index',{
            siteTitle : siteTitle,
            pageTitle : "Message list",
            items : results,
            fromNow : function(date){
                return moment(date).fromNow()
            }
        })
    })
})

app.get('/add', (req, res) => {
       
        res.render('pages/add-event',{
            siteTitle : siteTitle,
            pageTitle : "Add Message",
            items : ''
        })
    })

app.post('/add', (req, res) => {
    
    connection.query('INSERT INTO messages SET name = ?, content = ?, created_at = ?', [ req.body.e_name ,req.body.e_mess, new Date() ], (err, results, fields) => {
        if (err) throw err.message
        
        res.redirect(baseURL)
    })
})

app.get('/edit/:id', (req, res) => {
    
    connection.query('SELECT * FROM messages WHERE id = ?', [ req.params.id ], (err, results, fields) => {
        if (err) throw err.message
        //console.log(results)
        
        res.render('pages/edit-event',{
            siteTitle : siteTitle,
            pageTitle : "Edit Message : ",
            items : results
        })
    })
 })

 app.post('/edit/:id', (req, res) => {
    
    connection.query('UPDATE messages SET name = ?, content = ?, created_at = ? WHERE id = ?', [ req.body.e_name, req.body.e_mess, new Date(), req.body.id ], (err, results, fields) => {
        if (err) throw err.message
        
        if (results.affectedRows){
            res.redirect(baseURL)
        } 
    })
})

app.get('/delete/:id', (req, res) => {
    connection.query('DELETE FROM messages WHERE id = ?', [ req.params.id ], (err, results, fields) => {
        if (err) throw err.message
        if (results.affectedRows){
            res.redirect(baseURL)
        }
    })
})
