const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
    author: { type: objectId, required: true },
    content: { type: String, required: true },
    channel: { type: objectId, ref: "channels", required: true }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.models.messages || mongoose.model("messages", messageSchema);