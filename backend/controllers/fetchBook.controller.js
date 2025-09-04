exports.fetchBooks = async (req, res) => {
    try {
        let link = req.body.link; 
        console.log(link);
        if (typeof link === 'string') {
            link = link.replaceAll(' ', '+');
        }

        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${link}`, {
            method: 'GET',
        });

        const data = await response.json();

        // Sort data to prioritize books with a buyLink, then by average rating
        const sortedData = data.items.sort((a, b) => {
            const aHasBuyLink = a.saleInfo.buyLink;
            const bHasBuyLink = b.saleInfo.buyLink;

            const aRating = a.volumeInfo.averageRating || 0; // Default to 0 if no rating
            const bRating = b.volumeInfo.averageRating || 0; // Default to 0 if no rating

            // Sort by buyLink first, then by rating
            // if (aHasBuyLink && !bHasBuyLink) return -1;
            // if (!aHasBuyLink && bHasBuyLink) return 1;
            
            return 0;
        });

        // Limit the data to the first 10 results
        const limitedData = sortedData.slice(0, 10);

        // Extract necessary information
        const processedData = limitedData.map(doc => ({
            title: doc.volumeInfo.title,
            authors: doc.volumeInfo.authors ? doc.volumeInfo.authors : ['Unknown'],
            publishedDate: doc.volumeInfo.publishedDate ? doc.volumeInfo.publishedDate : 'Unknown',
            imageLinks: {
                smallThumbnail: doc.volumeInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x193.png?text=No+Image',
            },
            buyLink: doc.saleInfo.buyLink || 'Not Available',
            description: doc.volumeInfo.description || "Unknown",
            review: doc.volumeInfo.averageRating || 'No Rating',
           
        }));

        res.json(processedData); // Sends the cleaned data back to the client as JSON

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "An error occurred",
        });
    }
};
