import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import coverTone from "../utils/coverTone";

function Collection() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("libraryUser"));

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Unable to load your collection.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(books.map((book) => book.category)),
  ];

  const filteredBooks = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    let result = books.filter((book) => {
      const matchesSearch =
        !searchValue ||
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || book.category === category;

      const matchesStatus =
        status === "All" || book.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

    if (sortBy === "title") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "author") {
      result.sort((a, b) =>
        a.author.localeCompare(b.author)
      );
    }

    if (sortBy === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    return result;
  }, [books, search, category, status, sortBy]);

  const groupedBooks = useMemo(() => {
    const groups = {};

    filteredBooks.forEach((book) => {
      if (!groups[book.category]) {
        groups[book.category] = [];
      }

      groups[book.category].push(book);
    });

    return groups;
  }, [filteredBooks]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Remove this book from your collection?"
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
      setError("Unable to remove book.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("libraryUser");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* COLLECTION */}
      <main className="dashboard-main collection-page">

        {/* HERO */}
        <section className="collection-hero">

          <div className="collection-hero-content">

            <p className="collection-kicker">
              PERSONAL BOOKSHELF
            </p>

            <h1>
              My <span>Collection</span>
            </h1>

            <p>
              A quiet place for every story you've chosen
              to keep.
            </p>

          </div>

          <div className="collection-bookmark">
            <span>COLLECTION</span>
            <strong>
              {books.length}
            </strong>
            <small>
              {books.length === 1
                ? "BOOK"
                : "BOOKS"}
            </small>
          </div>

        </section>

        {/* CONTROLS */}
        <section className="collection-controls">

          <div className="collection-search-large">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search your books by title or author..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="collection-control"
          >
            {categories.map((item) => (
              <option
                value={item}
                key={item}
              >
                {item === "All"
                  ? "All categories"
                  : item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="collection-control"
          >
            <option value="All">
              All status
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Issued">
              Issued
            </option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="collection-control"
          >
            <option value="recent">
              Recently added
            </option>

            <option value="title">
              Title A–Z
            </option>

            <option value="author">
              Author A–Z
            </option>
          </select>

        </section>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {loading ? (

          <div className="collection-empty">
            <div className="loading-circle"></div>
            <p>Arranging your bookshelf...</p>
          </div>

        ) : filteredBooks.length === 0 ? (

          <div className="collection-empty">

            <div className="collection-empty-icon">
              ♧
            </div>

            <h2>
              {books.length === 0
                ? "Your bookshelf is waiting"
                : "No books found"}
            </h2>

            <p>
              {books.length === 0
                ? "Add your first book from the Library dashboard."
                : "Try another search or change your filters."}
            </p>

            {books.length === 0 && (
              <button
                className="collection-back-button"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Go to Library →
              </button>
            )}

          </div>

        ) : (

          <section className="shelf-area">

            <div className="collection-result-bar">
              <div>
                <span>YOUR SHELF</span>
                <strong>
                  {filteredBooks.length}{" "}
                  {filteredBooks.length === 1
                    ? "book"
                    : "books"}
                </strong>
              </div>

              {(search ||
                category !== "All" ||
                status !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setStatus("All");
                  }}
                >
                  Clear filters ×
                </button>
              )}
            </div>

            {Object.entries(groupedBooks).map(
              ([groupName, groupBooks]) => (

                <div
                  className="shelf-group"
                  key={groupName}
                >

                  <div className="shelf-heading">

                    <div>
                      <span>SECTION</span>
                      <h2>{groupName}</h2>
                    </div>

                    <small>
                      {groupBooks.length}{" "}
                      {groupBooks.length === 1
                        ? "book"
                        : "books"}
                    </small>

                  </div>

                  <div className="shelf-books">

                    {groupBooks.map((book) => (

                      <article
                        className="shelf-book"
                        key={book._id}
                      >

                        <div
                          className={`shelf-cover tone-${coverTone(book.category)} ${
                            book.status === "Issued"
                              ? "shelf-cover-issued"
                              : ""
                          }`}
                        >

                          <div className="shelf-spine">
                            <span>BL</span>
                          </div>

                          <div className="shelf-cover-content">

                            <small>
                              {book.category}
                            </small>

                            <h3>
                              {book.title}
                            </h3>

                            <p>
                              {book.author}
                            </p>

                          </div>

                        </div>

                        <div className="shelf-book-info">

                          <div>
                            <h3>
                              {book.title}
                            </h3>

                            <p>
                              {book.author}
                            </p>
                          </div>

                          <span
                            className={`shelf-status ${
                              book.status ===
                              "Available"
                                ? "shelf-available"
                                : "shelf-issued"
                            }`}
                          >
                            {book.status}
                          </span>

                        </div>

                        <div className="shelf-actions">

                          <button
                            onClick={() =>
                              navigate("/dashboard")
                            }
                          >
                            Manage
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(book._id)
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </article>

                    ))}

                  </div>

                  <div className="wooden-shelf"></div>

                </div>

              )
            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Collection;