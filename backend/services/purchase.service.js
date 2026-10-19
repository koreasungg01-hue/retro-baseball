const { getDb } = require("../config/firebase");
const { getToonById } = require("./webtoon.service");

async function purchaseEpisode(uid, toonId, episodeId) {
  const toon = await getToonById(toonId);

  if (!toon) {
    const error = new Error("작품을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  const episode = (toon.parts || []).find(
    item => item.id === episodeId
  );

  if (!episode) {
    const error = new Error("회차를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  const price = episode.price;

  if (!Number.isSafeInteger(price) || price < 0) {
    const error = new Error("회차 가격 설정이 올바르지 않습니다.");
    error.status = 500;
    throw error;
  }

  const db = getDb();

  const userRef = db.collection("users").doc(uid);
  const purchaseId = `${toonId}_${episodeId}`;

  const purchaseRef = userRef
    .collection("purchases")
    .doc(purchaseId);

  const transactionRef = userRef
    .collection("transactions")
    .doc(`purchase_${purchaseId}`);

  return db.runTransaction(async tx => {
    const userSnap = await tx.get(userRef);
    const purchaseSnap = await tx.get(purchaseRef);

    if (!userSnap.exists) {
      const error = new Error("사용자 정보를 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (purchaseSnap.exists) {
      return {
        purchased: true,
        alreadyOwned: true,
        price,
        balance: userSnap.data().coinBalance ?? 0
      };
    }

    const balance = userSnap.data().coinBalance;

    if (!Number.isSafeInteger(balance) || balance < 0) {
      const error = new Error("코인 잔액 정보가 올바르지 않습니다.");
      error.status = 500;
      throw error;
    }

    if (balance < price) {
      const error = new Error("코인이 부족합니다.");
      error.status = 400;
      error.code = "INSUFFICIENT_COINS";
      throw error;
    }

    const nextBalance = balance - price;
    const now = new Date().toISOString();

    tx.update(userRef, {
      coinBalance: nextBalance
    });

    tx.create(purchaseRef, {
      toonId,
      episodeId,
      price,
      purchasedAt: now
    });

    if (price > 0) {
      tx.create(transactionRef, {
        type: "episode_purchase",
        toonId,
        episodeId,
        amount: -price,
        balanceAfter: nextBalance,
        createdAt: now
      });
    }

    return {
      purchased: true,
      alreadyOwned: false,
      price,
      balance: nextBalance
    };
  });
}

async function hasPurchased(uid, toonId, episodeId) {
  const db = getDb();

  const ref = db.collection("users")
    .doc(uid)
    .collection("purchases")
    .doc(`${toonId}_${episodeId}`);

  const snap = await ref.get();

  return snap.exists;
}

module.exports = {
  purchaseEpisode,
  hasPurchased
};
