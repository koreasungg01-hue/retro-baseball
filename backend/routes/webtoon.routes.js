const express = require("express");
const {
  listToons,
  searchToons,
  getToonById
} = require("../services/webtoon.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const { q = "", genre = "" } = req.query;

  if (
    typeof q !== "string" ||
    typeof genre !== "string" ||
    q.length > 100 ||
    genre.length > 50
  ) {
    return res.status(400).json({
      error: "INVALID_SEARCH",
      message: "검색 조건을 확인해 주세요."
    });
  }

  const results = await searchToons({ q, genre });

  res.json({
    items: results,
    total: results.length
  });
});

router.get("/:id", async (req, res) => {
  const toon = await getToonById(req.params.id);

  if (!toon) {
    return res.status(404).json({
      error: "TOON_NOT_FOUND",
      message: "작품을 찾을 수 없습니다."
    });
  }

  res.json({ item: toon });
});

module.exports = router;
