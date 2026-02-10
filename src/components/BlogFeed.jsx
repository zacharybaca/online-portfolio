import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';

const BlogFeed = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  // 2. Add state to manage the Modal and the Selected Post
  const [modalShow, setModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  // 3. Helper function to handle the click
  const handleReadPost = (blog) => {
    setSelectedPost(blog); // Save the specific blog data
    setModalShow(true); // Open the modal
  };

  return (
    <div className="portfolio-intro">
      {' '}
      {/* Changed container class for better spacing */}
      {/* Top Nav */}
      <nav className="nav" style={{ marginBottom: '20px' }}>
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>
      <div
        className="blog-grid"
        style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {blogPosts.length > 0 ? (
          blogPosts.map((blog) => (
            <Card key={blog._id} className="blog-card" style={{ width: '18rem' }}>
              <Card.Img
                variant="top"
                src={blog.coverImage || 'https://via.placeholder.com/150'}
                style={{ height: '180px', objectFit: 'cover' }}
              />

              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>{blog.summary}</Card.Text>
              </Card.Body>

              <ListGroup className="list-group-flush">
                <ListGroup.Item>📅 {new Date(blog.createdAt).toLocaleDateString()}</ListGroup.Item>
                <ListGroup.Item>
                  🏷️ {blog.tags.length > 0 ? blog.tags.join(', ') : 'No Tags'}
                </ListGroup.Item>
              </ListGroup>

              <Card.Body>
                {/* 4. Changed Link to Button/OnClick */}
                <Button variant="primary" onClick={() => handleReadPost(blog)}>
                  Read Post
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No Posts Available</p>
        )}
      </div>
      {/* Bottom Nav */}
      <nav className="nav" style={{ marginTop: '20px' }}>
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>
      {/* 5. Render the Modal Component */}
      {/* We check if selectedPost exists before trying to access its properties */}
      <BlogPost
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={selectedPost?.title}
        content={selectedPost?.content}
        timestamps={
          selectedPost?.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : ''
        }
      />
    </div>
  );
};

export default BlogFeed;
