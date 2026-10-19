const { randomInt } = require('node:crypto');

// Bind directly, retrying collisions so concurrent previews cannot claim the same port.
module.exports = function listenPreview(server, { name, host = '127.0.0.1', port = process.env.PORT } = {}) {
  const explicit = port !== undefined && port !== '';
  const first = randomInt(3100, 3201);
  let attempt = 0;
  let candidate = explicit ? Number(port) : first;
  if (explicit && (!Number.isInteger(candidate) || candidate < 1 || candidate > 65535)) {
    throw new Error(`Invalid preview port: ${port}`);
  }
  server.on('error', error => {
    if (error.code === 'EADDRINUSE' && !explicit && ++attempt < 101) {
      candidate = 3100 + (first - 3100 + attempt) % 101;
      server.listen(candidate, host);
      return;
    }
    console.error(`${name} preview failed: ${error.message}`);
    process.exitCode = 1;
  });
  server.on('listening', () => console.log(`${name} preview: http://${host}:${server.address().port}`));
  server.listen(candidate, host);
  return server;
};
