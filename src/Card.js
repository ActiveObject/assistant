import React from 'react';
import './Card.css';

export default function Card({ style, children }) {
  return (
    <div className='Card' style={style}>
      {children}
    </div>
  );
}
