console.log('script running');
const { desktopCapturer, remote } = require('electron');
const { writeFile } = require('fs');
const { dialog, Menu } = remote;

//
let mediaRecorder;
const recordedChunks = [];
//

let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let source = document.getElementById('source');
let vid = document.getElementById('vid');
let screenHeading = document.getElementById('screen');

startBtn.addEventListener('click', () => {
	mediaRecorder.start();
	startBtn.innerText = 'Recording...';
	startBtn.style.backgroundColor = '#d42222';
});

stopBtn.addEventListener('click', () => {
	mediaRecorder.stop();
	startBtn.innerText = 'Record 🎥';
	startBtn.style.backgroundColor = '#249c24';
});

source.addEventListener('click', () => {
	getSources();
});

async function getSources() {
	const inputSources = await desktopCapturer.getSources({
		types: ['window', 'screen'],
	});

	const sourceMenu = Menu.buildFromTemplate(
		inputSources.map(el => {
			return {
				label: el.name,
				click: () => {
					streamVideo(el);
				},
			};
		})
	);

	sourceMenu.popup();
}

async function streamVideo(streamSource) {
	console.log(streamSource.name);

	source.innerText = 'Source - ' + streamSource.name;
	screenHeading.innerText = 'Source => ' + streamSource.name;

	const videoStream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: streamSource.id,
			},
		},
	});

	vid.srcObject = videoStream;
	vid.play();

	mediaRecorder = new MediaRecorder(videoStream, { mimeType: 'video/webm; codecs=vp9' });

	mediaRecorder.ondataavailable = function (e) {
		console.log('video data available');
		recordedChunks.push(e.data);
	};

	mediaRecorder.onstop = async function (e) {
		const blob = new Blob(recordedChunks, {
			type: 'video/webm; codecs=vp9',
		});

		const buffer = Buffer.from(await blob.arrayBuffer());

		const { filePath } = await dialog.showSaveDialog({
			buttonLabel: 'Save video',
			defaultPath: `vid-${Date.now()}.webm`,
		});

		if (filePath) {
			writeFile(filePath, buffer, () => console.log('video saved successfully!'));
		}
	};
}
