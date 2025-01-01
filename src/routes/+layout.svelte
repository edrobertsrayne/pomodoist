<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import '../app.css';
	let { children } = $props();

	import { auth, user } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const user = await signInWithPopup(auth, provider);
		console.log(user);
	}
</script>

<nav class="navbar mb-8 bg-primary text-primary-content">
	<div class="flex-1">
		<btn class="btn btn-ghost text-xl">Pomodoist</btn>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="#" aria-label="Settings">Settings</a></li>
			{#if $user}
				<li><button onclick={() => signOut(auth)}>Logout</button></li>
			{:else}
				<li><button onclick={signInWithGoogle}>Sign In with Google</button></li>
			{/if}
		</ul>
	</div>
</nav>

{@render children()}
