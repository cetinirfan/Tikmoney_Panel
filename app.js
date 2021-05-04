var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var app = express();
app.use(require("morgan")("dev"));
var sessiion = require('express-session');
var flashh = require('connect-flash');

app.engine('.ejs', ejs.__express);
app.set('views', __dirname+'/view');

app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(sessiion({
    secret: 'secret',
    cookie: { maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));
app.use(flashh());

const db = require('./services/mongodb.js')();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/uploads', express.static('uploads'))
app.use(express.static(__dirname+'/public'))

app.use("/", require('./routes/index.js'))
app.use("/yonetim", require('./routes/yonetim.js'))
app.use("/kullanicilar", require('./routes/kullanicilar.js'))
app.use("/duyurular", require('./routes/duyurular.js'))
app.use("/magaza", require('./routes/magaza.js'))
app.use("/talep", require('./routes/talep.js'))
app.use("/giris", require('./routes/giris.js'))
app.use("/gorev", require('./routes/gorev.js'))

var server = http.createServer(app);
server.listen(7070);
