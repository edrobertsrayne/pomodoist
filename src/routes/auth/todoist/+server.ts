import { redirect } from '@sveltejs/kit';
import { getAuthorizationUrl } from '$lib/server/todoist';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = crypto.randomUUID();
	cookies.set('todoist_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	});

	throw redirect(302, getAuthorizationUrl(state));
};
