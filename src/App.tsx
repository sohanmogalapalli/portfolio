import { motion } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import GithubStats from "@/components/sections/GithubStats";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import AchievementAtlas from "@/components/Atlas/AchievementAtlas";

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-base overflow-x-clip"
    >
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-base focus:text-term-green focus:px-4 focus:py-2 focus:rounded-lg focus:border focus:border-term-green"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <About />
        <AchievementAtlas />
        <Skills />
        <Projects />
        <GithubStats />
        <Contact />
      </main>

      <Footer />
    </motion.div>
  );
}
