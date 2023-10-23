const mongoose = require("mongoose");

const BlogShema = new mongoose.Schema({
    title: String,
    content: String,
    img: String
});

const Blogmodel = mongoose.model("Blog", BlogShema);

module.exports = Blogmodel; 
