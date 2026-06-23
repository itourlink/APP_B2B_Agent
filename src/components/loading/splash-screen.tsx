import { motion } from "framer-motion";
import Logo from "../../../public/favicon.png";

const Ripple = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-16 h-16 rounded-full border border-sky-400/40"
    initial={{ scale: 1, opacity: 0 }}
    animate={{
      scale: 4,
      opacity: [0, 0.5, 0],
    }}
    transition={{
      duration: 1.8,
      repeat: Infinity,
      delay,
      ease: "easeOut",
    }}
  />
);

export function SplashScreen() {
  return (
    <div
      className="
        fixed inset-0 z-[999999]
        flex items-center justify-center
        bg-white/20
        backdrop-blur-md
      "
    >
      <div className="relative flex items-center justify-center">
        <Ripple delay={0} />
        <Ripple delay={0.6} />
        <Ripple delay={1.2} />

        <motion.img
          src={Logo}
          alt="Logo"
          className="w-14 h-14 z-10 drop-shadow-lg"
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}