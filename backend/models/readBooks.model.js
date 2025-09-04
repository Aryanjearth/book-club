const mongoose = require('mongoose');

const readBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: [String], default: ['Unknown Author'] },
  description: { type: String, default: 'No description available' },
  publishedDate: { type: String, default: 'Unknown' },
  imageLink: { type: String, default: 'https://via.placeholder.com/128x193.png?text=No+Image' },
  buyLink: { type: String, default: null },
  pdfLink: { type: String, default: null }, // This field is optional
  dateRead: { type: Date, default: Date.now }, // When the book was marked as read
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const ReadBook = mongoose.model('ReadBook', readBookSchema);

module.exports = ReadBook;
