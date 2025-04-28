const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note",
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);