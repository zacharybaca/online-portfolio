import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Parse "owner/repo" from a GitHub URL
const parseGitHubRepo = (url) => {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1] : null;
};

const ProjectCard = ({ data }) => {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  const repoSlug = parseGitHubRepo(data?.repoLink);
  const [ghStats, setGhStats] = useState(null);

  const resolveImageUrl = (path) => {
    if (!path) return 'https://placehold.co/600x400?text=No+Preview';
    if (path.startsWith('http')) return path;
    return `${apiUrl}/${path.replace(/^\//, '')}`;
  };

  useEffect(() => {
    if (!repoSlug) return;
    let cancelled = false;
    const cacheKey = `gh_stats_${repoSlug}`;

    const loadStats = async () => {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        if (!cancelled) setGhStats(JSON.parse(cached));
        return;
      }
      try {
        const res = await fetch(`https://api.github.com/repos/${repoSlug}`);
        if (!res.ok || cancelled) return;
        const json = await res.json();
        const stats = { stars: json.stargazers_count, language: json.language };
        sessionStorage.setItem(cacheKey, JSON.stringify(stats));
        if (!cancelled) setGhStats(stats);
      } catch {
        // silently fail — stats are decorative
      }
    };

    loadStats();
    return () => { cancelled = true; };
  }, [repoSlug]);

  if (!data) return null;

  const thumbnail = resolveImageUrl(data.imageUrls?.[0]);

  return (
    <div
      className="cell"
      style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}
    >
      <Link to={`/project/${data._id}`} aria-label={`View ${data.title} project`}>
        <img
          src={thumbnail}
          alt={`Screenshot of ${data.title}`}
          className="responsive-image"
          loading="lazy"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      </Link>
      <div className="projects-box" style={{ padding: '15px' }}>
        <Link to={`/project/${data._id}`}>
          <h5 style={{ marginBottom: '10px' }}>{data.title}</h5>
        </Link>

        {/* GitHub stats row */}
        {ghStats && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {ghStats.language && (
              <span title="Primary language">⚙️ {ghStats.language}</span>
            )}
            <span title="GitHub stars">⭐ {ghStats.stars}</span>
          </div>
        )}

        <div
          className="tags"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}
        >
          {data.tags?.map((tag, i) => (
            <span key={i} className="badge" style={{ fontSize: '0.7rem' }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {data.repoLink && (
            <a
              href={data.repoLink}
              target="_blank"
              rel="noreferrer"
              className="badge"
              aria-label={`View source code for ${data.title} on GitHub`}
              style={{ background: '#333', color: 'white', padding: '5px 10px' }}
            >
              Repo
            </a>
          )}
          {data.demoLink && (
            <a
              href={data.demoLink}
              target="_blank"
              rel="noreferrer"
              className="badge"
              aria-label={`View live demo of ${data.title}`}
              style={{ background: '#28a745', color: 'white', padding: '5px 10px' }}
            >
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
