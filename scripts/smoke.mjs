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
  // Credentials are prefilled — just tap Log In
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await page.waitForURL(/questionnaire/);
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Create Profile' }).click();
  await page.waitForURL(/borders/);
  await page.getByText('Terminal Maps').waitFor();
  await page.getByText('Custom and Immigration').waitFor();
  await page.getByText('Shop, Dine and Services').waitFor();
  await page.getByText('Parking').waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/10_borders_list.png', fullPage: true });

  await page.getByRole('link', { name: 'Stays' }).click();
  await page.waitForURL(/stays/);
  await page.getByText('Fairmont Waterfront').first().waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/11_stays_mantine.png', fullPage: true });

  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByText('Maya Chen').first().waitFor();
  await page.screenshot({ path: '/tmp/dtp-screenshots/12_profile_mantine.png', fullPage: true });

  console.log(JSON.stringify({ ok: true, errors }, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
