import React from 'react';

export default function ToasterItem({
  time,
  title,
  content,
  onMouseOver,
  onMouseLeave,
}: {
  time: number;
  title: string;
  content: string;
  onMouseOver: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className='toaster-container'
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}>
      <div className='title'>{title}</div>
      <div className='progress' style={{ width: `${100 / time}%` }}></div>
      <div className='content'>{content}</div>
    </div>
  );
}
