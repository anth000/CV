import React from 'react';

const TimelineSection = ({ section, progress }) => {
  const { start, end } = section;
  const visibleProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);
  const isActive = progress >= start && progress <= end;

  return (
    <article className={`timeline-card ${isActive ? 'is-active' : ''}`}>
      <div className="card-header">
        <span className="card-phase">{section.phase}</span>
        <span className="card-range">{section.range}</span>
      </div>
      <div className="card-body">
        <h3>{section.title}</h3>
        <p>{section.content}</p>
        <ul className="card-tags">
          {section.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <div className="card-progress">
        <span style={{ transform: `scaleX(${visibleProgress})` }} />
      </div>
    </article>
  );
};

export default TimelineSection;
