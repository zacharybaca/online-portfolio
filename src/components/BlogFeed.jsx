import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom'; // Import Link for navigation

const BlogFeed = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        setBlogPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching blog posts', error);
      });
  }, []); // <--- FIX 1: Empty dependency array (Stops infinite loop)

  return (
    <div className="blog-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {blogPosts.length > 0 ? (
        blogPosts.map(
          (
            blog // <--- FIX 2: Use parenthesis for implicit return
          ) => (
            <Card key={blog._id} style={{ width: '18rem' }}>
              {/* FIX 3: Correct src syntax */}
              <Card.Img
                variant="top"
                src={blog.coverImage || 'https://via.placeholder.com/150'}
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>{blog.summary}</Card.Text>

                {/* Make the button actually go somewhere */}
                <Link to={`/blog/${blog.slug}`}>
                  <Button variant="primary">Read Post</Button>
                </Link>
              </Card.Body>
            </Card>
          )
        )
      ) : (
        <p>No Posts Available</p>
      )}
    </div>
  );
};

export default BlogFeed;
