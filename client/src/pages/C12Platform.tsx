import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../components/KloudBugsCafe.css';

const KloudBugsCafe: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Simulate loading C12 platform content
    const timer = setTimeout(() => {
      setLoading(false);
      setShowContent(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="c12-platform">
      {/* Background with stars */}
      <div className="c12-stars-background"></div>
      
      {/* Header navigation */}
      <header className="c12-header">
        <Link to="/experience" className="back-button">
          <ArrowLeft /> <span>Return to Mining Station</span>
        </Link>
        <h1>KLOUDBUGS CAFE</h1>
      </header>
      
      {/* Main content */}
      <div className="c12-content">
        {loading ? (
          <div className="c12-loading">
            <h2>KLOUDBUGS CAFE</h2>
            <div className="c12-loading-bar-container">
              <div className="c12-loading-bar"></div>
            </div>
            <p>Initializing Quantum Mining Protocols...</p>
          </div>
        ) : (
          <div className={`c12-main ${showContent ? 'visible' : ''}`}>
            <section className="c12-hero">
              <h2>WELCOME TO KLOUDBUGS CAFE</h2>
              <p className="c12-subtitle">Decentralized Social Justice Platform</p>
              
              <div className="c12-hero-content">
                <div className="c12-hero-text">
                  <p>KloudBugs Cafe is a revolutionary platform that leverages blockchain technology to promote social justice causes through digital mining operations. Our mission is to honor the voices of those who can no longer speak for themselves.</p>
                  <p>Our quantum mining algorithms have successfully restored historical speech archives, including Dr. Martin Luther King Jr.'s "I Have A Dream" speech, preserving this critical moment in civil rights history for future generations.</p>
                </div>
                <div className="c12-hero-image">
                  <div className="c12-image-placeholder">
                    <span className="c12-icon">⚖️</span>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="c12-features">
              <h3>CORE FEATURES</h3>
              
              <div className="c12-feature-grid">
                <div className="c12-feature-card">
                  <div className="c12-feature-icon">🔍</div>
                  <h4>TRUTH DISCOVERY</h4>
                  <p>Advanced algorithms that search through historical data to uncover truth and prevent distortion of facts.</p>
                </div>
                
                <div className="c12-feature-card">
                  <div className="c12-feature-icon">🔊</div>
                  <h4>VOICE AMPLIFICATION</h4>
                  <p>Technology that ensures marginalized voices are heard and preserved for future generations.</p>
                </div>
                
                <div className="c12-feature-card">
                  <div className="c12-feature-icon">⛓️</div>
                  <h4>BLOCKCHAIN JUSTICE</h4>
                  <p>Immutable records that hold systems accountable and ensure transparency in social justice movements.</p>
                </div>
                
                <div className="c12-feature-card">
                  <div className="c12-feature-icon">🌐</div>
                  <h4>GLOBAL IMPACT</h4>
                  <p>Worldwide network of miners contributing hash power to social justice initiatives.</p>
                </div>
              </div>
            </section>
            
            <section className="c12-mlk-section">
              <h3>MLK SPEECH RESTORATION PROJECT</h3>
              
              <div className="c12-mlk-content">
                <div className="c12-mlk-text">
                  <p>Our quantum mining technology has been instrumental in restoring and preserving Dr. Martin Luther King Jr.'s iconic "I Have a Dream" speech, ensuring this pivotal moment in civil rights history remains accessible for generations to come.</p>
                  <p>The complete restoration preserves not just the words, but the emotional resonance and historical context of this watershed moment in American history.</p>
                  <div className="c12-quote">
                    <blockquote>
                      "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character."
                    </blockquote>
                    <cite>- Dr. Martin Luther King Jr.</cite>
                  </div>
                </div>
                <div className="c12-mlk-image">
                  <div className="c12-image-placeholder">
                    <span className="c12-icon">🕊️</span>
                  </div>
                </div>
              </div>
              
              <div className="c12-project-stats">
                <div className="c12-stat">
                  <span className="c12-stat-value">100%</span>
                  <span className="c12-stat-label">Speech Restoration</span>
                </div>
                <div className="c12-stat">
                  <span className="c12-stat-value">1000+</span>
                  <span className="c12-stat-label">BTC Donated</span>
                </div>
                <div className="c12-stat">
                  <span className="c12-stat-value">10M+</span>
                  <span className="c12-stat-label">Global Listeners</span>
                </div>
              </div>
            </section>
            
            <section className="c12-news-feed">
              <h3>LATEST UPDATES</h3>
              
              <div className="c12-news-ticker">
                <div className="c12-ticker-content">
                  <span>HISTORICAL SPEECH RESTORATION PROJECT COMPLETES PHASE 1 • BITCOIN MINING DIFFICULTIES REACH ALL-TIME HIGH • COSMIC JUSTICE PROTOCOL IMPLEMENTED IN MAJOR BLOCKCHAINS • KLOUDBUGS COLLECTIVE EXPANDS TO LUNAR MINING OPERATIONS • DIGITAL REMEMBRANCE PROJECT APPROVED BY GLOBAL COUNCIL • NEURAL MINING TECHNOLOGY PATENT FILED BY COLLECTIVE • MLK SPEECH PRESERVATION FUND REACHES 1000 BTC</span>
                </div>
              </div>
              
              <div className="c12-news-grid">
                <div className="c12-news-item">
                  <h4>HISTORICAL SPEECH ARCHIVE RESTORED</h4>
                  <p>The complete "I Have a Dream" speech by Dr. Martin Luther King Jr. has been digitally restored using quantum mining algorithms.</p>
                  <span className="c12-news-date">COSMIC DATE: 22.04.2225</span>
                </div>
                
                <div className="c12-news-item">
                  <h4>SOCIAL JUSTICE INITIATIVE</h4>
                  <p>Mining profits redirected to support global justice causes, honoring the legacy of Tera Ann Harris.</p>
                  <span className="c12-news-date">COSMIC DATE: 15.04.2225</span>
                </div>
                
                <div className="c12-news-item">
                  <h4>ZIG AI EVOLUTION</h4>
                  <p>Enhanced AI miners now capable of developing ethical mining practices while maintaining profitability.</p>
                  <span className="c12-news-date">COSMIC DATE: 08.04.2225</span>
                </div>
              </div>
            </section>
            
            <section className="c12-legacy-section">
              <h3>HONORING TERA ANN HARRIS</h3>
              <p>This platform exists to honor Tera Ann Harris, mother of seven whose voice was silenced by injustice. Her courage guides our mission to transform digital power into social change.</p>
              <p>Through this platform, we seek truth, demand accountability, and honor Tera's legacy by building a new system where no mother's cry goes unheard.</p>
              
              <div className="c12-cta">
                <button className="c12-join-button">JOIN THE COLLECTIVE</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default KloudBugsCafe;
