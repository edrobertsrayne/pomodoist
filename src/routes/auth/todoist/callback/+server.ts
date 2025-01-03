import { error, redirect } from '@sveltejs/kit';
import { exchangeCodeForToken } from '$lib/server/todoist';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('todoist_oauth_state');

	if (!code || !state) {
		throw error(400, 'Missing required OAuth parameters');
	}

	if (state !== storedState) {
		throw error(403, 'Invalid state parameter');
	}

	try {
		const accessToken = await exchangeCodeForToken(code);

		// Store the access token securely (e.g., in a database or encrypted cookie)
		cookies.set('todoist_access_token', accessToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		// Clear the state cookie
		cookies.delete('todoist_oauth_state', { path: '/' });

		// Redirect to your app's dashboard or home page
	} catch (err) {
		console.error(err);
		throw error(500, 'Failed to complete OAuth flow');
	}

	throw redirect(302, '/');
};
