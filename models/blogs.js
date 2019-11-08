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
  img: {
    type: String,
    default: "http://i.imgur.com/cvp3vWB.jpg"
  },
  comments: [String]
}, {
  timestamps: true
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
