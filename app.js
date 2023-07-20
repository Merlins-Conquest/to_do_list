// require npm modules 

const express = require ("express");
const bodyParser = require ("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


// create app constsant using express 
const app = express(); 



// tells app to use ejs as is view engine
app.set('view engine', 'ejs');

//tell app to use body parser 

app.use(bodyParser.urlencoded({extended:true})); 
// this tells express to serve up public folder which has style sheet in it 
app.use(express.static("public"));

// create new database in mongoDB 

mongoose.connect("mongodb+srv://admin-randy:Test123@cluster0.1kmqivd.mongodb.net/todolistDB", {useNewUrlParser:true}); 

// create a new item schema

const itemsSchema = {
    name: String
}; 
// create mongoose model 

const Item = mongoose.model("Item",itemsSchema); 

// Create new items documents 

const item1 = new Item({
    name: "Clean up the house"
}); 

const item2 = new Item({
    name: "Apply for COOP for fall"
}); 

const item3 = new Item({
    name: "Get gyno surgery for 20k"
}); 

const defaultItems = [item1,item2,item3]; 

// every list we create will have a name and also array of items docs associated with it
const listSchema = {

    name:String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema); 









// use app get to route browser to root page 

app.get("/",function(req,res){

    // tap into db items to find 


    Item.find()
    .then(function(foundItems){
        
        if(foundItems.length === 0){
            Item.insertMany(defaultItems).then((err)=>{
            console.log("Succesfully saved default items to database!"); 
          }).catch((err)=>{
           console.log(err);
          });

          res.redirect("/");
        }else{
            res.render('list', {listTitle: "Today", newListItems:foundItems});// express looks inside folder views and looks for file list 

        }


    });
        



});


// when post request is trigerd we will redirect back to home route 
app.post("/", async (req, res) => {
    let itemName = req.body.newItem
    let listName = req.body.list
 
    const item = new Item({
        name: itemName,
    })
 
    if (listName === "Today") {
        item.save()
        res.redirect("/")
    } else {
 
        await List.findOne({ name: listName }).exec().then(foundList => {
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        }).catch(err => {
            console.log(err);
        });
    }
})

// delete route 

// we need to identify the correct list 

app.post("/delete", function(req,res){

    const checkedItemId = req.body.checkbox ;

    const listName = req.body.listName; 

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId).then((err)=>{
            console.log("Succesfully deleted  item from database!"); 
            res.redirect("/");
        }).catch((err)=>{
        console.log(err);
        });
    }else{
        List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItemId}}})
        .then((err)=>{
            console.log("Succesfully deleted  item from database!"); 
            res.redirect("/" + listName);

        }).catch((err)=>{
        console.log(err);
        });
    }


});



app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
   
    List.findOne({ name: customListName })
      .then(function (foundList) {
        if (!foundList) {
          const list = new List({
            name: customListName,
            items: defaultItems,
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items,
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  });
    
  
  
  

// app.post("/work",function(req,res){
//     let item = req.body.newItem; 
//     workItems.push(item);
//     res.redirect("/work");

// });

app.get("/about",function(req,res){
    res.render("about")
})



// listen on local port 3000 


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
    console.log("Server started succesfully");
});