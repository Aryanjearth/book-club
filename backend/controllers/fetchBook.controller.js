exports.fetchBooks = async (req, res) => {
  try {
    let link = req.body.link;
    if (typeof link === 'string') {
      link = link.split(' ').join('+'); // efficient replacement
    }

    const maxResults = 20; // fetch more for sorting

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${link}&maxResults=${maxResults}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();

    if (!data.items) {
      return res.json([]); // no results edge case
    }

    const sortedData = data.items.sort((a, b) => {
      const aHasBuyLink = !!a.saleInfo.buyLink;
      const bHasBuyLink = !!b.saleInfo.buyLink;
      if (aHasBuyLink && !bHasBuyLink) return -1;
      if (!aHasBuyLink && bHasBuyLink) return 1;

      const aRating = a.volumeInfo.averageRating || 0;
      const bRating = b.volumeInfo.averageRating || 0;
      return bRating - aRating;
    });

    const limitedData = sortedData.slice(0, 10);

    const processedData = limitedData.map((doc) => ({
      title: doc.volumeInfo.title,
      authors: doc.volumeInfo.authors || ['Unknown'],
      publishedDate: doc.volumeInfo.publishedDate || 'Unknown',
      imageLinks: {
        smallThumbnail:
          doc.volumeInfo.imageLinks?.smallThumbnail ||
          'https://via.placeholder.com/128x193.png?text=No+Image',
      },
      buyLink: doc.saleInfo.buyLink || 'Not Available',
      description: doc.volumeInfo.description || 'Unknown',
      review: doc.volumeInfo.averageRating || 'No Rating',
    }));

    return res.json(processedData);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'An error occurred' });
  }
};
