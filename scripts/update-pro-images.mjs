import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import sharp from 'sharp';

const jobs = [
  // --- Project 1: Testing Local LLMs with Ollama ---
  {
    target: 'hero-orbit.webp',
    width: 1740, height: 974,
    id: 'photo-1620712943543-bcc4688e7485', // neural network synapses
  },
  {
    target: 'project-orbit-cover.webp',
    width: 904, height: 1200,
    id: 'photo-1526374965328-7f61d4dc18c5', // cyber matrix terminal
  },
  {
    target: 'project-orbit-showcase.webp',
    width: 1160, height: 749,
    id: 'photo-1518770660439-4636190af475', // microchip / local compute
  },
  {
    target: 'award-pace.webp',
    width: 480, height: 289,
    id: 'photo-1620712943543-bcc4688e7485', // neural network badge
  },
  {
    target: 'orbit-8.webp',
    width: 1000, height: 639,
    id: 'photo-1620712943543-bcc4688e7485', // local LLM focus topic
  },

  // --- Project 2: Learning RAG Concepts ---
  {
    target: 'hero-halo.webp',
    width: 1740, height: 974,
    id: 'photo-1516321318423-f06f85e504b3', // digital vector network
  },
  {
    target: 'project-halo-cover.webp',
    width: 904, height: 1200,
    id: 'photo-1526379095098-d400fd0bf935', // data streams
  },
  {
    target: 'project-halo-showcase.webp',
    width: 1160, height: 749,
    id: 'photo-1558494949-ef010cbdcc31', // server cluster infrastructure
  },
  {
    target: 'award-lumen.webp',
    width: 480, height: 289,
    id: 'photo-1516321318423-f06f85e504b3', // RAG vector badge
  },
  {
    target: 'orbit-5.webp',
    width: 1000, height: 639,
    id: 'photo-1516321318423-f06f85e504b3', // RAG focus topic
  },

  // --- Project 3: Building This Website (Astro & TS) ---
  {
    target: 'hero-pace.webp',
    width: 1740, height: 974,
    id: 'photo-1555066931-4365d14bab8c', // dark mode VS Code syntax
  },
  {
    target: 'project-pace-cover.webp',
    width: 904, height: 1200,
    id: 'photo-1517694712202-14dd9538aa97', // macbook coding setup
  },
  {
    target: 'project-pace-showcase.webp',
    width: 1160, height: 749,
    id: 'photo-1504639725590-34d0984388bd', // dual monitor workstation
  },
  {
    target: 'award-fauna.webp',
    width: 480, height: 289,
    id: 'photo-1555066931-4365d14bab8c', // code editor badge
  },
  {
    target: 'orbit-4.webp',
    width: 1000, height: 639,
    id: 'photo-1555066931-4365d14bab8c', // web dev focus topic
  },

  // --- Project 4: Python Foundations & Scripts ---
  {
    target: 'hero-lumen.webp',
    width: 1740, height: 974,
    id: 'photo-1515879218367-8466d910aaa4', // python code on dark monitor
  },
  {
    target: 'project-lumen-cover.webp',
    width: 904, height: 1200,
    id: 'photo-1531297484001-80022131f5a1', // glowing keyboard / hardware
  },
  {
    target: 'project-lumen-showcase.webp',
    width: 1160, height: 749,
    id: 'photo-1509228468518-180dd4864904', // math algorithms / data logic
  },
  {
    target: 'award-halo.webp',
    width: 480, height: 289,
    id: 'photo-1515879218367-8466d910aaa4', // python badge
  },
  {
    target: 'orbit-3.webp',
    width: 1000, height: 639,
    id: 'photo-1515879218367-8466d910aaa4', // python focus topic
  },

  // --- Milestones ---
  {
    target: 'award-orbit.webp',
    width: 480, height: 289,
    id: 'photo-1596176530529-78163a4f7af2', // Bengaluru skyline at night / B.Tech in AI/ML
  },

  // --- Principles ---
  {
    target: 'principle-1.webp', // Embrace being a beginner
    width: 1000, height: 563,
    id: 'photo-1508739773434-c26b3d09e071', // starry night mountain horizon
  },
  {
    target: 'principle-2.webp', // Learn by breaking things
    width: 1000, height: 563,
    id: 'photo-1518770660439-4636190af475', // circuit microchip teardown
  },
  {
    target: 'principle-3.webp', // Keep it simple
    width: 1000, height: 563,
    id: 'photo-1618005182384-a83a8bd57fbe', // dark minimalist abstract geometry
  },
  {
    target: 'principle-4.webp', // Curious above all
    width: 1000, height: 563,
    id: 'photo-1451187580459-43490279c0fa', // Earth network from orbit
  },

  // --- Gallery Floating Cards ---
  { target: 'orbit-1.webp', width: 1000, height: 639, id: 'photo-1620712943543-bcc4688e7485' },
  { target: 'orbit-2.webp', width: 1000, height: 639, id: 'photo-1526374965328-7f61d4dc18c5' },
  { target: 'orbit-6.webp', width: 1000, height: 639, id: 'photo-1596176530529-78163a4f7af2' },
  { target: 'orbit-7.webp', width: 1000, height: 639, id: 'photo-1518770660439-4636190af475' },
  { target: 'orbit-9.webp', width: 1000, height: 639, id: 'photo-1525547719571-a2d4ac8945e2' },
  { target: 'orbit-10.webp', width: 1000, height: 639, id: 'photo-1509228468518-180dd4864904' },
  { target: 'orbit-11.webp', width: 1000, height: 639, id: 'photo-1446776811953-b23d57bd21aa' },
  { target: 'orbit-12.webp', width: 1000, height: 639, id: 'photo-1558494949-ef010cbdcc31' }
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status code: ${res.statusCode}`));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

// Cache of raw downloaded buffers to avoid duplicate downloads for identical photo IDs
const rawCache = new Map();

async function run() {
  console.log(`Starting image generation for ${jobs.length} assets...`);
  const assetsDir = path.resolve('public/assets');

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const outPath = path.join(assetsDir, job.target);
    const downloadUrl = `https://images.unsplash.com/${job.id}?auto=format&fit=crop&w=2400&q=90`;

    try {
      let buf = rawCache.get(job.id);
      if (!buf) {
        process.stdout.write(`[${i + 1}/${jobs.length}] Downloading ${job.id}... `);
        buf = await downloadBuffer(downloadUrl);
        rawCache.set(job.id, buf);
        console.log(`(${Math.round(buf.length / 1024)} KB)`);
      } else {
        console.log(`[${i + 1}/${jobs.length}] Reusing cached ${job.id}`);
      }

      await sharp(buf)
        .resize(job.width, job.height, {
          fit: 'cover',
          position: 'center',
          kernel: sharp.kernel.lanczos3
        })
        .sharpen({ sigma: 1.0, m1: 0.8, m2: 2.0 })
        .webp({ quality: 90, effort: 5 })
        .toFile(outPath);

      console.log(`  -> Saved ${job.target} (${job.width}x${job.height})`);
    } catch (err) {
      console.error(`  ERROR on ${job.target}:`, err.message);
    }
  }

  console.log('All image transformations completed successfully!');
}

run();
