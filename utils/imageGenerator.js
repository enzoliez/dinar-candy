const { createCanvas, loadImage } = require('canvas');
const https = require('https');

async function fetchImageBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function generateWelcomeImage(member, settings) {
  const canvas = createCanvas(1018, 497);
  const ctx = canvas.getContext('2d');

  const background = await loadImage(await fetchImageBuffer(settings.backgroundImage));
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatarURL = member.user.displayAvatarURL({ extension: 'jpg', size: 256 });
  const avatar = await loadImage(await fetchImageBuffer(avatarURL));

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 55;
  const circleSize = 250;
  const avatarX = centerX - circleSize / 2;
  const avatarY = centerY - 20 - circleSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY - 20, circleSize / 2 + 5, 0, Math.PI * 2);
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY - 20, circleSize / 2 + 3, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY - 20, circleSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, (avatar.width - circleSize) / 2, (avatar.height - circleSize) / 2, circleSize, circleSize, avatarX, avatarY, circleSize, circleSize);
  ctx.restore();

  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = settings.textColor || '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 5;
  ctx.fillText(`Selamat datang, ${member.user.username}!`, centerX, canvas.height - 60);

  return canvas.toBuffer('image/png');
}

module.exports = { generateWelcomeImage };
