import { fetchTasks, fetchProjects } from '$lib/todoist';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const todoist_access_token = cookies.get('todoist_access_token');

	return {
		isConnectedTodoist: todoist_access_token ? true : false,
		tasks: await fetchTasks(todoist_access_token ? todoist_access_token : ''),
		projects: await fetchProjects(todoist_access_token ? todoist_access_token : '')
	};
};
