import { spawn } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const appsDirectory = new URL('../apps/', import.meta.url);
const selected = new Set(process.argv.slice(2));
const apps = [];

for (const entry of await readdir(appsDirectory, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const manifest = JSON.parse(await readFile(new URL(`${entry.name}/package.json`, appsDirectory), 'utf8'));
  if (manifest.scripts?.dev) apps.push({ slug: entry.name, name: manifest.name });
}

const unknown = [...selected].filter(slug => !apps.some(app => app.slug === slug));
if (unknown.length) {
  console.error(`Unknown apps: ${unknown.join(', ')}. Available: ${apps.map(app => app.slug).join(', ')}`);
  process.exit(1);
}

const children = new Set();
const windows = process.platform === 'win32';
let stopping = false;

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;

  // npm launches a server subprocess; terminate its entire process group as well.
  for (const child of children) {
    if (!child.pid) continue;
    if (windows) {
      spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
    } else {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
    }
  }

  const forceStop = setTimeout(() => {
    if (!windows) {
      for (const child of children) {
        if (!child.pid) continue;
        try {
          process.kill(-child.pid, 'SIGKILL');
        } catch (error) {
          if (error.code !== 'ESRCH') throw error;
        }
      }
    }
    process.exit(code);
  }, 3000);
  forceStop.unref();
}

// npm can forward the same terminal signal again; keep handlers installed while stopping.
process.on('SIGINT', () => stop(130));
process.on('SIGTERM', () => stop(143));

const chosen = apps.filter(app => selected.size === 0 || selected.has(app.slug));
if (chosen.length === 0) {
  console.error('No apps with a dev script were found in apps/.');
  process.exit(1);
}

for (const app of chosen) {
  console.log(`Starting ${app.name}…`);
  const npmCli = process.env.npm_execpath;
  const port = process.env[`${app.slug.toUpperCase().replaceAll('-', '_')}_PORT`];
  const child = spawn(npmCli ? process.execPath : 'npm', [
    ...(npmCli ? [npmCli] : []), 'run', 'dev', `--workspace=${app.name}`,
  ], {
    cwd: root,
    stdio: 'inherit',
    detached: !windows,
    shell: windows && !npmCli,
    env: { ...process.env, ...(port ? { PORT: port } : {}) },
  });
  children.add(child);
  child.once('error', error => {
    console.error(`Failed to start ${app.name}: ${error.message}`);
    stop(1);
  });
  child.once('exit', (code, signal) => {
    // Keep the exited leader's PID until cleanup has signaled any surviving server.
    if (!stopping) {
      console.error(`${app.name} stopped (${signal ?? code}); stopping the other apps.`);
      stop(code || 1);
    }
    children.delete(child);
  });
}
