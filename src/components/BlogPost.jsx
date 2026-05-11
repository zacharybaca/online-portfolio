import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BlogPost = (props) => {
  return (
    <Modal {...props} size="lg" centered className="blog-post-modal">
      <Modal.Header
        closeButton
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Modal.Title style={{ fontFamily: 'Modern' }}>{props.title || 'Entry'}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8',
            marginBottom: '30px',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          {props.content || 'No content available.'}
        </div>
        <hr style={{ borderColor: 'var(--border-color)' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'right' }}>
          Published on: {props.timestamps}
        </p>
      </Modal.Body>
      <Modal.Footer
        style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlogPost;
