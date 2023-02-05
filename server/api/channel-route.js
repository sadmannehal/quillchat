const router = require("express").Router();
const channelController = require("../controllers/channel-controller");

router.post("/", channelController.create);
router.get("/:id/messages", channelController.getMessages);
router.post("/:id/messages", channelController.createMessage);

module.exports = router;