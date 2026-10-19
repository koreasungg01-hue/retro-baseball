const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  purchaseEpisode,
  hasPurchased
} = require("../services/purchase.service");

const router = express.Router();

router.post(
  "/:toonId/:episodeId",
  requireAuth,
  async (req, res) => {
    const { toonId, episodeId } = req.params;

    const result = await purchaseEpisode(
      req.user.uid,
      toonId,
      episodeId
    );

    res.json(result);
  }
);

router.get(
  "/:toonId/:episodeId/access",
  requireAuth,
  async (req, res) => {
    const { toonId, episodeId } = req.params;

    const owned = await hasPurchased(
      req.user.uid,
      toonId,
      episodeId
    );

    res.json({ owned });
  }
);

module.exports = router;
