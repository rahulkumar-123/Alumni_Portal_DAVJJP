import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const alumni = [
    { name: 'Rahul Kumar', batch: '2019', role: 'Lead Developer', initial: 'R', color: '#f5a623', quote: 'Building this network has been a journey. The foundation I got at DAV shaped everything that followed.' },
    { name: 'Rohan Jha', batch: '2019', role: 'Alumni', initial: 'R', color: '#ff6b1a', quote: 'The platform has made alumni engagement seamless and effective. Proud DAVian forever.' },
    { name: 'Raajesh Kumar', batch: '2019', role: 'Full Stack Dev', initial: 'R', color: '#3dffa0', quote: 'Finally, a platform that keeps me connected with my alma mater and fellow alumni. The user experience is exceptional!' },
    { name: 'Deepa', batch: '2020', role: 'Alumni', initial: 'D', color: '#8344AD', quote: 'I was able to find incredible mentorship through this portal. Amazing to see seniors helping newer batches.' },
    { name: 'Nikunj', batch: '2016', role: 'Alumni', initial: 'N', color: '#4ADAD2', quote: 'Reconnecting with old classmates has never been easier. Outstanding initiative by the school.' },
];

// Scroll-reveal hook
function useReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('lp-visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        el.querySelectorAll('.lp-reveal').forEach(child => obs.observe(child));
        return () => obs.disconnect();
    }, []);
    return ref;
}

export default function LandingPage() {
    const pageRef = useReveal();

    return (
        <div className="lp" ref={pageRef}>
            {/* ── HERO ── */}
            <section className="lp-hero">
                <div className="lp-hero-bg" />
                <div className="lp-hero-grid" />

                <div className="lp-hero-eyebrow">Alumni Network Live</div>

                <h1 className="lp-hero-headline">
                    <span className="lp-line-break">Once a</span>
                    <em className="lp-line-break">DAVian,</em>
                    <span className="lp-line-break">Always.</span>
                </h1>

                <p className="lp-hero-sub">
                    The official alumni portal for MN Jha DAV Public School, Jhanjharpur.
                    Reconnect with classmates, share your journey, build your legacy.
                </p>

                <div className="lp-hero-actions">
                    <Link to="/register" className="lp-btn-primary">Join the Network ↗</Link>
                    <Link to="/login" className="lp-btn-ghost">Sign In</Link>
                </div>

                <div className="lp-scroll-hint">
                    <span>Scroll</span>
                    <div className="lp-scroll-line" />
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <div className="lp-stats-strip">
                <div className="lp-stats-track">
                    {[1, 2].map(i => (
                        <React.Fragment key={i}>
                            <div className="lp-stat-item"><div className="lp-stat-num">170+</div><div className="lp-stat-label">Alumni<br/>Connected</div></div>
                            <div className="lp-stat-item"><div className="lp-stat-num">15+</div><div className="lp-stat-label">Batch<br/>Years</div></div>
                            <div className="lp-stat-item"><div className="lp-stat-num">50+</div><div className="lp-stat-label">Stories<br/>Shared</div></div>
                            <div className="lp-stat-item"><div className="lp-stat-num">DAV</div><div className="lp-stat-label">Legacy<br/>Network</div></div>
                            <div className="lp-stat-item"><div className="lp-stat-num">24/7</div><div className="lp-stat-label">Connected<br/>Community</div></div>
                            <div className="lp-stat-item"><div className="lp-stat-num">5+</div><div className="lp-stat-label">Cities<br/>Worldwide</div></div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section className="lp-section">
                <div className="lp-section-tag lp-reveal">Why Join</div>
                <h2 className="lp-section-title lp-reveal lp-reveal-d1">Built for <em>your</em> generation.</h2>
                <p className="lp-section-desc lp-reveal lp-reveal-d2">
                    More than a directory — it's where the DAV family stays alive, connected, and growing.
                </p>

                <div className="lp-features-grid">
                    <div className="lp-feature-card lp-feature-large lp-reveal lp-reveal-d1">
                        <div className="lp-feature-icon">🎓</div>
                        <div className="lp-feature-title">Alumni Directory</div>
                        <div className="lp-feature-desc">Find your batchmates by name, year, city, or organization. Reconnect with seniors and juniors across every generation of DAV.</div>
                    </div>
                    <div className="lp-feature-card lp-reveal lp-reveal-d2">
                        <div className="lp-feature-icon">📝</div>
                        <div className="lp-feature-title">Share Stories</div>
                        <div className="lp-feature-desc">Post updates, achievements, and walk down memory lane together.</div>
                    </div>
                    <div className="lp-feature-card lp-reveal lp-reveal-d3">
                        <div className="lp-feature-icon">💬</div>
                        <div className="lp-feature-title">Group Chats</div>
                        <div className="lp-feature-desc">Batch-wise groups for real-time conversation with your people.</div>
                    </div>
                    <div className="lp-feature-card lp-reveal lp-reveal-d2">
                        <div className="lp-feature-icon">🎂</div>
                        <div className="lp-feature-title">Birthday Wishes</div>
                        <div className="lp-feature-desc">Never miss a celebration. Get notified when it's a DAVian's special day.</div>
                    </div>
                    <div className="lp-feature-card lp-reveal lp-reveal-d3">
                        <div className="lp-feature-icon">🔔</div>
                        <div className="lp-feature-title">Live Notifications</div>
                        <div className="lp-feature-desc">Real-time updates on posts, mentions, and group activity.</div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="lp-section lp-section-alt">
                <div className="lp-section-tag lp-reveal">How It Works</div>
                <h2 className="lp-section-title lp-reveal lp-reveal-d1">Three steps to <em>belong.</em></h2>
                <p className="lp-section-desc lp-reveal lp-reveal-d2">Getting started takes less than 2 minutes.</p>

                <div className="lp-program-list">
                    <div className="lp-program-item lp-reveal">
                        <div className="lp-program-number">01</div>
                        <div className="lp-program-info">
                            <div className="lp-program-name">Register</div>
                            <div className="lp-program-meta">Create your profile with batch year & details</div>
                        </div>
                        <div className="lp-program-badge">2 min</div>
                        <div className="lp-program-arrow">→</div>
                    </div>
                    <div className="lp-program-item lp-reveal lp-reveal-d1">
                        <div className="lp-program-number">02</div>
                        <div className="lp-program-info">
                            <div className="lp-program-name">Get Approved</div>
                            <div className="lp-program-meta">Admin verifies you're a real DAVian</div>
                        </div>
                        <div className="lp-program-badge">Quick</div>
                        <div className="lp-program-arrow">→</div>
                    </div>
                    <div className="lp-program-item lp-reveal lp-reveal-d2">
                        <div className="lp-program-number">03</div>
                        <div className="lp-program-info">
                            <div className="lp-program-name">Connect & Share</div>
                            <div className="lp-program-meta">Browse directory, join groups, post stories</div>
                        </div>
                        <div className="lp-program-arrow">→</div>
                    </div>
                </div>
            </section>

            {/* ── ALUMNI VOICES ── */}
            <section className="lp-section">
                <div className="lp-section-tag lp-reveal">Alumni Voices</div>
                <h2 className="lp-section-title lp-reveal lp-reveal-d1">They were <em>you.</em></h2>
                <p className="lp-section-desc lp-reveal lp-reveal-d2">
                    Real alumni. Real connections. Hear from those who walked these corridors before you.
                </p>

                <div className="lp-testimonials-scroll">
                    {alumni.map((a, i) => (
                        <div className="lp-tcard" key={i}>
                            <div className="lp-tcard-quote">"</div>
                            <p className="lp-tcard-text">{a.quote}</p>
                            <div className="lp-tcard-author">
                                <div className="lp-tcard-avatar" style={{ background: a.color, color: a.color === '#3dffa0' ? '#000' : undefined }}>{a.initial}</div>
                                <div>
                                    <div className="lp-tcard-name">{a.name}</div>
                                    <div className="lp-tcard-role">{a.role} · Batch {a.batch}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="lp-cta-section">
                <div className="lp-cta-glow" />
                <h2 className="lp-cta-title lp-reveal">
                    Write your<br/><em>chapter.</em>
                </h2>
                <p className="lp-cta-desc lp-reveal lp-reveal-d1">
                    Your DAV family is waiting. Join 170+ alumni who've already reconnected.<br/>
                    It takes 2 minutes — and lasts a lifetime.
                </p>
                <div className="lp-cta-actions lp-reveal lp-reveal-d2">
                    <Link to="/register" className="lp-btn-primary" style={{ fontSize: 15, padding: '16px 36px' }}>
                        Create Your Account ↗
                    </Link>
                    <Link to="/about" className="lp-btn-ghost" style={{ fontSize: 14 }}>
                        Meet the Developer
                    </Link>
                </div>
            </section>
        </div>
    );
}
