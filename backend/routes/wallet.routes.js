const express = require("express");
const { getDb } = require("../config/firebase");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const db = getDb();
  const userRef = db.collection("users").doc(req.user.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return res.status(404).json({
      error: "USER_NOT_FOUND",
      message: "사용자 정보를 찾을 수 없습니다."
    });
  }

  const user = userDoc.data();

  res.json({
    balance: Number.isSafeInteger(user.coinBalance)
      ? user.coinBalance
      : 0
  });
});

router.get("/transactions", requireAuth, async (req, res) => {
  const db = getDb();

  const snapshot = await db
    .collection("users")
    .doc(req.user.uid)
    .collection("transactions")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  res.json({
    items: snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  });
});

module.exports = router;
