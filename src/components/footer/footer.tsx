import logoFooter from "@/assets/images/auth/logo-itoursys-white.png";
import {
  Phone,
  Info,
  Headphones,
  BookOpen,
  Home,
  Send,
  Facebook,
  Youtube,
  MessageCircle,
  Mail,
  Share2,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-linear-to-r from-[#2c5aa0] to-[#3b7cc4] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center border-b border-white/20 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-50">
              <img src={logoFooter} alt="logo" className="w-full h-full" />
            </div>
            <div>
              <div className="font-semibold text-md">
                Nền tảng Kết nối du lịch doanh nghiệp
              </div>
              <div className="text-xs text-white/80">
                Đại diện: Ông Lê Dương Phụng
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-75">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-sm text-white/80">Hotline</div>
              <div className="text-xl font-semibold">0966 856 780</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10">
          <div>
            <div className="font-semibold mb-4 flex items-center gap-2">
              <Info size={16} /> Về Chúng Tôi
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>› Giới thiệu</li>
              <li>› Chính sách bảo mật</li>
              <li>› Điều khoản và điều kiện</li>
              <li>› Quy chế hoạt động</li>
              <li>› Cơ chế giải quyết tranh chấp phát sinh</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-4 flex items-center gap-2">
              <Headphones size={16} /> Hỗ Trợ
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>› Liên hệ chúng tôi</li>
              <li>› Trung tâm trợ giúp</li>
            </ul>

            <div className="font-semibold mt-6 mb-4 flex items-center gap-2">
              <BookOpen size={16} /> Hướng Dẫn
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>› Hướng dẫn đăng ký</li>
              <li>› Hướng dẫn đăng nhập</li>
            </ul>
          </div>

          <div className="ml-auto w-[300px]">
            <div className="font-semibold mb-4 flex items-center gap-2">
              <Home size={16} /> Đăng Ký Nhận Thông Tin Mới
            </div>

            <div className="flex gap-2 mb-6">
              <input
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 placeholder:text-white/60 outline-none"
              />
              <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30">
                <Send size={16} />
              </button>
            </div>

            <div className="font-semibold mb-4 flex items-center gap-2">
              <Share2 size={16} /> Theo Dõi Chúng Tôi
            </div>

            <div className="flex gap-3">
              {[Facebook, Youtube, MessageCircle, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer transition"
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-white/70 border-t border-white/20 py-4 bg-[#246fb9]">
        Copyright © 2025 ITourLink - All rights reserved · Legal Notice · Privacy
        Policy · Cookie Policy · Terms & Conditions
      </div>
    </div>
  );
};

export default Footer;