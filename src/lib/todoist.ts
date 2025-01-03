import { TodoistApi, type Project, type Task as BaseTask } from '@doist/todoist-api-typescript';

export type Task = BaseTask & { urgency: number };

function calculateDaysUntilDue(dueDate: string): number {
	const due = new Date(dueDate);
	const now = new Date();

	const differenceInMillis = due.getTime() - now.getTime();
	return Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
}

function calculateUrgency(task: BaseTask): number {
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

export async function fetchTasks(accessToken: string): Promise<Task[]> {
	if (!accessToken) {
		return <Task[]>[];
	}

	const api = new TodoistApi(accessToken);
	const tasks: BaseTask[] = await api.getTasks();

	return tasks.map((task) => ({
		...task,
		urgency: calculateUrgency(task)
	}));
}

export async function fetchProjects(): Promise<Project[]> {
	return await api.getProjects();
}
