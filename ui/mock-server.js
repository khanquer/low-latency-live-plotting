const io = require('socket.io')(5000, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  let simInterval;

  socket.on('start_simulation', (data) => {
    if (simInterval) clearInterval(simInterval);

    let currentTime = parseFloat(data.config.start);
    const stopTime = parseFloat(data.config.stop);
    const stepSize = parseFloat(data.config.step);

    simInterval = setInterval(() => {
      // Image format: First index is time, subsequent values are variables
      const payload = [currentTime]; 

      data.variables.forEach(v => {
        const val = data.fmu_id.includes('PID') 
          ? (Math.sin(currentTime) * 10) + (Math.random() * 2) 
          : (Math.random() * 5) + 20;
        payload.push(val);
      });

      socket.emit('data_update', payload);
      currentTime += stepSize;

      if (currentTime > stopTime) {
        clearInterval(simInterval);
        socket.emit('simulation_finished', { status: "Complete", fmu: data.fmu_id });
      }
    }, 100);
  });

  socket.on('disconnect', () => clearInterval(simInterval));
});