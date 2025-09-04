const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: 10,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    clubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],
    blog : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",
        }
    ],
    readBooks : [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReadBook",
      }
    ],
    
  },
    
  { timestamps: true, versionKey: false }
);

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
