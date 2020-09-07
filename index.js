const timeUtils = {
	formatTime: (time) => {
		let negative = false;
		if (time < 0) {
			time = Math.abs(time);
			negative = true;
		}
		let timeString = '';
		const seconds = Math.floor(time / 100) % 60;
		const minutes = Math.floor(time / 6000);
		let hundredths = time % 100 < 10 ? `0${time % 100}` : time % 100;
		if (seconds <= 9) {
			timeString += `${minutes}:0${seconds}:${hundredths}`;
		} else {
			timeString += `${minutes}:${seconds}:${hundredths}`;
		}
		return negative ? `-${timeString}` : `${timeString}`;
	},
};
const changeBackgroundColor = (color) => {
	const body = document.querySelector('body');
	body.className = color;
};
class LapCounter {
	constructor() {
		this.lapTimes = [];
	}

	recordLap(lapTime) {
		this.lapTimes.unshift(lapTime);
		this.displayLap();
	}
	displayLap() {
		const lapList = document.querySelector('.lap-times ol');
		lapList.parentElement.removeAttribute('hidden');
		lapList.insertBefore(
			this.#createLapListItem(this.lapTimes[0]),
			lapList.firstElementChild
		);
	}
	#createLapListItem(time) {
		let newItem = document.createElement('li');
		newItem.className = 'lap-time-item';
		let lapNumSpan = document.createElement('span');
		lapNumSpan.textContent = this.lapTimes.length;
		newItem.appendChild(lapNumSpan);
		let lapTimeSpan = document.createElement('span');
		lapTimeSpan.textContent = timeUtils.formatTime(time);
		newItem.appendChild(lapTimeSpan);
		let timeDiffSpan = document.createElement('span');
		timeDiffSpan.textContent = this.#timeDiff(this.lapTimes[1], time);
		newItem.appendChild(timeDiffSpan);

		return newItem;
	}
	#timeDiff(oldTime, newTime) {
		if (this.lapTimes.length > 1) {
			return timeUtils.formatTime(newTime - oldTime);
		} else {
			return 'NA';
		}
	}

	resetLaps() {
		this.lapTimes = [];
		const lapList = document.querySelector('.lap-times ol');
		const newList = document.createElement('ol');
		lapList.parentElement.replaceChild(newList, lapList);
		newList.parentElement.setAttribute('hidden', 'true');
	}
}

class Stopwatch {
	constructor() {
		this.lapCounter = new LapCounter();
		this.time = 0;
		this.timerId;
		this.status = 'not-started';
	}
	start() {
		if (this.status !== 'started') {
			this.timerId = setInterval(() => {
				this.time += 1;
				this.update();
			}, 10);
			changeBackgroundColor('green');
			this.status = 'started';
		}
	}
	update() {
		const timeDiv = document.querySelector('.time');
		timeDiv.textContent = timeUtils.formatTime(this.time);
		if (
			this.time > this.lapCounter.lapTimes[0] &&
			this.lapCounter.lapTimes.length > 0
		) {
			changeBackgroundColor('red');
		} else {
			changeBackgroundColor('green');
		}
	}
	stop() {
		clearInterval(this.timerId);
		if (this.status === 'started') {
			changeBackgroundColor('orange');
			this.status = 'stopped';
		}
	}
	reset() {
		this.stop();
		this.timerId = null;
		this.time = 0;
		this.update();
		this.lapCounter.resetLaps();
		changeBackgroundColor('blue');
		this.status = 'not-started';
	}
	lap() {
		if (this.status === 'started') {
			this.lapCounter.recordLap(this.time);
			this.time = 0;
			this.start();
		}
	}
}

let sw = new Stopwatch();

const startBtn = document.querySelector('.start');
const stopBtn = document.querySelector('.stop');
const resetBtn = document.querySelector('.reset');
const lapBtn = document.querySelector('.lap');

startBtn.addEventListener('click', function () {
	sw.start();
});
stopBtn.addEventListener('click', function () {
	sw.stop();
});
resetBtn.addEventListener('click', function () {
	sw.reset();
});
lapBtn.addEventListener('click', function () {
	sw.lap();
});
