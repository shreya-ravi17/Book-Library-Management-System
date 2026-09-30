import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import coverTone from "../utils/coverTone";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("libraryUser"));

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    status: "Available",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/books"
      );

      setBooks(response.data);
      setError("");
    } catch (error) {
      setError("Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return books;
    }

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue)
    );
  }, [books, search]);

  const totalBooks = books.length;

  const availableBooks = books.filter(
    (book) => book.status === "Available"
  ).length;

  const issuedBooks = books.filter(
    (book) => book.status === "Issued"
  ).length;

  const categories = new Set(
    books.map((book) => book.category.toLowerCase())
  ).size;

  const openAddModal = () => {
    setEditingBook(null);

    setFormData({
      title: "",
      author: "",
      category: "",
      status: "Available",
    });

    setModalError("");
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
    });

    setModalError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await api.put(
          `/books/${editingBook._id}`,
          formData
        );
      } else {
        await api.post(
          "/books",
          formData
        );
      }

      closeModal();
      fetchBooks();
    } catch (error) {
      setModalError(
        error.response?.data?.message ||
          "Unable to save book."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/books/${id}`
      );

      fetchBooks();
    } catch (error) {
      setError("Unable to delete book.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("libraryUser");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}

      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              YOUR LIBRARY
            </p>

            <h1>
              Good to see you,{" "}
              <span>{user?.name?.split(" ")[0]}</span>.
            </h1>

            <p className="dashboard-subtitle">
              Keep your collection organized and within reach.
            </p>
          </div>

          <button
            className="add-book-button"
            onClick={openAddModal}
          >
            <span>+</span>
            Add Book
          </button>

        </header>

        {/* Statistics */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">▤</div>

            <div>
              <span>Total Books</span>
              <strong>{totalBooks}</strong>
            </div>
          </div>

          <div className="stat-card available-stat">
            <div className="stat-icon">✓</div>

            <div>
              <span>Available</span>
              <strong>{availableBooks}</strong>
            </div>
          </div>

          <div className="stat-card issued-stat">
            <div className="stat-icon">↗</div>

            <div>
              <span>Issued</span>
              <strong>{issuedBooks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">◈</div>

            <div>
              <span>Categories</span>
              <strong>{categories}</strong>
            </div>
          </div>

        </section>

        {/* Library Section */}

        <section className="library-section">

          <div className="library-toolbar">

            <div>
              <h2>Your collection</h2>

              <p>
                {filteredBooks.length}{" "}
                {filteredBooks.length === 1
                  ? "book"
                  : "books"}{" "}
                in your library
              </p>
            </div>

            <div className="search-box">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search title or author..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          {error && (
            <div className="dashboard-error">
              {error}
            </div>
          )}

          {loading ? (

            <div className="empty-library">
              <div className="loading-circle"></div>
              <p>Opening your library...</p>
            </div>

          ) : filteredBooks.length === 0 ? (

            <div className="empty-library">

              <div className="empty-icon">
                ♧
              </div>

              <h3>
                {search
                  ? "No books found"
                  : "Your library is empty"}
              </h3>

              <p>
                {search
                  ? "Try searching with a different title or author."
                  : "Add your first book to start building your collection."}
              </p>

              {!search && (
                <button
                  className="empty-add-button"
                  onClick={openAddModal}
                >
                  + Add your first book
                </button>
              )}

            </div>

          ) : (

            <div className="books-grid">

              {filteredBooks.map((book) => (

                <article
                  className="book-card"
                  key={book._id}
                >

                  <div className="book-card-top">

                    <div className="book-category">
                      {book.category}
                    </div>

                    <div
                      className={`status-badge ${
                        book.status === "Available"
                          ? "status-available"
                          : "status-issued"
                      }`}
                    >
                      <span></span>
                      {book.status}
                    </div>

                  </div>

                  <div className={`book-cover-small tone-${coverTone(book.category)}`}>

                    <div className="mini-spine"></div>

                    <div className="mini-cover">

                      <small>
                        {book.category}
                      </small>

                      <strong>
                        {book.title}
                      </strong>

                      <span>
                        {book.author}
                      </span>

                    </div>

                  </div>

                  <div className="book-details">

                    <h3>{book.title}</h3>

                    <p>
                      by {book.author}
                    </p>

                  </div>

                  <div className="book-actions">

                    <button
                      className="edit-action"
                      onClick={() =>
                        openEditModal(book)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-action"
                      onClick={() =>
                        handleDelete(book._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* Add / Edit Modal */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="book-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <p className="dashboard-eyebrow">
                  {editingBook
                    ? "EDIT BOOK"
                    : "NEW ADDITION"}
                </p>

                <h2>
                  {editingBook
                    ? "Edit this book"
                    : "Add a new book"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close"
                className="close-modal"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form
              className="book-form"
              onSubmit={handleSubmit}
            >

              <div className="modal-input">
                <label>Book title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-input">
                <label>Author</label>

                <input
                  type="text"
                  name="author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">

                <div className="modal-input">
                  <label>Category</label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Fiction"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-input">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Issued">
                      Issued
                    </option>
                  </select>
                </div>

              </div>

              {modalError && <p className="form-error">{modalError}</p>}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingBook
                    ? "Save Changes"
                    : "Add to Library"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;