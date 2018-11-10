﻿test();
//benchmark();

// Performs several conversions and compares the result for equality.
function test() {
	testData(-65);
	testData(-11114294967299);
	testData(4294967298);
	testData(new Date(2001, 1 /*Feb*/, 3, 4, 5, 6));
	testData(new Date(2110, 1 /*Feb*/, 3, 4, 5, 6));
	testData(new Date(0x3ffffffff * 1000 + 50));
	testData(new Date(0xfffffffff * 1000 + 50));
	testData(new Uint8Array([1, 2, 3, 200]));
	logLine("Expected to fail:");
	testData(new Uint32Array([1, 2, 3, 200000]));
}	
	
function testData(data) {
	let dataStr = format(data);
	
	logLine("data = " + dataStr);
	console.log("data =", data);
	
	// Perform the conversion and back
	let bin = serializeMsgPack(data);
	let binStr = format(bin, true);
	
	logLine("bin = " + binStr);
	console.log("bin =", bin);
	
	// Demo: Deserialize a plain Array
	//bin = toArray(bin);
	//bin = Uint16Array.from(bin);
	//logLine("bin = " + format(bin, true));
	//console.log("bin =", bin);
	
	//let data2 = msgpack.decode(bin);   // external library: kawanet/msgpack-lite
	let data2 = deserializeMsgPack(bin);   // this library
	
	// NOTE: Workaround for datetime decoding which is not supported by kawanet/msgpack-lite
	//if (data2.type === 255 && data2.buffer.length === 4) {
	//	let sec = ((data2.buffer[0] << 24) >>> 0) +
	//		((data2.buffer[1] << 16) >>> 0) +
	//		((data2.buffer[2] << 8) >>> 0) +
	//		data2.buffer[3];
	//	console.log("sec", sec);
	//	data2 = new Date(sec * 1000);
	//}
	//if (data2.type === 255 && data2.buffer.length === 8) {
	//	let ns = ((data2.buffer[0] << 22) >>> 0) +
	//		((data2.buffer[1] << 14) >>> 0) +
	//		((data2.buffer[2] << 6) >>> 0) +
	//		(data2.buffer[3] >>> 2);
	//	let pow32 = 0x100000000;   // 2^32
	//	let sec = ((data2.buffer[3] & 0x3) * pow32) +
	//		((data2.buffer[4] << 24) >>> 0) +
	//		((data2.buffer[5] << 16) >>> 0) +
	//		((data2.buffer[6] << 8) >>> 0) +
	//		data2.buffer[7];
	//	console.log("sec", sec, "ns", ns);
	//	data2 = new Date(sec * 1000 + ns / 1000000);
	//}
	//if (data2.type === 255 && data2.buffer.length === 12) {
	//	let ns = ((data2.buffer[0] << 24) >>> 0) +
	//		((data2.buffer[1] << 16) >>> 0) +
	//		((data2.buffer[2] << 8) >>> 0) +
	//		data2.buffer[3];
	//	let pow32 = 0x100000000;   // 2^32
	//	let hi = ((data2.buffer[4] << 24) >>> 0) +
	//		((data2.buffer[5] << 16) >>> 0) +
	//		((data2.buffer[6] << 8) >>> 0) +
	//		data2.buffer[7];
	//	let lo = ((data2.buffer[8] << 24) >>> 0) +
	//		((data2.buffer[9] << 16) >>> 0) +
	//		((data2.buffer[10] << 8) >>> 0) +
	//		data2.buffer[11];
	//	let sec = hi * pow32 + lo;
	//	console.log("sec", sec, "ns", ns);
	//	data2 = new Date(sec * 1000 + ns / 1000000);
	//}

	let data2Str = format(data2);

	logLine("data2 = " + data2Str);
	console.log("data2 =", data2);

	// Compare original and deserialized data
	if (dataStr === data2Str) {
		logLine("<span style='color: green;'>Test passed.</span>");
	}
	else {
		logLine("<span style='color: red;'>Test FAILED.</span>");
	}
	logLine();
}

// Runs several functions in a loop to measure the time spent.
function benchmark() {
	// Define the data to test with
	let data = {
		number1: 1,
		number2: 20,
		number3: 200,
		number4: 200000,
		number5: 8000000000000,
		number6: -1,
		number7: -200,
		number8: -8000000000000,
		number9: 0.3,
		number10: 123.456,
		number11: -100.234,
		number12: -456789.345,
		number13: -0.127666,
		text1: "Abc",
		text2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel odio vehicula, commodo turpis non, fringilla mi. Sed ornare urna ut accumsan cursus.",
		text3: "In fermentum dui convallis, finibus velit ut, aliquam urna. Fusce vitae arcu dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut efficitur aliquet nulla, euismod sodales lorem blandit eu. Etiam rhoncus felis non nunc aliquam ullamcorper.",
		text4: " Mauris vestibulum nibh nec gravida ullamcorper. Donec congue fermentum arcu, a interdum leo sollicitudin nec. Quisque pharetra nisl vitae lacinia iaculis. Donec egestas, dui eget faucibus tincidunt, dui eros sodales mauris, lobortis porta mauris odio eu dui. In vestibulum sodales felis, non faucibus eros volutpat vitae.",
		text5: "この記事の内容の信頼性について検証が求められています。確認のための文献や情報源をご存じの方はご提示ください。出典を明記し、記事の信頼性を高めるためにご協力をお願いします。議論はノートを参照してください。（2008年11月）",
		text6: "Some emoticons: 🐀򐀀 🐀򐰀 🐀򠠀 🐀򡀀",
		flag: true,
		list1: [ 1, 2, "A", "bc", false ],
		list2: [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ],
		list3: [ 123, 4567, 89012, 345678, 9012345, 67890123, 456789012, 3456789012, 34567890123 ],
		list4: [ 0.123, 1.234, 2.3456, 3.45678, 4.5678901, 5.1234567, 6.123456 ],
		list5: [ "A", "Bb", "C", "Dd", "E", "Ff", "G", "Hh", "I", "Jj" ],
		obj1: {
			a: 123,
			b: 456,
			c: 1.2,
			d: "Text",
			obj: {
				x: 0,
				y: 4096,
				z: -3
			}
		}
	};
	
	let dataStr = format(data);
	logLine("<b>Test data:</b> " + dataStr);
	logLine();

	// Convert the data to MsgPack and back to verify correctness
	let bin = serializeMsgPack(data);
	//let bin = msgpack.encode(data);

	let bin1 = serializeMsgPack(data);
	let bin2 = new Uint8Array(msgpack.encode(data));
	let binStr1 = format(bin1, true);
	let binStr2 = format(bin2, true);
	if (binStr1 !== binStr2) {
		logLine("Mismatch of MsgPack bytes between libraries:");
		logLine("<b>msgpack.js:</b> " + binStr1.substr(0, 200));
		logLine("<b>msgpack-lite:</b> " + binStr2.substr(0, 200));
	}
	else {
		logLine("MsgPack bytes are the same with both libraries.");
	}
	logLine();
	
	let data2Str = format(deserializeMsgPack(bin));
	if (dataStr !== data2Str) {
		logLine("Mismatch between original and processed data:");
		logLine("<b>original:</b> " + dataStr);
		logLine("<b>deserialized:</b> " + data2Str);
	}
	else {
		logLine("Data is correctly serialized and deserialized.");
	}
	logLine();

	data2Str = format(msgpack.decode(bin));
	if (dataStr !== data2Str) {
		logLine("Mismatch between original and processed data:");
		logLine("<b>original:</b> " + dataStr);
		logLine("<b>deserialized (msgpack-lite):</b> " + data2Str);
	}
	else {
		logLine("Data is correctly serialized and then deserialized with msgpack-lite.");
	}
	logLine();

	// Initialise the benchmark loop	
	let step = 0;
	let steps = 10;
	let minTime = -1;

	// Start the first iteration without blocking the browser for the entire benchmark duration
	logLine("Starting benchmark...");
	setTimeout(run, 100);
	
	function run() {
		step++;
		let t0 = Math.round(performance.now());
		// NOTE: performance.now is only accurate to a few milliseconds. This is compensated by making the test run longer.
		for (let i = 0; i < 20000; i++) {
			// Call the function to benchmark
			let bin2 = serializeMsgPack(data);   // 660 / 1370 / 2250 / 2600 (Chrome / Firefox / Edge / IE11) [ms]
			//let bin2 = msgpack.encode(data);   // 580 / 1750 / 1730 / 2490
			//let data2 = deserializeMsgPack(bin);   // 620 / 1310 / 2240 / 890
			//let data2 = msgpack.decode(bin);   // 400 / 630 / 1380 / 1720
		}
		let t1 = Math.round(performance.now());
		logLine(step + "/" + steps + ": " + (t1 - t0) + " ms");
		if (minTime === -1)
			minTime = t1 - t0;
		else
			minTime = Math.min(minTime, t1 - t0);

		// Stop after a number of iterations and show the minimum time spent
		if (step < steps)
			setTimeout(run, 100);
		else
			logLine("Minimum time: <b>" + minTime + " ms</b>");
	}
}

// ==================== Helper functions ====================

function log(str) {
	document.getElementById("log").innerHTML += str;
}

function logLine(str) {
	log((str || "") + "<br>");
}

function format(value, hexNumbers) {
	switch (typeof(value)) {
		case "undefined": return "undefined";
		case "boolean": return value ? "true" : "false";
		case "number": return (hexNumbers ? "0x" + padStart(value.toString(16), 2, "0") : value.toString());
		case "string": return JSON.stringify(value);
		case "symbol": return "symbol";
		case "function": return "function";
		case "object":
			if (value === null) return "null";
			if (Array.isArray(value)) {
				return "Array(" + value.length + ") [" + value.map(function (x) { return format(x, hexNumbers); }).reduce(function (a, b) { return a + ", " + b; }) + "]";
			}
			if (value instanceof Date) {
				return "Date " + value.toISOString();
			}
			let className = getClassName(value);
			if (className) {
				if (className.match(/((Int|Uint)(8|16|32)(Clamped)?|Float(32|64))Array$/)) {
					return className + "(" + value.length + ") [" + toArray(value).map(function (x) { return format(x, hexNumbers); }).reduce(function (a, b) { return a + ", " + b; }) + "]";
				}
				return className + "(" + Object.keys(value).length + ") [" + Object.keys(value).map(function (k) { return k + ": " + format(value[k], hexNumbers); }).reduce(function (a, b) { return a + ", " + b; }) + "]";
			}
			return "object";
		default: return typeof(value);
	}
	
	function getClassName(obj) {
		if (obj.constructor.name) return obj.constructor.name;
		let match = obj.toString().match(/ (\w+)/);
		if (match) return match[1];
		return "?";
	}
	
	function padStart(str, length, pad) {
		if (str.padStart) return str.padStart(length, pad);
		while (str.length < length) {
			str = pad + str;
		}
		return str;
	}
}

function toArray(arr) {
	if (Array.from) return Array.from(arr);
	return [].slice.call(arr);
}
