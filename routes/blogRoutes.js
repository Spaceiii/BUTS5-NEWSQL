const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');

const Blog = mongoose.model('Blog');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _id: req.params.id, _user: req.user.id
    });
    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;
    const blog = await Blog.create({
      title,
      content,
      _user: req.user.id
    });
    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });

  app.delete('/api/blogs/:id', requireLogin, async (req, res) => {
    try {
      const blog = await Blog.findOneAndDelete({
        _id: req.params.id,
        _user: req.user.id
      });
      const blogs = await Blog.find({ _user: req.user.id });
      res.send(blogs);
    } catch (err) {
      res.status(500).send({ error: 'Failed to delete blog' });
    }
  });

  app.get('/apit/blogs/:id/with-comments', requireLogin, async (req, res) => {
    const blog = await Blog.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id), _user: mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: '_blog',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments._user',
          foreignField: '_id',
          as: 'author'
        },
      },
      { $unwind: '$author' },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
          averageRating: { $avg: '$comments.rating' },
        }
      }
    ]);

    res.send(blog[0]);
  })
};