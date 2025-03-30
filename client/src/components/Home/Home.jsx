import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Pagination from "./Pagination/Pagination";
import "./Home.css";
import Footer from "../Footer/Footer";

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetching random countries from RestCountries API
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        console.log("API Response:", res.data);

        // Converting country data into blog format
        const formattedBlogs = res.data.slice(0, 30).map((country, index) => ({
          _id: index + 1,
          title: country.name.common,
          author: country.region || "Unknown Region",
          image: country.flags?.png || "https://via.placeholder.com/150",
          created_at: new Date().toISOString(), // Random current date
          likes: Array(Math.floor(Math.random() * 100)).fill(0), // Random likes count
          comments: Array(Math.floor(Math.random() * 50)).fill(0), // Random comments count
        }));

        setBlogs(formattedBlogs);
        setTotalPages(Math.ceil(formattedBlogs.length / 3)); // 3 blogs per page
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handlePost = (id) => {
    navigate(`/blog/${id}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="main-heading">Explore Countries as Blogs</h1>
        {loading ? (
          <div className="loader">
            <BallTriangle radius="4px" color="#8b39bb" ariaLabel="loading-indicator" />
          </div>
        ) : (
          <Container>
            {blogs.length > 0 ? (
              blogs.slice((currentPage - 1) * 3, currentPage * 3).map((blog) => {
                return (
                  <Card
                    className="blog-card"
                    key={blog._id}
                    onClick={() => {
                      handlePost(blog._id);
                    }}
                  >
                    {blog.image && <Card.Img variant="top" src={blog.image} />}
                    <Card.Body>
                      <h1>{blog.title}</h1>
                      <div className="blog-info">Region: {blog.author}</div>
                      <div className="blog-info">{new Date(blog.created_at).toDateString()}</div>
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
                );
              })
            ) : (
              <>
                <h1>No Blogs Available</h1>
                <p>Try refreshing the page!</p>
              </>
            )}
          </Container>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <Footer />
    </>
  );
}
