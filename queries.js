const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. CRUD Operations Basic Queries
    console.log("\n1. Basic Queries and CRUD:");

    // Find all books in a specific genre
    console.log("📚 Fiction books:");
    console.log(await collection.find({ genre: "Fiction" }).toArray());

    // Find books published after a certain year
    console.log("📅 Books published after 1813:");
    console.log(await collection.find({ published_year: { $gt: 1813 } }).toArray());

    // Find books by a specific author
    console.log("👤 Books by J.R.R. Tolkien:");
    console.log(await collection.find({ author: "J.R.R. Tolkien" }).toArray());

    // Update the price of a specific book
    await collection.updateOne({ title: "Brave New World" }, { $set: { price: 19.99 } });
    console.log("💲 Updated price of 'Brave New World'");

    // Delete a book by its title
    await collection.deleteOne({ title: "The Great Gatsby" });
    console.log("🗑️ Deleted 'The Great Gatsby'");

    // 2. Advanced Queries
    console.log("\n2. Advanced Queries:");

    // Books in stock and published after 2010
    console.log(" In-stock books after 2010:");
    console.log(await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray());

    // Projection: title, author, price only
    console.log(" Projection - title, author, price:");
    console.log(await collection.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray());

    // Sort by price ascending
    console.log("Books sorted by price (asc):");
    console.log(await collection.find().sort({ price: 1 }).toArray());

    // Sort by price descending
    console.log("Books sorted by price (desc):");
    console.log(await collection.find().sort({ price: -1 }).toArray());

    // Pagination: page 2 with 5 books per page
    console.log(" Page 2 (5 books per page):");
    console.log(await collection.find().skip(5).limit(5).toArray());

    // 3. Aggregations
    console.log("\n3.  Aggregation Pipelines:");

    // Average price by genre
    console.log(" Average price by genre:");
    console.log(await collection.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray());

    // Author with most books
    console.log(" Author with most books:");
    console.log(await collection.aggregate([
      { $group: { _id: "$author", bookCount: { $sum: 1 } } },
      { $sort: { bookCount: -1 } },
      { $limit: 1 }
    ]).toArray());

    // Group by publication decade
    console.log(" Books grouped by decade:");
    console.log(await collection.aggregate([
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
    ]).toArray());

    // 4. Indexing and Performance
    console.log("\n4.  Indexing and Performance:");

    // Create index on title
    await collection.createIndex({ title: 1 });
    console.log(" Index created on 'title'");

    // Compound index on author and published_year
    await collection.createIndex({ author: 1, published_year: 1 });
    console.log(" Compound index on 'author' and 'published_year'");

    // Use explain to check performance
    console.log(" Query performance analysis using explain():");
    const explainResult = await collection.find({ title: "The Hobbit" }).explain("executionStats");
    console.dir(explainResult.executionStats, { depth: null });

  } catch (error) {
    console.error(" Error:", error);
  } finally {
    await client.close();
    console.log("\n Connection closed");
  }
}

runQueries();
