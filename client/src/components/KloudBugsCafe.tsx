import React, { useState, useEffect } from 'react';
import './KloudBugsCafe.css';

interface KloudBugsCafeProps {
  onClose: () => void;
}

const KloudBugsCafe: React.FC<KloudBugsCafeProps> = ({ onClose }) => {
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: 'KLOUDBUGS CAFE Platform Launch',
      date: 'May 4, 2025',
      content: 'The unified KLOUDBUGS CAFE platform has been launched, integrating all our services into a single immersive experience.'
    },
    {
      id: 2,
      title: 'New Mining Protocol Established',
      date: 'May 3, 2025',
      content: 'Our quantum mining protocols have been enhanced, providing 35% better efficiency while maintaining ethical standards.'
    },
    {
      id: 3,
      title: 'Social Justice Initiative Updates',
      date: 'May 1, 2025',
      content: 'The Tera Harris Foundation has reached a new milestone with support for over 50 families affected by system neglect.'
    }
  ]);

  const [stats, setStats] = useState({
    activeMiners: 1337,
    hashRate: '45.8 PH/s',
    blocksMined: 281,
    projectsFunded: 12
  });

  // Simulate loading stats
  useEffect(() => {
    const timer = setTimeout(() => {
      // Update stats with more current data
      setStats(prev => ({
        ...prev,
        activeMiners: prev.activeMiners + Math.floor(Math.random() * 10),
        blocksMined: prev.blocksMined + 1
      }));
    }, 15000); // Update every 15 seconds

    return () => clearTimeout(timer);
  }, [stats]);

  return (
    <div className="cafe-container cafe-animate-in">
      <button className="cafe-close-button" onClick={onClose}>
        ×
      </button>
      
      <header className="cafe-header">
        <div className="cafe-logo">KLOUDBUGS CAFE</div>
        <nav className="cafe-nav">
          <a href="#dashboard" className="cafe-nav-item">Dashboard</a>
          <a href="#news" className="cafe-nav-item">News</a>
          <a href="#mining" className="cafe-nav-item">Mining</a>
          <a href="#projects" className="cafe-nav-item">Projects</a>
        </nav>
      </header>
      
      <main className="cafe-content">
        <section id="dashboard">
          <div className="cafe-card">
            <h2 className="cafe-card-title">Mining Dashboard</h2>
            <div className="cafe-card-content">
              <p className="quantum-text">Quantum Mining Protocols Active</p>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.activeMiners}</div>
                  <div className="stat-label">Active Miners</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.hashRate}</div>
                  <div className="stat-label">Hash Rate</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.blocksMined}</div>
                  <div className="stat-label">Blocks Mined</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{stats.projectsFunded}</div>
                  <div className="stat-label">Projects Funded</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="news">
          <div className="cafe-card">
            <h2 className="cafe-card-title">Latest Updates</h2>
            <div className="cafe-card-content">
              {newsItems.map(item => (
                <div key={item.id} className="news-item">
                  <div className="news-title">{item.title}</div>
                  <div className="news-date">{item.date}</div>
                  <div className="news-content">{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="projects">
          <div className="cafe-card">
            <h2 className="cafe-card-title">Justice Initiatives</h2>
            <div className="cafe-card-content">
              <p>The KLOUDBUGS CAFE mining collective is dedicated to honoring Tera Ann Harris by translating digital power into social change. Our initiatives focus on:</p>
              
              <ul style={{ marginTop: '15px', lineHeight: '1.6' }}>
                <li>Supporting families affected by system neglect</li>
                <li>Creating transparency in law enforcement practices</li>
                <li>Building technology that amplifies silenced voices</li>
                <li>Providing educational resources for community empowerment</li>
              </ul>
              
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0,255,255,0.1)', borderRadius: '5px' }}>
                <p>"Through this portal, we seek truth. We demand accountability. We honor Tera's legacy by building a new system where no mother's cry goes unheard."</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="cafe-footer">
        KLOUDBUGS CAFE Mining Collective © 2025 | A Voice for Those Who Can No Longer Speak
      </footer>
    </div>
  );
};

export default KloudBugsCafe;
