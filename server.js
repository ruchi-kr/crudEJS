require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
app.use(morgan('tiny'));

const PORT = process.env.PORT || 8000;

//database connection

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error',(err)=>console.log(err));
db.on('connected',() => console.log("connected to db"));

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('images'));

app.use(session({
    secret:'my secret key',
    saveUninitialized:true,
    resave:false
}));

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//set template engine
app.set('view engine','ejs');

//routes 
app.use('',require('./routes/routes'));



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});



