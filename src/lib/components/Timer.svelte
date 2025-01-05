<script lang="ts">
	import { onDestroy } from 'svelte';

	let timeLeft = $state(25 * 60);
	let duration = timeLeft.valueOf();
	let isRunning = $state(false);
	let isBreak = $state(false);
	let interval = null;

	const POMODORO_TIME = 25 * 60;
	const SHORT_BREAK_TIME = 5 * 60;
	const LONG_BREAK_TIME = 15 * 60;
	let pomodoroCount = 0;

	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const secondsRemaining = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
	}

	function startTimer() {
		if (!isRunning) {
			isRunning = true;
			interval = setInterval(() => {
				if (timeLeft > 0) {
					timeLeft--;
				} else {
					handleTimerComplete();
				}
			}, 1000);
		}
	}

	function pauseTimer() {
		if (isRunning) {
			isRunning = false;
			clearInterval(interval);
		}
	}

	function resetTimer() {
		pauseTimer();
		timeLeft = isBreak ? SHORT_BREAK_TIME : POMODORO_TIME;
		duration = timeLeft;
	}

	function handleTimerComplete() {
		pauseTimer();
		if (!isBreak) {
			pomodoroCount++;
			isBreak = true;
			timeLeft = pomodoroCount % 4 === 0 ? LONG_BREAK_TIME : SHORT_BREAK_TIME;
		} else {
			isBreak = false;
			timeLeft = POMODORO_TIME;
		}
		duration = timeLeft;
		playNotification();
	}

	function playNotification() {
		if (Notification.permission === 'granted') {
			new Notification(isBreak ? 'Time to work' : 'Take a break');
		}
	}

	function requestNotificationPermission() {
		if ('Notification' in window && Notification.permission !== 'granted') {
			Notification.requestPermission();
		}
	}

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div class="flex justify-center">
	<div class="card w-120 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-title justify-center">
				<button class="btn btn-active btn-sm">Pomodoro</button>
				<button class="btn btn-sm">Short Break</button>
				<button class="btn btn-sm">Long Break</button>
			</div>
			<div class="my-8 text-center text-8xl font-bold">{formatTime(timeLeft)}</div>
			<progress class="progress mx-auto my-4 w-80" value={duration - timeLeft} max={duration}
			></progress>
			<div class="card-actions justify-center">
				{#if isRunning}
					<button onclick={pauseTimer} class="btn btn-primary">Pause Timer</button>
				{:else}
					<button onclick={startTimer} class="btn btn-primary">Start Timer</button>
				{/if}
			</div>
		</div>
	</div>
</div>
