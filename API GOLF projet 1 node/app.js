const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose') ;
const exphbs = require('express-handlebars');
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const override = require('method-override');
const multer = require('multer');

//express
const port = 2000;
const app = express();

//express-static
app.use(express.static("public"))

//multer
//const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./public/uploads')
    },
    filename:function(req,file,cb) {
        cb(null, file.fieldname +'_'+Date.now())
    }
})
const upload = multer({storage:storage})

//method-override
app.use(override("_method"));

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
    departblanc: Number,
    photo: {
        name:String,
        originalname: String,
        path: String,
        createAt: Date
    }
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
                trou : information,
                
            })
        } else {
            res.send(err)
        }
    })
})


//POST
.post(upload.single("photo"),(req,res) => {

    const file = req.file;
    console.log(file)

    const newTrou = new Trou ({
        trou: req.body.trou,
        par: req.body.par,
        handicap: req.body.handicap,
        departrouge: req.body.rouge,
        departbleu: req.body.bleu,
        departjaune: req.body.jaune,
        departblanc: req.body.blanc
    });

    if(file) {
        newTrou.photo = {
            name:file.filename,
            originalname: file.originalname,
            path: file.path.replace("public",""),
            createAt: Date.now()
        }
    }


    newTrou.save(function(err) {
        if(!err){
            res.send('La sauvegarde a été effectué')
        } else {
            res.send(err)
        }
    })
})


.delete(function(req,res) {
    Trou.deleteMany(
        function(err) {
            if(!err) {
                res.send('La base de donnée a bien été supprimée')
            } else {
                res.send(err)
            }
        }
    )
})


//Route Modification
app.route('/:id')
.get(function(req,res) {
    Trou.findOne(
        {_id : req.params.id},
        function(err, renvoi) {
            if(!err){
                res.render("edition",{
                    _id:  renvoi.id,
                    trou: renvoi.trou,
                    par: renvoi.par,
                    handicap: renvoi.handicap,
                    departrouge: renvoi.departrouge,
                    departbleu: renvoi.departbleu,
                    departjaune: renvoi.departjaune,
                    departblanc: renvoi.departblanc

                })
            }else {
                res.send("err")
            }
        }
    )
})
.put(function(req,res) {
    Trou.updateOne(
        {_id: req.params.id},
        {
            trou: req.body.trou,
            par: req.body.par,
            handicap: req.body.handicap,
            departrouge: req.body.rouge,
            departbleu: req.body.bleu,
            departjaune: req.body.jaune,
            departblanc: req.body.blanc
        },
        {multi:true},
        function(err){
            if(!err) {
                res.send("La mise à jour a été faite")
            } else {
                res.send(err)
            }
        }
    )
})

.delete(function(req,res) {
    Trou.deleteOne(
        {_id: req.params.id},
        function(err) {
            if(!err) {
                res.send('Le trou a été supprimé')
            } else {
                res.send(err)
            }
        }
    )
})

//Ecoute Serveur
app.listen(port, () => {
    console.log(`Vous êtes bien connecté au port ${port} de l'ordinateur. Lancé à : ${new Date().toLocaleString()}`);
})