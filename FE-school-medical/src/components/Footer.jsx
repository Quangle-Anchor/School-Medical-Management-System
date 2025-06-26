import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  FileText,
  HelpCircle,
  Map,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-3">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-3">
          {/* Contact Us Section */}
          <div className="mx-auto max-w-xs">
            <h4 className="text-lg font-semibold mb-4 flex items-center justify-start gap-2">
              <Phone size={20} />
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="opacity-90" />
                <span>School Health Office</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="opacity-90" />
                <span>schoolhealth@xyz.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="opacity-90" />
                <span>(012) 345-6789</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mx-auto max-w-xs">
            <h4 className="text-lg font-semibold mb-4 flex items-center justify-start gap-2">
              <FileText size={20} />
              Quick Links
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="#"
                className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                <FileText size={16} className="opacity-90" />
                Privacy Policy
              </a>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                <HelpCircle size={16} className="opacity-90" />
                FAQ
              </a>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                <Map size={16} className="opacity-90" />
                Campus Map
              </a>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="mx-auto max-w-xs text-center">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="bg-blue-400 p-3 rounded-full hover:bg-blue-300 transition-colors shadow-lg"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="bg-blue-400 p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-400 pt-2">
          <p className="text-center text-sm opacity-90 select-none">
            © 2025 School Health Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
