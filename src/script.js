console.log('script running');
const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;

let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let source = document.getElementById('source');
let video = document.getElementById('vid');

console.log(vid);

source.addEventListener('click', () => {
	//console.log('source clicked');
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

	//console.log(inputSources);
}

async function streamVideo(streamSource) {
	console.log(streamSource.name);

	//document.getElementById('source').innerText = 'ghg';
	source.innerText = streamSource.name;

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
}
