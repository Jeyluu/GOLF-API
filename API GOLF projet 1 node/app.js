const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose') ;
const exphbs = require('express-handlebars');
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


//express
const app = express();

//express-handlebars

app.engine('hbs', exphbs({defaultLayout: "main", extname: "hbs", handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'hbs');

// BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));


//Connection avec Mongo DB

mongoose.connect("mongodb://localhost:27017/golf", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

//Schema pour la collection

const trouSchema = {
    trou: Number,
    par: Number,
    handicap: Number,
    departrouge: Number,
    departbleu: Number,
    departjaune: Number,
    departblanc: Number
};

const Trou = mongoose.model("ladomangeres", trouSchema );

//Route
//Pour affichage de la page Index dans le localhost
app.route("/")
//GET
.get((req,res) => {
    Trou.find(function(err, information) {
        if(!err) {
            res.render("index", {
                trou : information
            })
        } else {
            res.send(err)
        }

        
    })
})


//POST
.post()
//PUT
.delete()


//Ecoute Serveur
app.listen(2000, () => {
    console.log("Vous êtes bien connecté au port 2000 de l'ordinateur.");
})