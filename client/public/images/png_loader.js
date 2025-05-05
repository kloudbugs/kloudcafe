// This file creates PNG versions of our SVG files for use in Three.js
// Load SVGs into Image objects and draw them to canvas to convert to PNG data URLs

const svgUrls = [
  '/images/kloudbugs_logo.svg',
  '/images/bitcoin_miner.svg', 
  '/images/bitcoin_coin.svg',
  '/images/cosmic_bean.svg'
];

const pngUrls = {
  '/images/kloudbugs_logo.png': null,
  '/images/bitcoin_miner.png': null,
  '/images/bitcoin_coin.png': null,
  '/images/cosmic_bean.png': null
};

function loadSvgAsPng(svgUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 256, 256);
      
      const pngUrl = canvas.toDataURL('image/png');
      const pngKey = svgUrl.replace('.svg', '.png');
      pngUrls[pngKey] = pngUrl;
      resolve();
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
}

// Create a bitcoin logo since we might not have that exact image
function createBitcoinLogo() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Draw circle background
  ctx.fillStyle = '#F7931A';
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();
  
  // Add white border
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;
  ctx.stroke();
  
  // Draw Bitcoin symbol
  ctx.fillStyle = 'white';
  ctx.font = 'bold 160px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₿', 128, 128);
  
  const pngUrl = canvas.toDataURL('image/png');
  pngUrls['/images/bitcoin_coin.png'] = pngUrl;
}

// Create a KloudBugs logo with the coffee bean
function createKloudBugsLogo() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Draw blue background glow
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0, 255, 204, 0.6)');
  gradient.addColorStop(1, 'rgba(153, 0, 255, 0.2)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw coffee bean shape
  ctx.fillStyle = '#6B4226';
  ctx.beginPath();
  ctx.ellipse(128, 128, 80, 100, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Add line down the middle
  ctx.strokeStyle = '#4B2E1A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 28);
  ctx.lineTo(128, 228);
  ctx.stroke();
  
  // Add glow
  ctx.shadowColor = '#00FFCC';
  ctx.shadowBlur = 15;
  ctx.strokeStyle = '#9900FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(128, 128, 90, 0, Math.PI * 2);
  ctx.stroke();
  
  // Add text
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'white';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KLOUDBUGS', 128, 220);
  
  const pngUrl = canvas.toDataURL('image/png');
  pngUrls['/images/kloudbugs_logo.png'] = pngUrl;
}

// Create a cosmic miner logo
function createMinerLogo() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Draw glowing background
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0, 170, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 50, 0.8)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw miner head outline
  ctx.fillStyle = '#001133';
  ctx.beginPath();
  ctx.arc(128, 128, 80, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw helmet
  ctx.fillStyle = '#FFCC00';
  ctx.beginPath();
  ctx.ellipse(128, 90, 70, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw light on helmet
  ctx.fillStyle = '#00FFFF';
  ctx.beginPath();
  ctx.arc(128, 85, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eyes
  ctx.fillStyle = '#00CCFF';
  ctx.beginPath();
  ctx.arc(108, 128, 15, 0, Math.PI * 2);
  ctx.arc(148, 128, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw pickaxe
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(200, 60);
  ctx.lineTo(60, 200);
  ctx.stroke();
  
  // Add bitcoin symbol
  ctx.fillStyle = '#FFCC00';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₿', 190, 190);
  
  const pngUrl = canvas.toDataURL('image/png');
  pngUrls['/images/bitcoin_miner.png'] = pngUrl;
}

// Create a cosmic bean
function createCosmicBean() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  // Draw space background
  ctx.fillStyle = '#0A0A2A';
  ctx.fillRect(0, 0, 256, 256);
  
  // Draw stars
  ctx.fillStyle = 'white';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const size = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw cosmic glow
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(153, 0, 255, 0.5)');
  gradient.addColorStop(0.7, 'rgba(0, 255, 204, 0.3)');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw coffee bean
  ctx.fillStyle = '#6B4226';
  ctx.beginPath();
  ctx.ellipse(128, 128, 60, 90, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw cosmic energy lines
  ctx.strokeStyle = '#9900FF';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00FFCC';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(68, 68);
  ctx.quadraticCurveTo(98, 98, 128, 68);
  ctx.moveTo(188, 68);
  ctx.quadraticCurveTo(158, 98, 128, 68);
  ctx.moveTo(68, 188);
  ctx.quadraticCurveTo(98, 158, 128, 188);
  ctx.moveTo(188, 188);
  ctx.quadraticCurveTo(158, 158, 128, 188);
  ctx.stroke();
  
  const pngUrl = canvas.toDataURL('image/png');
  pngUrls['/images/cosmic_bean.png'] = pngUrl;
}

// Load all SVGs or create fallback PNGs
function loadAllImages() {
  createBitcoinLogo();
  createKloudBugsLogo();
  createMinerLogo();
  createCosmicBean();
  
  console.log('Generated images for orbiting logos');
  return pngUrls;
}

window.loadOrbitingLogos = loadAllImages;