const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  originalCreatorId: {  // Corrected spelling
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
  clubName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true, versionKey: false });

// Registering the model
const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

module.exports = Club;
