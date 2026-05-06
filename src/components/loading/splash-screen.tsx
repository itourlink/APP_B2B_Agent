import { motion } from "framer-motion";
import Logo from "../../../public/favicon.png";

const Ripple = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute rounded-full border border-sky-400/40 w-16 h-16"
    initial={{ scale: 1, opacity: 0 }}
    animate={{
      scale: 4,
      opacity: [0, 0.6, 0]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: delay,
      ease: "easeOut",
    }}
  />
);

export function SplashScreen() {
  return (
    <div className="min-h-screen flex justify-center items-center 
      bg-[radial-gradient(circle_at_center,#075985_0%,#020617_80%)] overflow-hidden">

      <div className="relative flex justify-center items-center">
        {/* Các vòng tỏa ra liên tục với nhịp nhanh */}
        <Ripple delay={0} />
        <Ripple delay={0.4} />
        <Ripple delay={0.8} />
        <Ripple delay={1.2} />

        {/* Logo chính */}
        <motion.img
          alt="Logo"
          src={Logo}
          className="w-16 h-16 z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.6)]"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}