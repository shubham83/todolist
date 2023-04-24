//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const port = process.env.PORT || 3000;



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://Admin:shubh123@cluster0.ga5afas.mongodb.net/todolistDB',{useNewUrlParser:true});

const itemSchema={
  name:String
};

const Item =mongoose.model("Item",itemSchema);

const Item1=new Item({
  name:"Welcome"
});
const Item2=new Item({
  name:"back"
});
const Item3=new Item({
  name:"Ending"
});

const defaultItem=[Item1,Item2,Item3];

const listSchema = {
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {
  Item.find({}).then(function(foundItem) {
        if(foundItem.length===0){
          Item.insertMany(defaultItem);
          console.log("Successfully Inserted!!!");
          res.redirect("/");
        }
        else {
          res.render("list",{listTitle:"Today",newListItems:foundItem});
        }

      });
});

app.get("/:customListName", function(req,res){
  const customListName = req.params.customListName;
  List.findOne({name:customListName})
  .then(function(result){
    if (result === null){
      const list = new List({
        name:customListName,
        items: defaultItem
      });
      list.save();
      res.redirect("/"+ customListName)
      } else{
        res.render ("list", {listTitle: result.name, newListItems: result.items});
      }
    })
      .catch(function (e){
        console.log(e);
      })
});
app.post("/", function(req, res){

const itemName = req.body.newItem;
const listName = req.body.list;

const item = new Item({
  name:itemName
});
if(listName==="Today"){
  item.save();
  res.redirect("/");
}else {
  List.findOne({name:listName}).then(function(foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })
}

});
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox.trim();
    const listName=req.body.listName;
    if (listName==="Today") {

    }
         
    res.redirect("/");
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
