const axios = require('axios');

// Open Library API URL
const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/subjects/bestsellers.json';

const getPopularBooks = async (req, res) => {
    try {
        const response = await axios.get(OPEN_LIBRARY_API_URL);

        // Filter and map the response data to extract relevant information
        const popularBooks = (response.data.works || [])
            .filter(book => book.cover_id) // Exclude books without a cover image
            .slice(0, 10) // Limit the results to 10 books
            .map(book => ({
                title: book.title || 'Unknown Title',
                author: book.authors ? book.authors.map(a => a.name).join(', ') : 'Unknown Author',
                description: book.description?.value || 'No description available',
                firstPublished: book.first_publish_year || 'Unknown',
                coverImage: `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
            }));

        return res.status(200).send({
            success: true,
            data: popularBooks
        });
    } catch (error) {
        console.error('Error fetching popular books:', error.message);

        return res.status(500).send({
            success: false,
            message: 'Error fetching popular books',
            error: error.message // Include only relevant error details
        });
    }
};

module.exports = getPopularBooks;
