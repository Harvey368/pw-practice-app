import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ browser }) => {
//   page = await browser.newPage();
// });

test.beforeEach('Login',async ({ page }) => {
  await page.goto('https://stg-marketplace-shell.npa.kar-services.io/')
  await page.locator('#okta-signin-username').click()
  await page.locator('#okta-signin-username').fill('auto_1710423465337@fakedomain.com')
  await page.locator('#okta-signin-password').fill('Traderev1!')
  await page.locator('#okta-signin-submit').click()
  await page.waitForURL('https://app.stg.openlane.ca/')
  await page.waitForResponse('https://openauction.uat.nw.adesa.ca/api/search/vehicles')
  await expect(page.getByTestId('header-heading')).toBeVisible();
  console.log('Result: ');
  console.log('1. Login successfully!')
});

  test('add note on Adesa Vehicle', async ({ page }) => {
    // await page.waitForURL('https://app.stg.openlane.ca/')
    await page.getByTestId('header-heading').waitFor({state:"visible"})
    await page.goto('https://app.stg.openlane.ca/?tab=dealerblock');
    await page.waitForResponse('https://openauction.uat.nw.adesa.ca/api/search/vehicles');
    await page.getByTestId('side-rail-icon').click();
    await page.getByTestId('watchlist-icon').first().waitFor({state:"visible"})
    await expect(page.getByTestId('watchlist-icon').first()).toBeVisible();
    console.log('2. Browse vehicles succesfully!');
  
    
    await page.getByTestId('side-rail-icon').click();
    await page.getByTestId('watchlist-icon').first().waitFor({state:"visible"})
    await page.getByTestId('list-card__body-header').first().waitFor({state:"visible"});
    await page.getByTestId('list-card__body-header').first().click();
    page.getByRole('heading', { name: 'ANNOUNCEMENTS' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'ANNOUNCEMENTS' })).toBeVisible();
    console.log('3. Open Side Rail successfully!')

    page.getByPlaceholder('Click to add notes').waitFor({ state: 'visible' });
    await page.locator('.note').locator('textarea').fill('');
    await page.getByPlaceholder('Click to add notes').press('Tab');
    await page.locator('.note').locator('textarea').fill('add Note');
    await page.getByPlaceholder('Click to add notes').press('Tab');
    await expect(page.locator('.note').locator('textarea')).toHaveValue('add Note');
    console.log('4. Note saved');
    await page.close();
  });


// test('Login verification', async ({ page }) => {
//   await page.goto('https://app.stg.openlane.ca/?tab=active')
  
// });

// test('auto-wait', async ({ page }) => {
//   await page.goto('http://uitestingplayground.com/ajax')
//   const text= await page.locator('.bg-success').textContent()
//   expect(text).toContain('Data loaded')

// });

