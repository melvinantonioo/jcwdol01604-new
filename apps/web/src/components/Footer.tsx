"use client";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t text-gray-600 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* 🔥 Grid Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">

          {/* Dukungan */}
          <div>
            <h3 className="font-bold text-gray-900">Dukungan</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="#" className="hover:underline">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:underline">AirCover</Link></li>
              <li><Link href="#" className="hover:underline">Keamanan</Link></li>
              <li><Link href="#" className="hover:underline">Dukungan Disabilitas</Link></li>
            </ul>
          </div>

          {/* Komunitas */}
          <div>
            <h3 className="font-bold text-gray-900">Komunitas</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="#" className="hover:underline">Airbnb.org</Link></li>
              <li><Link href="#" className="hover:underline">Program Referral</Link></li>
              <li><Link href="#" className="hover:underline">Dukungan Keberlanjutan</Link></li>
            </ul>
          </div>

          {/* Airbnb */}
          <div>
            <h3 className="font-bold text-gray-900">Airbnb</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="#" className="hover:underline">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:underline">Berita</Link></li>
              <li><Link href="#" className="hover:underline">Karier</Link></li>
              <li><Link href="#" className="hover:underline">Investor</Link></li>
            </ul>
          </div>

          {/* Media Sosial */}
          <div>
            <h3 className="font-bold text-gray-900">Ikuti Kami</h3>
            <div className="flex space-x-4 mt-3">
              <a href="#" className="hover:text-blue-600"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-pink-600"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-blue-400"><FaTwitter size={20} /></a>
            </div>
          </div>

        </div>

        {/* 🔥 Copyright & Legal */}
        <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2024 Airbnb Clone. Semua Hak Dilindungi.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <Link href="#" className="hover:underline">Privasi</Link>
            <Link href="#" className="hover:underline">Persyaratan</Link>
            <Link href="#" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;