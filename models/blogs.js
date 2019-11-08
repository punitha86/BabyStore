const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    default: "Anonymous"
  },
  likes: {
    type: Number,
    default: 0
  },
  comments:[String],
  img: {
    type:String,
    deafult:"https://i.imgur.com/cvp3vWB.jpg"
  }
}, {
  timestamps: true
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
