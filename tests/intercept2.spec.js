// @ts-check
const { test, expect } = require('@playwright/test');
const usersData = require('./users.json');

test('Intercept by Url', async ({ page }) => {
	await page.goto('https://reqres.in/');

	// Intercept network requests
	await page.route('**/api/users/', route => {
		const headers = route.request().headers();
		console.log(`Headers: ${JSON.stringify(headers)}`);
		//Delete the 'X-Secret' header if it exists
		if ('cookie' in headers) {
			delete headers['cookie'];
		}

		route.continue();
	});
	// Click on the element with data-id='users'
	await page.click('[data-id=users]');

	const response = await page.waitForResponse('**/api/users/');
	const responseBody = await response.json();

	expect(responseBody.data).toHaveLength(6);
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
