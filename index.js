//imports
const fs = require("fs");
const process = require("process");
const stdin = process.stdin;
//local variables
let oldSize = 0;
const fileName = process.argv[2]; //?? "D:/Atlas/log/acquisition.log";

//set up stdin for processing input (code form internet with comments)
////////////////////////////////////////////////////////
// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);
// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();
// set up encoding for stdin info
stdin.setEncoding("utf8");
// handler for any data into stdin
stdin.on("data", function (key) {
	console.log(key);
	//processing "ctrl+c" ("END_OF_LINE") combination
	if (key === "\u0003") {
		process.exit();
		console.clear();
	}
	// write the key to stdout for prevent a crash of in-out process
	process.stdout.write(key);
	//my custom handler for keys
	if (key === "c") {
		console.clear();
	}
});
///////////////////////////////////////////////////////////
const checkFileExist = (path = "") => fs.existsSync(path);
const getSize = () => {
	fs.stat(fileName, async (err, stats) => {
		if (err) {
			console.error(err);
		}
		// console.log(stats.size);
		if (oldSize < stats.size) {
			let stream = fs.createReadStream(fileName, { start: oldSize, end: stats.size - 1 });
			stream.on("data", (chunk) => {
				console.log("===================================================");
				console.log(chunk.toString());
			});
			oldSize = stats.size;
		}
	});
};
if (checkFileExist(fileName)) {
	setInterval(getSize, 100);
} else {
	console.log("File doesn't exist. Check file path or choose another one file");
	process.exit();
}
