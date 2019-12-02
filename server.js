var express = require('express');
var app = express();
var path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer');
const bodyParser = require(`body-parser`);
const { positions, applicants, manager } = require(`./bookshelf`);
var flash = require('express-flash-messages')

app.use(express.static(__dirname + '/public'));
app.engine(`html`, require(`ejs`).renderFile);
app.set('view engine', 'html');
app.set(`views`, `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({ storage: storage })

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/manager', function (req, res) {
    res.render('manager');
});

app.get('/applicant', function (req, res) {
    res.render('applicant');
});

app.get('/signup', function (req, res) {
    res.render('signup');
});

// Inserting data into the database
app.post('/submit', async function (req, res) {
    console.log(req.body)
    let val = await applicants.forge({ 'first_name': req.body.fname, 'last_name': req.body.lname, 'email': req.body.email, 'work_position': req.body.position, 'resume': req.file || null, 'is_deleted': req.body.is_deleted }).save();
    console.log(val.toJSON());
    res.send('Thank you for submitting your application!');
});

// Requesting positions from the database
app.get(`/position`, async function (req, res) {
    const data = await positions.fetchAll().then(a => a.toJSON());
    res.json(data);
})

app.get('/access', async function (req, res) {
    const data = await applicants.fetchAll().then(a => a.toJSON());
    res.json(data);
})

app.post('/uploadfile', upload.single('file'), (req, res) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file);
});

app.post('/signup', function (req, res) {
    var username = req.body.username;
    console.log(username)
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var user = new manager({ username: username, password: hash })
        user.save().then(function () {
            console.log('successfully added ' + username + ' to the database');
        })
    })
});

app.post('/login', function (req, res) {
    
    var username = req.body.username;
    var enteredPassword = req.body.password;

    new manager({ username: username }).fetch().then(a => a.toJSON()).then(function (user) {
        if (user) {
            console.log('Username found', user);
            bcrypt.compare(enteredPassword, user.password).then(function (val) {
                if (val) {
                    console.log('password matches');
                    res.render('dashboard');
                } else {
                    console.log('incorrect credentials');
                    res.redirect('/manager')
                }
            });
        }
    })
})

app.post('index', function(req, res){
    res.redirect('/');
})

app.post('/index_applicant', function(req, res){
    res.redirect('/applicant');
})

app.post('/index_register', function(req, res){
    res.redirect('/signup');
})

app.post('/index_login', function(req, res){
    res.redirect('/manager');
})

app.listen(3000);
console.log('Listening to port 3000');
