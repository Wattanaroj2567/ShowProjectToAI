const debug = require("debug")("fictionbook:controllers:review");
const { Review, Book, User } = require("../../model-registry");
const config = require("../../config");

exports.createReview = async (req, res) => {
  const { bookId } = req.params;
  const { rating, content } = req.body;
  const userId = req.user.id;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "ไม่พบหนังสือที่ต้องการรีวิว" });
    }
    const existingReview = await Review.findOne({ where: { userId, bookId } });
    if (existingReview) {
      debug(`User ${userId} already reviewed book ${bookId}`);
      return res.status(400).json({ success: false, message: "คุณได้ทำการรีวิวหนังสือเล่มนี้ไปแล้ว" });
    }
    const review = await Review.create({ userId, bookId, rating, content });
    debug(`Created review ID: ${review.id} for book ${bookId} by user ${userId}`);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    debug("Error creating review:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการสร้างรีวิว", error: config.server.nodeEnv === "development" ? err.message : undefined });
  }
};

exports.getBookReviews = async (req, res) => {
  const { bookId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const bookExists = await Book.findByPk(bookId);
    if (!bookExists) {
      return res.status(404).json({ success: false, message: "ไม่พบหนังสือที่ต้องการดูรีวิว" });
    }
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { bookId },
      include: [{ model: User, attributes: ["id", "displayName", "profileImage"], where: { deletedAt: null } }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    debug(`Fetched ${reviews.length} reviews for book ${bookId}`);
    res.json({ success: true, data: { reviews, pagination: { currentPage: page, totalItems: count, totalPages: Math.ceil(count / limit), itemsPerPage: limit } } });
  } catch (err) {
    debug("Error fetching book reviews:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงรีวิว", error: config.server.nodeEnv === "development" ? err.message : undefined });
  }
};

exports.getUserReviews = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้ที่ต้องการดูรีวิว" });
    }
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId },
      include: [{ model: Book, attributes: ["id", "title", "coverImage"], where: { deletedAt: null } }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    debug(`Fetched ${reviews.length} reviews by user ${userId}`);
    res.json({ success: true, data: { reviews, pagination: { currentPage: page, totalItems: count, totalPages: Math.ceil(count / limit), itemsPerPage: limit } } });
  } catch (err) {
    debug("Error fetching user reviews:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงรีวิว", error: config.server.nodeEnv === "development" ? err.message : undefined });
  }
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, content } = req.body;
  const userId = req.user.id;
  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "ไม่พบรีวิวที่ต้องการแก้ไข" });
    }
    if (review.userId !== userId) {
      debug(`User ${userId} unauthorized to update review ${reviewId}`);
      return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์แก้ไขรีวิวนี้" });
    }
    const updates = {};
    if (rating !== undefined) updates.rating = rating;
    if (content !== undefined) updates.content = content;
    await review.update(updates);
    debug(`Updated review ID: ${reviewId}`);
    res.json({ success: true, data: review });
  } catch (err) {
    debug("Error updating review:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการแก้ไขรีวิว", error: config.server.nodeEnv === "development" ? err.message : undefined });
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "ไม่พบรีวิวที่ต้องการลบ" });
    }
    if (review.userId !== userId) {
      debug(`User ${userId} unauthorized to delete review ${reviewId}`);
      return res.status(403).json({ success: false, message: "คุณไม่มีสิทธิ์ลบรีวิวนี้" });
    }
    await review.destroy();
    debug(`Deleted review ID: ${reviewId}`);
    res.json({ success: true, message: "ลบรีวิวเรียบร้อยแล้ว" });
  } catch (err) {
    debug("Error deleting review:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการลบรีวิว", error: config.server.nodeEnv === "development" ? err.message : undefined });
  }
};
