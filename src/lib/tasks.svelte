<script lang="ts">
	import { TodoistApi, type Task, type Project } from '@doist/todoist-api-typescript';
	import { env } from '$env/dynamic/public';
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

	let tasks = $state<Task[]>([]);
	let projects = $state<Project[]>([]);

	async function fetchTasks() {
		tasks = await api.getTasks();
		projects = await api.getProjects();

		tasks = tasks
			.map((task) => ({
				...task,
				urgency: calculateUrgency(task)
			}))
			.sort((a, b) => b.urgency - a.urgency);
	}

	onMount(() => fetchTasks());
</script>

<section class="mx-auto w-120 py-4">
	<h1 class="card-title">Tasks</h1>
	{#each tasks as task}
		{#if !task.isCompleted}
			<div id={task.id} class="alert my-4">
				<input class="checkbox-primary checkbox" type="checkbox" />
				<span>{task.content}</span>
			</div>
		{/if}
	{/each}
</section>
