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

	onMount(async () => {
		tasks = await api.getTasks();
		projects = await api.getProjects();
	});

	// calculate urgency for each task
	let tasksWithUrgency = $derived(
		tasks.map((task) => ({
			...task,
			urgency: calculateUrgency(task)
		}))
	);

	let tasksSortedByUrgency = $derived([...tasksWithUrgency].sort((a, b) => b.urgency - a.urgency));

	$effect(() => {
		console.log(tasksSortedByUrgency);
	});
</script>

<section class="mx-auto w-120 py-4">
	<h1 class="card-title">Tasks</h1>
	{#each tasksSortedByUrgency as task}
		{#if !task.isCompleted}
			<div id={task.id} class="my-4 flex rounded-lg bg-neutral text-neutral-content">
				<div class="flex-none p-4">
					<input class="checkbox" type="checkbox" />
				</div>
				<div class="flex-1 py-4 align-middle">{task.content}</div>
			</div>
		{/if}
	{/each}
</section>
