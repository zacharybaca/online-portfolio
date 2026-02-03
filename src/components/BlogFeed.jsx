import { useEffect, useState } from 'react';

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
            })
    }, [blogPosts])

    return (
        <div>
            Blog Posts
        </div>
    )
}

export default BlogFeed;
