import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Blog.css";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/blogs")
            .then((response) => {
                setBlogs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
            });
    }, []);

    return (
        <div className="blog-container">
            {blogs.length === 0 ? (
                <p>Loading blogs...</p>
            ) : (
                blogs.map((blog, index) => (
                    <div key={index} className="blog-card">
                        <h2>{blog.title}</h2>
                        <img src={blog.image} alt={blog.title} />
                        <p>{blog.content}</p>
                        <p><strong>Author:</strong> {blog.author}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Blog;
