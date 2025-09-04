const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: [String], default: ['Unknown Author'] },
  description: { type: String, default: 'No description available' },
  publishedDate: { type: String, default: 'Unknown' },
  imageLink: { type: String, default: 'https://via.placeholder.com/128x193.png?text=No+Image' },
  buyLink: { type: String, default: null },
  pdfLink: { type: String, default: null }, // Added pdfLink field
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt fields automatically
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
