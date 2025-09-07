const debug = require("debug")("fictionbook:book");
const { Book } = require("../../model-registry");
const { resolveCoverUrl } = require("./book-util");

exports.getAllBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Book.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] });
    const mapped = rows.map((b) => {
      const obj = b.toJSON();
      obj.coverImageUrl = resolveCoverUrl(b);
      return obj;
    });
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
    res.json(obj);
  } catch (err) {
    debug("Error getBookById:", err);
    res.status(500).json({ message: err.message });
  }
};

// Book cover upload route has been removed to keep scope minimal.
