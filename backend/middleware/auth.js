const { admin, getDb } = require("../config/firebase");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer (.+)$/i);

    if (!match) {
      return res.status(401).json({
        error: "LOGIN_REQUIRED",
        message: "로그인이 필요합니다."
      });
    }

    const decoded = await admin.auth().verifyIdToken(match[1]);
    const db = getDb();

    const userDoc = await db.collection("users")
      .doc(decoded.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(403).json({
        error: "USER_NOT_REGISTERED",
        message: "사용자 등록 또는 승인이 필요합니다."
      });
    }

    const user = userDoc.data();

    if (user.status !== "approved") {
      return res.status(403).json({
        error: "ACCOUNT_NOT_APPROVED",
        message: "관리자의 승인을 기다려 주세요."
      });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      role: user.role || "user",
      status: user.status
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "INVALID_TOKEN",
      message: "로그인 정보가 유효하지 않습니다."
    });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "ADMIN_REQUIRED",
      message: "관리자 권한이 필요합니다."
    });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin
};
