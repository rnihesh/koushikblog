import React from 'react'

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <div className="container">
        <p className="display-5 mb-0">FOOTER</p>
        <small>&copy; {new Date().getFullYear()} Blog App</small>
      </div>
    </footer>
  );
}

export default Footer