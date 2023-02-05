const middleware = require("../utils/middleware");
const channelModel = require("../models/channel-model");
const userModel = require("../models/user-model");
const messageModel = require("../models/message-model");

module.exports = {
    create: [
        middleware.checkAuth,
        async (req, res) => {
            try {
                const { recipient = "123" } = req.body;

                const recipientUser = await userModel.findOne({ _id: recipient }).catch(() => false);
                if (!recipientUser) return res.status(400).json({ message: "Invalid recipient id" });

                let channel = await channelModel.findOne({ user: req.user._id, recipient: recipientUser._id });
                if (!channel) {
                    channel = await channelModel.findOne({ user: recipientUser._id, recipient: req.user._id });
                }

                if (!channel) {
                    channel = new channelModel({ user: req.user._id, recipient: recipientUser._id });
                    await channel.save();

                    return res.status(200).json({
                        id: channel._id,
                        user: channel.user,
                        recipient: channel.recipient,
                        createdAt: channel.createdAt
                    });
                } else {
                    return res.status(200).json({
                        id: channel._id,
                        user: channel.user,
                        recipient: channel.recipient,
                        createdAt: channel.createdAt
                    });
                }
            } catch (e) {
                console.error(e);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    ],
    createMessage: [
        middleware.checkAuth,
        async (req, res) => {
            try {
                const { content } = req.body;
                const channelId = req.params.id;

                const channel = await channelModel.findOne({ _id: channelId }).catch(() => false);
                if (!channel) return res.status(404).json({ message: "The channel does not exist" });

                let access = false;
                if (channel.user.toString() === req.user._id.toString()) access = true;
                if (!access && channel.recipient.toString() === req.user._id.toString()) access = true;

                if (!access) {
                    return res.status(403).json({ message: "You don't have access to this channel!" });
                }

                if (!content) return res.status(400).json({ message: "Content is required" });

                const message = new messageModel({
                    author: req.user._id,
                    content,
                    channel: channel._id
                });

                await message.save();
                return res.status(200).json(message._doc);
            } catch (e) {
                console.error(e);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    ],
    getMessages: [
        middleware.checkAuth,
        async (req, res) => {
            try {
                const channel = await channelModel.findOne({ _id: req.params.id });
                if (!channel) return res.status(404).json({ message: "The channel does not exist" });

                let access = false;
                if (channel.user.toString() === req.user._id.toString()) access = true;
                if (!access && channel.recipient.toString() === req.user._id.toString()) access = true;

                if (!access) {
                    return res.status(403).json({ message: "You don't have access to this channel!" });
                }

                const messages = await messageModel.find({ channel: channel._id });
                return res.status(200).json(messages);
            } catch (e) {
                console.error(e);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    ]
}