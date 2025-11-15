import React, { useState } from "react";
import { Instagram, Mail, Send, ArrowUp } from "lucide-react";

function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const togglePrivacy = () => setShowPrivacy(!showPrivacy);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-gray-900/80 backdrop-blur-xl text-gray-300 mt-10 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* Brand Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">Smart Buy</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs mx-auto md:mx-0">
              Your one-stop destination for curated, high-quality products.
              We bring you the best deals, always.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-3 text-sm md:text-base">
              <li>
                <a
                  href="/"
                  className="hover:text-white transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <button
                  onClick={togglePrivacy}
                  className="hover:text-white transition duration-300"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Get in Touch</h3>
            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} />
                <a
                  href="mailto:support@smartbuy.com"
                  className="hover:text-white transition duration-300"
                >
                  support@smartbuy.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-5 mt-5">
              <a
                href="https://instagram.com/smartbuy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition duration-300"
              >
                <Instagram size={24} />
              </a>

              <a
                href="https://t.me/smartbuy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition duration-300"
                title="Join us on Telegram"
              >
                <Send size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-6 py-6 text-sm text-gray-500 text-center relative">
          © {new Date().getFullYear()} <span className="text-white">Smart Buy</span>.
          All rights reserved. | Built with ❤️ by the Smart Buy Team

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300 flex items-center justify-center"
            title="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </footer>

      {/* Luxury Privacy Policy Box */}
      {showPrivacy && (
        <div className="fixed bottom-6 right-6 w-96 bg-black/90 text-gray-200 p-6 rounded-2xl shadow-2xl border border-gray-700 z-50 backdrop-blur-md">
          <h4 className="text-white font-bold mb-3 text-lg tracking-wide">Privacy Policy</h4>
          <p className="text-sm leading-relaxed">
            <ol>
              <li>Smart Buy values your privacy — we do not collect, track, or share any personal information.</li>
              <li>We do not collect any personal information from users. We do not use cookies, analytics, or tracking tools.
              </li>
              <li>We may update this Privacy Policy from time to time. Changes will be posted on this page.
              </li>
            </ol>
          </p>
          <button
            onClick={togglePrivacy}
            className="mt-4 text-sm text-yellow-400 hover:text-yellow-300 underline transition duration-300"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default Footer;
