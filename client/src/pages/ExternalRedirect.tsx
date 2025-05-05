import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ExternalRedirectProps {
  to: string;
}

// Component that redirects to an external URL
const ExternalRedirect: React.FC<ExternalRedirectProps> = ({ to }) => {
  const location = useLocation();

  useEffect(() => {
    // Redirect to the external URL
    window.location.href = to;
  }, [to, location]);

  // Render a loading message while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh',
      background: '#0a0a0a',
      color: '#00ccff',
      fontFamily: 'monospace',
      fontSize: '18px'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid #00ccff',
        boxShadow: '0 0 15px rgba(0, 204, 255, 0.5)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '32px' }}>📡</span>
        </div>
        <p>Redirecting to KloudBugs C12 Platform...</p>
      </div>
    </div>
  );
};

export default ExternalRedirect;
