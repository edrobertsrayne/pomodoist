<script lang="ts">
	import TaskList from '$lib/components/TaskList.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import { user } from '$lib/firebase';
	import { page } from '$app/state';
</script>

<Timer />

{#if $user}
	{#if page.data.isConnectedTodoist}
		<TaskList />
	{:else}<div class="flex justify-center py-8">
			<div class="btn-large btn btn-outline btn-primary">
				<a href="/auth/todoist">Connect to Todoist</a>
			</div>
		</div>
	{/if}
{/if}
