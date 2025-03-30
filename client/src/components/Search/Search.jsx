import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "./Search.css";

export default function Search() {
  const navigate = useNavigate();
  const { query } = useParams();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(query || "");

  useEffect(() => {
    if (!query) return; // Empty query handle karo

    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/user/search/${query}`)
      .then((res) => {
        console.log("Search Results:", res.data.blogs);
        const sortedBlogs = res.data.blogs.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ); // Latest blogs first
        setBlogs(sortedBlogs);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false)); // Clean handling
  }, [query]);

  const handlePost = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <>
      <NavBar />
      <div className="search-container">
        <h1 className="main-heading">Results For "{query}"</h1>

        <Form onSubmit={handleSearchSubmit} className="search-form">
          <Form.Control
            type="text"
            placeholder="Search for blogs..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form>

        {loading ? (
          <div className="loader">
            <BallTriangle radius="4px" color="#8b39bb" ariaLabel="loading-indicator" />
          </div>
        ) : (
          <Container>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Card
                  className="blog-card"
                  key={blog._id}
                  onClick={() => handlePost(blog._id)}
                >
                  {blog.cloudinaryId && <Card.Img variant="top" src={blog.image} />}
                  <Card.Body>
                    <h1>{blog.title}</h1>
                    <div className="blog-info">{blog.author}</div>
                    <div className="blog-info">
                      {new Date(blog.created_at).toDateString()}
                    </div>
                    <div className="blog-items">
                      <span>
                        <AiOutlineHeart /> {blog.likes.length} Reactions
                      </span>
                      <span>
                        <FaRegComment /> {blog.comments.length} Comments
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <h2 className="no-blogs">No Blogs Found for "{query}"</h2>
            )}
          </Container>
        )}
      </div>
    </>
  );
}
