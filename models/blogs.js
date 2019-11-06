const mongoose = required('mongoose');
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  img: String
})

const Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;
