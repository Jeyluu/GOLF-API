const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose') ;
const exphbs = require('express-handlebars');

//express
const app = express();

//express-handlebars

app.engine('hbs', exphbs({defaultLayout: "main", extname: "hbs"}));
app.set('view engine', 'hbs');

// BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));


//Connection avec Mongo DB

mongoose.connect("mongodb://localhost:27017/GOLF-API", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})


//Route
//Pour affichage de la page Index dans le localhost
app.route("/")
//GET
.get((req,res) => {
    res.render("index")
})
//POST
.post()
//PUT
.delete()


//Ecoute Serveur
app.listen(1992, () => {
    console.log("Vous êtes bien connecté au port 1992 de l'ordinateur.");
})