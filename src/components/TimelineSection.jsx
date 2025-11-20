import React from 'react';

const TimelineSection = ({ section, progress }) => {
  const { start, end, icon: Icon } = section;
  const visibleProgress = Math.min(Math.max((progress - start) / (end - start), 0), 1);
  const isActive = progress >= start && progress <= end;

  const style = {
    '--accent': section.accent || '#ffffff',
    '--reveal': visibleProgress,
    opacity: Math.max(0.35, visibleProgress + 0.2),
    transform: `translateY(${18 - visibleProgress * 18}px) scale(${0.96 + visibleProgress * 0.04})`
  };

  return (
    <article id={section.id} className={`timeline-card ${isActive ? 'is-active' : ''}`} style={style}>
      <div className="card-ribbon" />
      <div className="card-header">
        <div className="card-icon" aria-hidden>
          {Icon ? <Icon size={24} /> : null}
        </div>
        <div>
          <p className="card-phase">{section.phase}</p>
          <p className="card-range">{section.range}</p>
        </div>
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
