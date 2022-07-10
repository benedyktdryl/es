const playwright = require('playwright');

async function main() {
	const browser = await playwright.chromium.launch({
		headless: false // setting this to true will not run the UI
	});

	const page = await browser.newPage();

	// Go to https://escort.pl/
	await page.goto('https://escort.pl/'); // https://escort.pl/szukaj/page2.html
	// Click text=Wchodzę
	await page.locator('text=Wchodzę').click();
	// Click button:has-text("Szukaj")
	await page.locator('button:has-text("Szukaj")').click();

	let nextPageLocator;

	// do {
	// Click text=następna
	// nextPageLocator = await page.locator('text=następna')
	// } while (await nextPageLocator.count() > 0) // while the element exists
	// .click();

	await page.waitForSelector('.content-sec .row .item-col a[href*="/anons/"]');

	const urls = await page.$$eval('.content-sec .row .item-col a[href*="/anons/"]', (elements) =>
		elements.map((el) => el.href),
	)

	await Promise.all(urls.map(async (url, index) => {
		if (index < 2) {
			const anonsPage = await browser.newPage();

			await anonsPage.goto(url);
		}
	}))

	console.log({ urls, urlsCount: urls.length })

	// https://github.com/microsoft/playwright/issues/2708
	// https://github.com/microsoft/playwright/issues/10648
	await browser.close();
}

// async function crawl() { }

main();
