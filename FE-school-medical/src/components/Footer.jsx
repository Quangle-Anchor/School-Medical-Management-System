import React from "react";

const Footer = () => (
  <footer className="bg-blue-600 text-white py-8">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p>School Health Office</p>
          <p>Email: schoolhealth@xyz.edu</p>
          <p>Phone: (012) 345-6789</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <a href="#" className="block hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="block hover:underline">
            FAQ
          </a>
          <a href="#" className="block hover:underline">
            Campus Map
          </a>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              Facebook
            </a>
            <a href="#" className="hover:text-gray-300">
              YouTube
            </a>
          </div>
        </div>
      </div>
      <p className="text-center mt-8">
        © 2025 School Health Services. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
