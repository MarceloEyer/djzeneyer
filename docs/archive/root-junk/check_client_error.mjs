import puppeteer from 'puppeteer';

async function check() {
  console.log('Launching puppeteer...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR STR:', err.toString());
  });
  
  try {
    console.log('Going to http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 8000 });
    console.log('Page loaded (DOM content loaded)');
  } catch (e) {
    console.error('goto error:', e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
}
check();
