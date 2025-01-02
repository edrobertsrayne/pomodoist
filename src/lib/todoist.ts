import { env } from '$env/dynamic/public';
import { TodoistApi, type Project, type Task } from '@doist/todoist-api-typescript';
import { onMount } from 'svelte';

const api = new TodoistApi(env.PUBLIC_TODOIST_API_TOKEN);

function calculateDaysUntilDue(dueDate: string): number {
	const due = new Date(dueDate);
	const now = new Date();

	const differenceInMillis = due.getTime() - now.getTime();
	return Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
}

function calculateUrgency(task: Task): number {
	let urgency = 0;

	// calculate urgency based on due date
	if (task.due?.date) {
		const due = calculateDaysUntilDue(task.due.date);
		if (due <= -7) {
			urgency += 12;
		} else if (due >= 14) {
			urgency += 2.4;
		} else {
			urgency += 12 - 0.4571 * (due + 6);
		}
	}

	// calculate ugency based on priority
	urgency += (task.priority - 1) * 2;

	return urgency;
}

export let tasks = $state<Task[]>([]);
export let projects = $state<Project[]>([]);

export const fetchTasks = async () => {
	tasks = await api.getTasks();
	tasks = tasks
		.filter((task) => !task.isCompleted)
		.map((task) => ({
			...task,
			urgency: calculateUrgency(task)
		}))
		.sort((a, b) => b.urgency - a.urgency);
};

export const fetchProjects = async () => {
	projects = await api.getProjects();
	projects = projects
		.sort((a, b) => a.order - b.order)
		.map((project) => ({
			...project,
			isSelected: true
		}));
};

onMount(() => {
	fetchTasks();
	fetchProjects();
});
