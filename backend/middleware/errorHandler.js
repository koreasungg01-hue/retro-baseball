function notFound(req, res) {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "요청한 API를 찾을 수 없습니다."
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status <= 599
      ? err.status
      : 500;

  res.status(status).json({
    error: err.code || "INTERNAL_SERVER_ERROR",
    message:
      status === 500
        ? "서버 내부 오류가 발생했습니다."
        : err.message
  });
}

module.exports = {
  notFound,
  errorHandler
};
