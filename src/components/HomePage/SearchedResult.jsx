// import { useEffect, useState } from "react";
// import axios from "axios";

// const Home = () => {
//     const [books, setBooks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchBooks = async () => {
//             try {
//                 const response = await axios.get("https://bookcompass.onrender.com/api/books/getAllBooks");
//                 setBooks(response.data); // adjust if API wraps data
//             } catch (err) {
//                 setError("Failed to fetch books");
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBooks();
//     }, []);

//     return (
//         <main className="px-4 py-6 max-w-7xl mx-auto">
//             <h1 className="text-2xl font-bold text-gray-800 mb-4">All Books</h1>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : error ? (
//                 <p className="text-red-500">{error}</p>
//             ) : (
//                 <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                     {books.map((book) => (
//                         <div key={book._id} className="p-4 border rounded-lg shadow hover:shadow-md transition">
//                             <h2 className="font-semibold text-lg">{book.title}</h2>
//                             <p className="text-gray-600 text-sm">Author: {book.author}</p>
//                             <p className="text-gray-500 text-xs mt-1">ISBN: {book.isbn}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </main>
//     );
// };

// export default SearchedResult;
