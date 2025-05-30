// Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// Find books published after a certain year
db.books.find({ published_year: { $gt: 1813 } });

// Find books by a specific author
db.books.find({ author: "J.R.R. Tolkien" });

// Update the price of a specific book
db.books.updateOne(
  { title: "Brave New World" },
  { $set: { price: 19.99 } }
);

// Delete a book by its title
db.books.deleteOne({ title: "The Great Gatsby" });
