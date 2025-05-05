import { useAudio } from '../../lib/stores/useAudio';
import { Volume2, VolumeX } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const audio = useAudio();
  
  return (
    <>
      {/* Sound toggle button - only control we keep */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => audio.toggleMute()}
          className="cosmic-mini-btn"
          style={{ 
            width: '50px', 
            height: '50px',
            backgroundColor: 'rgba(153, 0, 255, 0.3)',
            boxShadow: '0 0 15px rgba(153, 0, 255, 0.5)',
            border: '2px solid #9900ff'
          }}
          title={audio.isMuted ? "Unmute" : "Mute"}
        >
          <span className="flex items-center justify-center">
            {audio.isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </span>
        </button>
      </div>
    </>
  );
};

export default ControlPanel;