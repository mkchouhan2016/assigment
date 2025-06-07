const os = require('os');
const { exec } = require('child_process');

function getCpuUsagePercent() {
  const cpus = os.cpus();
  let idle = 0, total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  }

  const idlePercent = idle / cpus.length;
  const totalPercent = total / cpus.length;

  return 100 - Math.floor((idlePercent / totalPercent) * 100);
}

function monitorAndRestartIfHigh(threshold = 70, intervalMs = 5000) {
  setInterval(() => {
    const usage = getCpuUsagePercent();

    if (usage > threshold) {
      console.warn(`CPU exceeded ${threshold}%, restarting server...`);

      // Restart the server (custom script or process manager like PM2/nodemon)
      exec('npm restart server.js', (err, stdout, stderr) => {
        if (err) {
          console.error('Restart error:', err);
        } else {
          console.log('Restarted via PM2:', stdout);
        }
      });
    }
  }, intervalMs);
}

module.exports = monitorAndRestartIfHigh;
