const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/mywikiDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


const articleSchema = new mongoose.Schema({
    title:String,
    content:String
})

const Article = mongoose.model("Article", articleSchema);





// Route for all articles

app.route("/articles")
  .get(async (req,res)=> {
        const articles = await Article.find({});
        res.send({status:"ok", data:articles});
})
  .post((req, res)=>{
        const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
        });
        newArticle.save();
        res.redirect("/articles"); 
    })
  .delete(async (req, res)=>{
    await Article.deleteMany({});
    res.redirect("/articles");
    });
  

// Route for a particular article
app.route("/articles/:articleTitle")
    .get(async (req, res)=>{
      const specifiedArticle = await Article.findOne({title:req.params.articleTitle});
      if(specifiedArticle){
        res.send(specifiedArticle);
      }
      else{
        res.send("No Article found");
      }
    })
    .put(async (req, res)=>{
        
        await Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        
        
      );
       res.redirect("/articles");
    })



app.listen(3000, console.log("Server started"));