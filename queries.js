//1. Find all books in a specific genre
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


//2. Books in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// Projection: title, author, price only
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// Sort by price ascending
db.books.find().sort({ price: 1 });

// Sort by price descending
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page (page 2)
db.books.find().skip(5).limit(5);


//3. Average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// Author with most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

// Group by publication decade
db.books.aggregate([
  {
    $group: {
      _id: {
        decade: {
          $concat: [
            { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
            "s"
          ]
        }
      },
      count: { $sum: 1 }
    }
  }
]);


//4. Index on title
db.books.createIndex({ title: 1 });

// Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use explain to check performance
db.books.find({ title: "Sapiens" }).explain("executionStats");
