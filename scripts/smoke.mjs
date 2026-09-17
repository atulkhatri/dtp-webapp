import { chromium } from 'playwright';

async function main() {
  const base = 'http://127.0.0.1:4173/dtp-webapp';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Fill demo credentials' }).click();
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await page.waitForURL(/questionnaire/);
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Create Profile' }).click();
  await page.waitForURL(/borders/);
  await page.screenshot({ path: '/tmp/dtp-screenshots/04_borders.png', fullPage: true });

  await page.getByRole('link', { name: 'Stays' }).click();
  await page.waitForURL(/stays/);
  await page.getByText('Fairmont Waterfront').first().waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/05_stays.png', fullPage: true });

  await page.getByRole('link', { name: 'On the Way' }).click();
  await page.getByText('Flight Information').click();
  await page.getByText('AC301').first().waitFor();
  await page.getByRole('button', { name: 'Boarding Pass' }).click();
  await page.getByText('Maya Chen').waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/06_flight_boarding.png', fullPage: true });
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('link', { name: 'Explore' }).click();
  await page.getByText('Discover the best of Vancouver').waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/07_explore.png', fullPage: true });

  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByText('Maya Chen').first().waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/08_profile.png', fullPage: true });

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('link', { name: 'About' }).click();
  await page.getByText('About DTP').waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/09_about.png', fullPage: true });

  console.log(JSON.stringify({ ok: true, errors }, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
