const { Schema, model } = require('mongoose');

const advertisementSchema = new Schema({
  shortText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  }
})

module.exports = model('Advertisement', advertisementSchema)