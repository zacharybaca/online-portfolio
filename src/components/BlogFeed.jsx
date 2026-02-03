import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

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
  }, []);

  return (
    <div
      className="blog-grid"
      style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {blogPosts.length > 0 ? (
        blogPosts.map((blog) => (
          <Card key={blog._id} className="blog-card" style={{ width: '18rem' }}>
            {/* 1. IMAGE */}
            <Card.Img
              variant="top"
              src={blog.coverImage || 'https://via.placeholder.com/150'}
              style={{ height: '180px', objectFit: 'cover' }}
            />

            {/* 2. TITLE & SUMMARY */}
            <Card.Body>
              <Card.Title>{blog.title}</Card.Title>
              <Card.Text>{blog.summary}</Card.Text>
            </Card.Body>

            {/* 3. DETAILS LIST (Replaced "Cras justo odio" with real data) */}
            <ListGroup className="list-group-flush">
              <ListGroup.Item>📅 {new Date(blog.createdAt).toLocaleDateString()}</ListGroup.Item>
              <ListGroup.Item>
                🏷️ {blog.tags.length > 0 ? blog.tags.join(', ') : 'No Tags'}
              </ListGroup.Item>
            </ListGroup>

            {/* 4. LINK AT BOTTOM */}
            <Card.Body>
              {/* using 'as={Link}' makes the Bootstrap Card.Link work with React Router */}
              <Card.Link as={Link} to={`/blog/${blog.slug}`}>
                Read Post
              </Card.Link>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No Posts Available</p>
      )}
    </div>
  );
};

export default BlogFeed;
