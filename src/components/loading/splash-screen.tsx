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
      duration: 1.5,
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
      <div className="relative flex flex-col items-center">
        <Ripple delay={0} />
        <Ripple delay={0.4} />
        <Ripple delay={0.8} />

        <motion.div
          className="text-gray-700"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
        >
          Loading...
        </motion.div>
      </div>
    </div>
  );
}