import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const BlogContainer = styled.div`
  padding: 80px 20px;
  background-color: #390000;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BlogPostWrapper = styled.div`
  background-color: black;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-wrap: break-word; // Ensure long words wrap properly
  max-height: 400px;         // Set a maximum height for the entire blog post box
  overflow-y: auto;          // Add vertical scrolling for overflowing content
`;


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow-wrap: break-word; // Ensure long words wrap properly
  max-height: 300px;         // Set a maximum height for content
  overflow-y: auto;          // Add vertical scrolling for overflowing content
`;


const PostFormWrapper = styled.div`
  background-color: black;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  width: 80%;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: none;
  max-height: 50px;  // Set a maximum height for the input box
  overflow-y: auto;  // Add vertical scroll if content exceeds max-height
  resize: none;  // Prevent resizing of the input field
`;


const FormTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: none;
  max-height: 200px;  // Ensure this matches your design constraints
  overflow-y: auto;   // Add vertical scrolling for excess text
  resize: none;       // Prevent manual resizing
`;


const FormButton = styled.button`
  background-color: #610000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b22222;
  }
`;

const SearchBarWrapper = styled.div`
  margin: 20px 0;
  width: 80%;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  background-color: #610000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b22222;
  }
`;

const BlogPost = ({ post, onDelete }) => {
  const userId = localStorage.getItem('userId');

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      onDelete(userId, post._id);
    }
  };

  return (
    <BlogPostWrapper>
      <ContentWrapper>
        <h2>{post.Title}</h2>
        <p>{post.Content}</p>
        <small>by {post.Author}</small>
        <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
      </ContentWrapper>
      <FormButton onClick={handleDelete} style={{ alignSelf: 'flex-end' }}>
        Delete
      </FormButton>
    </BlogPostWrapper>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    Title: '',
    Content: '',
    Author: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBlogs, setShowBlogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    if (!userId) {
      setError('User not authenticated. Please log in first.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8888/book_worms/api/v1/auth/getAllBlogs',
        { originalCreatorId: userId }
      );
      setPosts(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error.response || error);
      setError(error.response ? error.response.data.message : 'Failed to fetch blog posts.');
    }
  };

  const handleSearch = async () => {
    if (!userId) {
      setError('User not authenticated. Please log in first.');
      return;
    }
  
    if (!searchQuery.trim()) {
      alert('Please enter a title or description to search.');
      return;
    }
  
    try {
      // Send search query to fetch posts based on Title
      const response = await axios.post(
        'http://localhost:8888/book_worms/api/v1/auth/searchedBlogs',
        { Title: searchQuery } // Send search query
      );
  
      let filteredPosts = response.data.data || [];
  
      // Normalize the search query to lowercase for case-insensitive comparison
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
  
      // Filter posts that contain the search term (case-insensitive) in Title or Content
      filteredPosts = filteredPosts.filter(post => {
        const lowerCaseTitle = post.Title.toLowerCase();  // Convert Title to lowercase
        const lowerCaseContent = post.Content.toLowerCase();  // Convert Content to lowercase
        return lowerCaseTitle.includes(lowerCaseSearchQuery) || lowerCaseContent.includes(lowerCaseSearchQuery);
      });
  
      // Set the filtered posts as the result
      setPosts(filteredPosts.length > 0 ? filteredPosts : []);
      setError(null);
    } catch (error) {
      console.error('Error searching posts:', error.response || error);
      setError(error.response ? error.response.data.message : 'Failed to search blog posts.');
    }
  };
    

  const toggleShowBlogs = async () => {
    if (!showBlogs) {
      // Fetch all blogs only when enabling "Show Blogs"
      await fetchPosts();
    }
    setShowBlogs(!showBlogs);
    setSearchQuery(''); // Clear search query when toggling back to show all blogs
  };
  const handleDeletePost = async (userId, blogId) => {
    try {
      const response = await axios.post(
        'http://localhost:8888/book_worms/api/v1/auth/deleteBlogs',
        { userId, blogId }  // Send both userId and blogId to the backend
      );

      if (response.data.success) {
        setPosts(posts.filter((post) => post._id !== blogId));  // Remove deleted post from state
        alert('Blog post deleted successfully!');
      } else {
        alert(response.data.message || 'Failed to delete the blog post.');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error.response || error);
      alert(error.response ? error.response.data.message : 'Failed to delete the blog post.');
    }
  };
  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
   
    if (!newPost.Title.trim() || !newPost.Content.trim() || !newPost.Author.trim()) {
      setLoading(false);
      alert('All fields must be filled with valid content.');
      return;
    }

    if (!userId) {
      setLoading(false);
      alert('User not authenticated. Please log in first.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8888/book_worms/api/v1/auth/blogCreate',
        { ...newPost, originalCreatorId: userId }
      );

      if (response.status === 201 && response.data.data) {
        setPosts([response.data.data, ...posts]);
        setNewPost({ Title: '', Content: '', Author: '' });
        alert('Blog post created successfully!');
      } else {
        alert(response.data.message || 'Failed to create the blog post.');
      }
    } catch (error) {
      console.error('Error submitting post:', error.response || error);
      setError(error.response ? error.response.data.message : 'Failed to create the blog post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  return (
    <BlogContainer>
      <h1>My Life, My Blog!</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={toggleShowBlogs}
        style={{
          backgroundColor: '#610000',
          color: 'white',
          padding: '10px 20px',
          margin: '10px 0',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {showBlogs ? 'Hide Blog Posts' : 'Show Blog Posts'}
      </button>

      <SearchBarWrapper>
        <SearchInput
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchBarWrapper>

      {showBlogs && posts.length === 0 && <p>No blog posts available.</p>}
      {showBlogs &&
        posts.map((post, index) => (
          <BlogPost key={index} post={post} onDelete={handleDeletePost} />
        ))}

      <PostFormWrapper>
        <h2>Submit Your Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="Title"
            placeholder="Title"
            value={newPost.Title}
            onChange={handleChange}
          />
          <FormTextArea
            name="Content"
            placeholder="Content"
            rows="5"
            value={newPost.Content}
            onChange={handleChange}
          />
          <FormInput
            type="text"
            name="Author"
            placeholder="Author"
            value={newPost.Author}
            onChange={handleChange}
          />
          <FormButton type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </FormButton>
        </form>
      </PostFormWrapper>
    </BlogContainer>
  );
};

export default Blog;