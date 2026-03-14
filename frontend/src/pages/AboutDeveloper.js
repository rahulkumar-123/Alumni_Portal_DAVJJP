import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  UserGroupIcon,
  TrophyIcon,
  CalendarIcon,
  StarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  SparklesIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import aboutData from "../data/about-data.json";

// ── Animations ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  hover: { scale: 1.02, y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", transition: { duration: 0.3 } },
};
const slideInVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};
const teamMemberVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, type: "spring", stiffness: 100 } },
  hover: { y: -8, scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.5)", transition: { duration: 0.3 } },
};
const socialVariants = {
  hidden: { opacity: 0, y: 10, scale: 0 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: 0.5 + i * 0.1, duration: 0.4, type: "spring" } }),
};

// ── Animated Counter ──
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      const startTime = Date.now();
      const updateCounter = () => {
        const progress = Math.min((Date.now() - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * parseInt(end)));
        if (progress < 1) requestAnimationFrame(updateCounter);
      };
      updateCounter();
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Icons ──
const getIcon = (iconName, className = "w-6 h-6") => {
  const icons = {
    users: UserGroupIcon, trophy: TrophyIcon, calendar: CalendarIcon, star: StarIcon,
    chart: ChartBarIcon, message: ChatBubbleLeftRightIcon, briefcase: BriefcaseIcon,
    academic: AcademicCapIcon, heart: HeartIcon, sparkles: SparklesIcon,
    code: CodeBracketIcon, globe: GlobeAltIcon, phone: PhoneIcon, envelope: EnvelopeIcon, location: MapPinIcon,
  };
  const Icon = icons[iconName] || SparklesIcon;
  return <Icon className={className} />;
};

const getSocialIcon = (platform, className = "w-5 h-5") => {
  const icons = {
    github: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>,
    linkedin: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" /></svg>,
    instagram: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.252 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/></svg>,
    website: <GlobeAltIcon className={className} />,
  };
  return icons[platform] || <ArrowTopRightOnSquareIcon className={className} />;
};

const AnimatedSection = ({ children, className = "", variants = containerVariants }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1, margin: "-10%" });
  const controls = useAnimation();
  useEffect(() => { if (inView) controls.start("visible"); }, [controls, inView]);
  return <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>{children}</motion.div>;
};

// ── Main Page Component ──
export default function AboutDeveloper() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const [activeTab, setActiveTab] = useState("developers");
  const tabs = [
    { id: "institution", label: "Institution", icon: "academic" },
    { id: "developers", label: "Developers", icon: "users" },
    { id: "project", label: "Project", icon: "code" },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#ffc14a] to-secondary origin-left z-50" style={{ scaleX: useScroll().scrollYProgress }} />

      {/* ── HERO ── */}
      <motion.section className="relative pt-12 sm:pt-20 pb-16 px-4 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(245,166,35,0.08)_0%,transparent_100%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.2, ease: "backOut" }} className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border border-primary/20 rounded-full">
              <SparklesIcon className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: "'Fraunces', serif" }} variants={fadeInUpVariants} initial="hidden" animate="visible">
            {aboutData.heroSection.title}
          </motion.h1>

          <motion.p className="text-lg sm:text-xl text-primary font-medium mb-4 max-w-4xl mx-auto" variants={fadeInUpVariants} initial="hidden" animate="visible">
            {aboutData.heroSection.subtitle}
          </motion.p>

          <motion.p className="text-base sm:text-lg text-muted mb-12 max-w-3xl mx-auto leading-relaxed" variants={fadeInUpVariants} initial="hidden" animate="visible">
            {aboutData.heroSection.description}
          </motion.p>

          {/* Stats */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
            {aboutData.heroSection.stats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="p-6 bg-surface border border-white/5 rounded-2xl flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 text-primary">
                  {getIcon(stat.icon, "w-6 h-6")}
                </div>
                <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  <AnimatedCounter end={stat.value.replace(/[^0-9]/g, "")} suffix={stat.value.replace(/[0-9]/g, "")} />
                </div>
                <div className="text-sm font-medium text-muted uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── TABS ── */}
      <AnimatedSection className="px-4 mb-12">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="flex items-center justify-center gap-2 bg-surface/80 border border-white/10 rounded-full p-2 backdrop-blur-md w-full sm:w-auto overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary text-black shadow-lg" : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {getIcon(tab.icon, "w-5 h-5")}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── DEVELOPERS SECTION ── */}
      {activeTab === "developers" && (
        <AnimatedSection className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{aboutData.aboutDevelopers.title}</h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">{aboutData.aboutDevelopers.description}</p>
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" variants={containerVariants}>
              {aboutData.aboutDevelopers.team.map((member, i) => (
                <motion.div key={i} variants={teamMemberVariants} whileHover="hover" className="bg-surface border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=f5a623&color=000`} alt={member.name} className="w-24 h-24 rounded-full border-2 border-primary/50 object-cover relative z-10 mx-auto" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>{member.name}</h3>
                  <p className="text-primary font-medium mb-4 text-sm uppercase tracking-wide">{member.role}</p>
                  <p className="text-muted text-sm leading-relaxed mb-6">{member.description}</p>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {member.expertise.map((skill, si) => (
                      <span key={si} className="px-3 py-1 bg-white/5 border border-white/10 text-white text-xs font-medium rounded-full">{skill}</span>
                    ))}
                  </div>

                  {member.social && (
                    <div className="flex justify-center gap-4 relative z-20">
                      {Object.entries(member.social).map(([platform, link], i) => (
                        link && link !== "#" && (
                          <motion.a key={platform} href={link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded-full flex items-center justify-center text-muted transition-all" variants={socialVariants} custom={i} whileHover={{ scale: 1.1 }}>
                            {getSocialIcon(platform)}
                          </motion.a>
                        )
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Timeline */}
            <div className="bg-surface border border-white/5 rounded-3xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: "'Fraunces', serif" }}>Development Timeline</h3>
              <div className="space-y-4">
                {aboutData.aboutDevelopers.developmentProcess.map((phase, i) => (
                  <motion.div key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <div className="w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0" style={{ fontFamily: "'Fraunces', serif" }}>{i + 1}</div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-lg font-bold text-white mb-1">{phase.phase}</h4>
                      <p className="text-sm text-muted">{phase.description}</p>
                    </div>
                    <div className="text-primary font-mono text-sm bg-primary/10 px-4 py-2 rounded-full">{phase.duration}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ── INSTITUTION SECTION ── */}
      {activeTab === "institution" && (
        <AnimatedSection className="px-4 mb-20 text-center sm:text-left">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div className="bg-surface border border-white/5 rounded-3xl p-8 sm:p-12" variants={itemVariants}>
              <div className="inline-flex w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-6 text-primary border border-primary/20"><AcademicCapIcon className="w-8 h-8" /></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{aboutData.aboutInstitution.title}</h2>
              <p className="text-lg text-muted max-w-4xl">{aboutData.aboutInstitution.description}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div className="bg-surface border border-white/5 rounded-3xl p-8" variants={itemVariants}>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Our History</h3>
                <p className="text-muted leading-relaxed">{aboutData.aboutInstitution.history}</p>
              </motion.div>
              <motion.div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-3xl p-8 flex flex-col justify-center" variants={itemVariants}>
                <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Our Vision</h3>
                <p className="text-white/90 leading-relaxed text-lg italic">"{aboutData.aboutInstitution.vision}"</p>
              </motion.div>
            </div>

            <motion.div className="bg-surface border border-white/5 rounded-3xl p-8 sm:p-12 text-center" variants={itemVariants}>
              <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Fraunces', serif" }}>Key Achievements</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {aboutData.aboutInstitution.achievements.map((ach, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-center gap-3">
                    <TrophyIcon className="w-5 h-5 text-primary" />
                    <span className="text-white text-sm font-medium">{ach}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      )}

      {/* ── PROJECT SECTION ── */}
      {activeTab === "project" && (
        <AnimatedSection className="px-4 mb-20 text-center">
          <div className="max-w-7xl mx-auto space-y-12">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>{aboutData.aboutProject.title}</h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">{aboutData.aboutProject.description}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.aboutProject.features.map((feat, i) => (
                <motion.div key={i} variants={cardVariants} whileHover="hover" className="bg-surface border border-white/5 rounded-2xl p-8 flex flex-col items-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">{getIcon(feat.icon, "w-7 h-7")}</div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Fraunces', serif" }}>{feat.title}</h3>
                  <p className="text-muted text-sm">{feat.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-surface border border-white/5 rounded-3xl p-10 mt-12">
              <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Fraunces', serif" }}>Tech Stack</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {aboutData.aboutProject.technologies.map((tech, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 px-5 py-3 rounded-full flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: tech.color }}></div>
                    <span className="text-white text-sm font-medium">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ── CTA / CONTACT ── */}
      <AnimatedSection className="px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-surface to-surface border border-primary/20 rounded-3xl p-10 sm:p-16 text-center shadow-2xl">
          <EnvelopeIcon className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Get in Touch</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">{aboutData.contactInfo.description}</p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <span className="flex items-center gap-2 text-white bg-white/5 px-4 py-2 rounded-full border border-white/10"><EnvelopeIcon className="w-5 h-5 text-primary" /> {aboutData.contactInfo.email}</span>
            <span className="flex items-center gap-2 text-white bg-white/5 px-4 py-2 rounded-full border border-white/10"><PhoneIcon className="w-5 h-5 text-primary" /> {aboutData.contactInfo.phone}</span>
          </div>
          <a href={`mailto:${aboutData.contactInfo.email}`} className="inline-block bg-primary text-black font-semibold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:bg-[#ffc14a] transition-all hover:-translate-y-1">
            Send a Message ↗
          </a>
        </div>
      </AnimatedSection>
    </div>
  );
}
