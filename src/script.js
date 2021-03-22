console.log('script running');
const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;

let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let source = document.getElementById('source');
let video = document.getElementById('vid');

console.log(source);

source.addEventListener('click', () => {
	console.log('source clicked');
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
				click: () => console.log(el.name),
			};
		})
	);

	sourceMenu.popup();

	//console.log(inputSources);
}
