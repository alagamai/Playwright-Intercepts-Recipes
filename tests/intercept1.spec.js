// @ts-check
const { test, expect } = require('@playwright/test');
const usersData = require('./users.json');

test('Intercept by Url', async ({ page }) => {
	await page.goto('https://reqres.in/');

	// Intercept network requests
	await page.route('**/api/users/', route => {
		route.continue();
	});
	// Click on the element with data-id='users'
	await page.click('[data-id=users]');

	const response = await page.waitForResponse('**/api/users/');
	const responseBody = await response.json();

	expect(responseBody.data).toHaveLength(6);
});

test('Intercept by modifying response using req.fulfill method', async ({
	page,
}) => {
	await page.goto('https://reqres.in/');

	const postsRoute = await page.route('**/api/users/', req => {
		req.fulfill({
			body: JSON.stringify({
				data: [
					{
						name: 'John',
						job: 'QA Manager',
					},
					{
						name: 'Peter',
						job: 'QA Lead',
					},
				],
			}),
		});
		//route.continue(); // Allow other requests to continue unchanged
	});

	await page.click('[data-id=post]');

	const response = await page.waitForResponse('**/api/users/');
	const responseBody = await response.json();

	//cy.wait('@updateuser').its('response.statusCode').should('eq', 200);
	// expect(response.status()).toBe(200);
	expect(responseBody.data).toHaveLength(2);
	console.log(responseBody.data[0]);
});

test('Stubbing a response with a fixture file', async ({ page }) => {
	await page.goto('https://reqres.in/');

	const postsRoute = await page.route('**/api/users', req => {
		req.continue({
			//status: 200,
			method: 'POST',
			postData: JSON.stringify(usersData),
		});
		// req.continue(); // Allow other requests to continue unchanged
	});

	await page.click('[data-id=post]');

	// Wait for the intercepted request to complete
	const response = await page.waitForResponse('**/api/users', {
		timeout: 5000,
	});
	const responseBody = await response.json();

	//cy.wait('@updateuser').its('response.statusCode').should('eq', 200);
	//expect(response.status()).toBe(200);
	expect(responseBody.data).toHaveLength(6);
	console.log(responseBody.data[0]);
});

test('Stubbing a response With string', async ({ page }) => {
	await page.goto('https://reqres.in/');

	await page.route('https://reqres.in/api/users', route => {
		route.continue({
			method: 'POST',
			postData: JSON.stringify({ data: ['success Alagammai!!!!'] }),
		});
	});
	// await page.goto('https://reqres.in/');
	await page.click('[data-id=post]');

	const response = await page.waitForResponse('https://reqres.in/api/users');
	const responseBody = await response.json();
	//cy.wait('@getUsers').its('response.body.data').should('have.length', 6);
	console.log(responseBody.data);
});
