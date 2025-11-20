import React from 'react';

const TimelineSection = ({ section, progress }) => {
  const { start, end } = section;
  const visibleProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);
  const isActive = progress >= start && progress <= end;

  const style = {
    '--accent': section.accent || '#ffffff',
    '--reveal': visibleProgress,
    opacity: Math.max(0.25, visibleProgress),
    transform: `translateY(${12 - visibleProgress * 12}px) scale(${0.98 + visibleProgress * 0.02})`
  };

  return (
    <article id={section.id} className={`timeline-card ${isActive ? 'is-active' : ''}`} style={style}>
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
