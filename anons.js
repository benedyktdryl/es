const playwright = require('playwright');

async function main() {
	const browser = await playwright.chromium.launch({
		headless: false // setting this to true will not run the UI
	});

	const data = {};
	const page = await browser.newPage();

	await page.goto('https://escort.pl/anons/50694.html');
	await page.locator('text=Wchodzę').click();

	data.name = await page.$eval('.content-name h1', element => element.textContent.replaceAll('\n', '').trim())
	data.location = await page.$$eval('.content-location .sub-label a', elements => elements.map(element => element.textContent).join(', '))
	data.desc = await page.$eval('#PL', element => element.textContent.replaceAll('\n', '').trim())

	await page.locator('.content-info [data-show-phone]').click();
	await page.waitForTimeout(1000)

	data.phone = await page.$eval('.content-info [data-show-phone]', element => element.textContent.replaceAll('-', ''))
	data.details = await page.$$eval('.content-hours .stats-box .stat-elem', elements => elements.reduce((memo, element) => {
		memo[element.querySelector('.sub-label')?.textContent.toLowerCase().replace(':', '')] = element.querySelector('.sub-desc')?.textContent.replaceAll('\n', '').trim()

		return memo
	}, {}))

	data.prices = await page.$$eval('.contant-prices .stats-box .stat-elem', elements => elements.reduce((memo, element) => {
		memo[element.querySelector('.sub-label')?.textContent.toLowerCase().replace(':', '').replace('godz', '').replace(',', '.').trim()] = element.querySelector('.sub-desc')?.textContent.replaceAll('\n', '').trim()

		return memo
	}, {}))

	data.hours = await page.$$eval('.anons-info-sec .sub-info-box.-info .sub-info-elem', elements => elements.reduce((memo, element) => {
		memo[element.querySelector('.sub-label')?.textContent.toLowerCase().replace(':', '').replace(',', '.').trim()] = element.querySelector('.desc')?.textContent.replaceAll('\n', '').trim()

		return memo
	}, {}))

	data.tags = await page.$$eval('.anons-info-sec .sub-info-box.-tags .tags-box a', elements => elements.map(element => element.textContent))

	console.log({ data })

	await browser.close();
}

// async function crawl() { }

main();
