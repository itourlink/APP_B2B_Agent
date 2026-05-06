import { Phone, Mail, MapPin, Facebook, Linkedin } from "lucide-react";
import logo from "../../../public/itourlinkwhitelogo.png";

const Footer = () => {
  return (
    <footer className="bg-[#103E77] text-white py-12 px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="max-w-lg">
            <img src={logo} alt="Itourlink Logo" className="h-12 mb-4 object-contain" />
            <p className="text-sm leading-relaxed">
              Itourlink là nền tảng hàng đầu du lịch, kết nối các nhà điều hành tour, khách sạn và dịch vụ vận chuyển, cung cấp giải pháp công nghệ ưu việt cho trải nghiệm khách hàng.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xl font-bold cursor-pointer hover:text-gray-300">𝕏</span>
            <Facebook className="cursor-pointer hover:text-gray-300" size={20} fill="currentColor" />
            <Linkedin className="cursor-pointer hover:text-gray-300" size={20} fill="currentColor" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/20 pt-10">

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/40 pb-2 inline-block min-w-[100px]">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5" />
                <span>Di Động: 0966 856 780</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5" />
                <span>Email: info@pngsoft.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>Building C VinaConex 2, Kim Van Kim Lu, Hoang Mai Dict, Hanoi, Vietnam</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/40 pb-2 inline-block min-w-[100px]">Company</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <a href="#" className="hover:underline">Tour</a>
              <a href="#" className="hover:underline">Hotel</a>
              <a href="#" className="hover:underline">Boat</a>
              <a href="#" className="hover:underline">Transport</a>
              <a href="#" className="hover:underline">Voucher</a>
              <a href="#" className="hover:underline">Restaurant</a>
              <a href="#" className="hover:underline">Guide Fee</a>
              <a href="#" className="hover:underline">Flight</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/40 pb-2 inline-block min-w-[100px]">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li>Phone Support: +84 966 856 780 (Vietnam)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-white/40 pb-2 inline-block min-w-[100px]">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>Organized Adventure Platform</li>
              <li>Organized Adventure explained</li>
              <li>Connected business solutions</li>
            </ul>
          </div>

        </div>

        <div className="text-center mt-16 text-sm text-white/80">
          © 2025 Itourlink.com | All rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;