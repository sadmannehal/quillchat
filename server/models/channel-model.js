const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const channelSchema = new mongoose.Schema({
    user: { type: objectId, ref: "users" },
    recipient: { type: objectId, ref: "users" }
}, {
    timestamp: true,
    versionKey: false
});

module.exports = mongoose.models.channels || mongoose.model("channels", channelSchema);