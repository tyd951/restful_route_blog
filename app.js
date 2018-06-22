var express     = require("express"),
    app         = express(),
    expressSanitizer = require("express-sanitizer"),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose    = require("mongoose"),
    port = process.env.PORT || 8080;
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// mongoose
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create(
//     {
//         title:"test blog",
//         image:"https://images.unsplash.com/photo-1513100318127-a251226436b4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=78be240afa4991793307b525c69b2532&auto=format&fit=crop&w=749&q=80",
//         body:"Hello, this is a blog post"
//     });

//restful routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       } else{
           res.render("index",{blogs:blogs});
       }
    });
});

//new route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//create route
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    })
    //redirect
});

//show page
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show",{blog:foundBlog});
       }
    });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog:foundBlog});
        }
    });
});

//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("blogs");
        }
    });
});

app.listen(port,function(){
    console.log("blog app server has started");
})