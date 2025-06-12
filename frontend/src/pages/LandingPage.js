import React from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';
import Footer from '../components/layout/Footer';

const notableAlumni = [
    { name: 'Priya Sharma', batch: '2010', achievement: 'CEO of TechSolutions Inc.' },
    { name: 'Amit Singh', batch: '2008', achievement: 'Lead Scientist at BioGen Labs' },
    { name: 'Anjali Verma', batch: '2012', achievement: 'Award-winning Documentary Filmmaker' },
];

const AnimatedSection = ({ children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, 
        threshold: 0.1, 
    });

    return (
        <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
};

export default function LandingPage() {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative bg-primary text-white text-center py-20 lg:py-40 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-primary opacity-80 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Welcome to the</h1>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-secondary mt-2">MN Jha DAV Alumni Portal</h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-primary-light">
                        Connect with fellow alumni, share opportunities, and stay in touch with your alma mater.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/register" className="bg-secondary text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                            Get Started
                        </Link>
                        <Link to="/login" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-primary transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* About DAV JJP Section */}
            <section id="about" className="py-20 px-4">
                <AnimatedSection>
                    <div className="container mx-auto max-w-5xl text-center">
                        <h3 className="text-4xl font-bold text-on-surface mb-4">About MN Jha D.A.V. Public School, Jhanjharpur</h3>
                        <p className="text-muted text-lg leading-relaxed">
                            MN Jha D.A.V. Public School, located in the heart of Jhanjharpur, has been a beacon of knowledge and character development for decades. Our institution is committed to providing a holistic education that blends rigorous academic training with moral and ethical values, preparing students not just for careers, but for life. We foster an environment of curiosity, creativity, and compassion, empowering our students to become responsible global citizens and leaders of tomorrow.
                        </p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-surface rounded-xl shadow-lg"><AcademicCapIcon className="h-12 w-12 mx-auto text-primary" />
                                <h4 className="text-xl font-bold mt-4">Academic Excellence</h4><p className="text-muted mt-2">A tradition of outstanding results and holistic learning.</p></div>
                            <div className="p-6 bg-surface rounded-xl shadow-lg"><UserGroupIcon className="h-12 w-12 mx-auto text-primary" />
                                <h4 className="text-xl font-bold mt-4">Strong Community</h4><p className="text-muted mt-2">Building lifelong bonds between students, faculty, and alumni.</p></div>
                            <div className="p-6 bg-surface rounded-xl shadow-lg"><GlobeAltIcon className="h-12 w-12 mx-auto text-primary" />
                                <h4 className="text-xl font-bold mt-4">Global Citizens</h4><p className="text-muted mt-2">Nurturing leaders with a sense of social responsibility.</p></div>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* Notable Alumni Section */}
            <section id="notable-alumni" className="py-20 px-4 bg-gray-100">
                <AnimatedSection>
                    <div className="container mx-auto max-w-5xl text-center">
                        <h3 className="text-4xl font-bold text-on-surface mb-12">Our Notable Alumni</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {notableAlumni.map((alumnus, index) => (
                                <div key={index} className="bg-surface p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                                    <h4 className="text-xl font-bold text-primary">{alumnus.name}</h4>
                                    <p className="text-sm font-semibold text-muted">Batch of {alumnus.batch}</p>
                                    <p className="mt-3 text-on-surface">{alumnus.achievement}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
