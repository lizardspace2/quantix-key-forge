import { motion } from "framer-motion";

const QuantumGrid = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-black">
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10 opacity-80" />

      {/* Hexagonal Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%232dd4bf' stroke-width='1' stroke-opacity='0.2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />

      {/* Animated Matrix/Quantum Rain - Subtle Vertical Lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"
          style={{
            left: `${15 + i * 15}%`,
            opacity: 0.1
          }}
          animate={{
            y: [-1000, 1000],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}

      {/* Floating Quantum Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary box-shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px var(--primary)'
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Large Nebula Glows */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen"
        style={{
          background: "radial-gradient(circle, hsl(185 100% 50% / 0.15), transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen"
        style={{
          background: "radial-gradient(circle, hsl(165 100% 45% / 0.1), transparent 70%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Scanner Effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"
        animate={{
          top: ["0%", "100%"],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
      />
    </div>
  );
};

export default QuantumGrid;
