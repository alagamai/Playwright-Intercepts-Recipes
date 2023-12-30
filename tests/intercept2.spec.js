// @ts-check
const { test, expect, chromium } = require('@playwright/test');
const usersData = require('./users.json');

test('Delete Headers', async ({ page }) => {
	await page.goto('https://reqres.in/');

	// Intercept network requests
	await page.route('**/api/users/', route => {
		const headers = route.request().headers();
		console.log(`Headers Before Delete: ${JSON.stringify(headers, null, 2)}`);
		//Delete the 'X-Secret' header if it exists
		if ('origin' in headers) {
			delete headers['origin'];
			console.log(`Headers after Delete: ${JSON.stringify(headers, null, 2)}`);
		}

		route.continue();
	});
	// Click on the element with data-id='users'
	await page.click('[data-id=users]');

	const response = await page.waitForResponse('**/api/users/');
	const responseBody = await response.json();

	expect(responseBody.data).toHaveLength(6);
});

test('loads page without images', async ({ page }) => {
	// Block url that ends with png or jpeg images.
	await page.route(/(png|jpeg|img|image|jpg)$/, route => route.abort());

	await page.goto('https://demoblaze.com/');
	// ... test goes here
});

test('modify request at context level', async () => {
	const browser = await chromium.launch();
	const context = await browser.newContext();

	await context.route('**/*', route => {
		//if (route.request().resourceType() === 'xhr') {
		const orginalHeaders = route.request().headers();
		orginalHeaders['user-agent'] = 'Custom User Agent';
		// Log the original and modified headers
		// console.log('Original Headers:', orginalHeaders);
		console.log('Original Headers:', route.request().headers());

		route.continue({ headers: orginalHeaders });
		console.log('Modified Headers:', route.request().headers());
		//} else {
		// Continue other requests without modification
		//	route.continue();
		//}
	});

	const page = await context.newPage();
	await page.goto('https://example.com');

	const page1 = await context.newPage();
	await page1.goto('https://demoblaze.com/');

	await browser.close();
});

// test('Read headers', async ({ page }) => {
// 	let headers;
// 	await page.goto('https://reqres.in/');

// 	await page.route('**/api/users/', route => {
// 		route.continue();
// 	});

// 	// await page.route('https://reqres.in/api/users', route => {
// 	// headers = route.request().headers();
// 	// console.log(`Headers: ${JSON.stringify(headers)}`);
// 	// Delete the 'X-Secret' header if it exists
// 	// if ('cookie' in headers) {
// 	// 	delete headers['cookie'];
// 	// }

// 	// console.log(
// 	// 	`\nAfter deleting cookie in Headers: ${JSON.stringify(headers)}`
// 	// );

// 	// route.continue();
// 	// });

// 	// await page.goto('https://reqres.in/');
// 	await page.click('[data-id=post]');

// 	// Wait for the intercepted request to complete
// 	const response = await page.waitForResponse('**/api/users', {
// 		timeout: 5000,
// 	});
// 	const responseBody = await response.json();

// 	//cy.wait('@updateuser').its('response.statusCode').should('eq', 200);
// 	//expect(response.status()).toBe(200);
// 	expect(responseBody.data).toHaveLength(6);
// 	console.log(responseBody.data[0]);
// });
