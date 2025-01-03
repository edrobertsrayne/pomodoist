import { TODOIST_CLIENT_ID, TODOIST_CLIENT_SECRET } from '$env/static/private';

const TODOIST_AUTH_URL = 'https://todoist.com/oauth/authorize';
const TODOIST_TOKEN_URL = 'https://todoist.com/oauth/access_token';

export function getAuthorizationUrl(state: string) {
	const params = new URLSearchParams({
		client_id: TODOIST_CLIENT_ID,
		scope: 'task:add,data:read',
		state,
		response_type: 'code'
	});

	return `${TODOIST_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
	const response = await fetch(TODOIST_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: TODOIST_CLIENT_ID,
			client_secret: TODOIST_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code'
		})
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error || 'Failed to exchange code for token');
	}

	return data.access_token;
}
