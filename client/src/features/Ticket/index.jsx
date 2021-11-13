import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BookPage from './pages/Book';

TicketFeature.propTypes = {};

function TicketFeature(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ticket/book" />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/book1" element={<h1>helo</h1>} />
      <Route path="/book1/:id" element={<h1>ID</h1>} />
    </Routes>
  );
}

export default TicketFeature;
