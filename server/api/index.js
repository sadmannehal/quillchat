const router = require("express").Router();

router.get("/", (_, res) => {
    return res.status(200).json({
        status: 200,
        message: "Booyah!"
    });
});

module.exports = router;