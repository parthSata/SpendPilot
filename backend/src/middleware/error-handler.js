import { ApiError } from "../utils/api-error.js";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      ok: false,
      message: error.message,
      details: error.details
    });
  }

  console.error("Unhandled error:", error);
  return res.status(500).json({
    ok: false,
    message: "Internal server error"
  });
};
