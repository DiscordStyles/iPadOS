// Used to build scss files to the BetterDiscord themes folder.

const chokidar = require('chokidar');
const sass = require('sass');
const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const themesFolder = dataFolder + '\\BetterDiscord\\themes';

const watcher = chokidar.watch('src', {persistent: true});
watcher.on('change', () => {
	sass.render({
		file: 'src/iPadOS.theme.scss',
		outputStyle: 'expanded'
	}, (err, result) => {
		if (err) {
			console.error(err);
			return false;
		}

		const newRes = Buffer.from(result.css).toString();

		postcss([autoprefixer])
			.process(newRes, {
				from: undefined,
				to: undefined
			})
			.then(postcssRes => {
				fs.writeFile(themesFolder+'\\iPadOS.theme.css', postcssRes.css, (err) => {
					if (err) console.error(err);
					else console.log('Built css file.');
				})
			})
	})
});
console.log('Watching for changes...');