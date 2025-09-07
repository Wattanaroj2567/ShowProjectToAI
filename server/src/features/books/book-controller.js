const debug = require("debug")("fictionbook:book");
const { Book, Review } = require("../../model-registry");
const { fn, col, literal } = require("sequelize");
const { resolveCoverUrl } = require("./book-util");

exports.getAllBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Book.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] });

    // Resolve covers first
    const mapped = rows.map((b) => {
      const obj = b.toJSON();
      obj.coverImageUrl = resolveCoverUrl(b);
      return obj;
    });
    // Attach review summary (avgRating, reviewCount) for these books
    const ids = mapped.map((b) => b.id);
    if (ids.length) {
      const summaries = await Review.findAll({
        attributes: [
          "bookId",
          [fn("AVG", col("rating")), "avgRating"],
          [fn("COUNT", literal(1)), "reviewCount"],
        ],
        where: { bookId: ids },
        group: ["bookId"],
        raw: true,
      });
      const byId = Object.fromEntries(
        summaries.map((s) => [Number(s.bookId), { avgRating: Number(s.avgRating) || 0, reviewCount: Number(s.reviewCount) || 0 }])
      );
      for (const b of mapped) {
        const s = byId[b.id] || { avgRating: 0, reviewCount: 0 };
        b.avgRating = s.avgRating;
        b.reviewCount = s.reviewCount;
      }
    }
    debug("GET /api/book", { page, limit, total: count });
    res.json({ books: mapped, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    debug("Error getAllBooks:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      debug("GET /api/book/:id - not found", req.params.id);
      return res.status(404).json({ message: "Book not found" });
    }
    debug("GET /api/book/:id", req.params.id);
    const obj = book.toJSON();
    obj.coverImageUrl = resolveCoverUrl(book);
    // Review summary for a single book
    const summary = await Review.findOne({
      attributes: [
        [fn("AVG", col("rating")), "avgRating"],
        [fn("COUNT", literal(1)), "reviewCount"],
      ],
      where: { bookId: book.id },
      raw: true,
    });
    obj.avgRating = Number(summary?.avgRating) || 0;
    obj.reviewCount = Number(summary?.reviewCount) || 0;
    res.json(obj);
  } catch (err) {
    debug("Error getBookById:", err);
    res.status(500).json({ message: err.message });
  }
};

// Book cover upload route has been removed to keep scope minimal.
