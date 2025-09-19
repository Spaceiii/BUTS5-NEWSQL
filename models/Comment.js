const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  _blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
});

mongoose.model('Comment', commentSchema);