// 随机数
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
// 调试相关
function getExceptionInfo(e) {
	var info = "";
	if (e) {
		if (e.description) {
			info += ('[description]' + e.description + "  ");
		}
		if (e.message) {
			info += ('[message]' + e.message);
		}

	} else {
		info = "can not get any execption information!";
	}
	return info;
}

// 如需要输出的日志信息失效，将debugPrintEnable赋值为false
var debugPrintEnable = true;

function debugPrint(type, msg) {
	if (false == debugPrintEnable) {
		return;
	}
	if ('undefined' == typeof(console)) {
		return;
	}
	if ('log' == type) {
		console.log(msg);
	} else if ('warning' == type) {
		console.warn(msg);
	} else if ('error' == type) {
		console.error(msg);
	}
}


function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	var canvasLoc = {
		x: (x - bbox.left) * (canvas.width / bbox.width),
		y: (y - bbox.top) * (canvas.height / bbox.height)
	};
	return canvasLoc;
}

function drawGrid(context, color, stepx, stepy) {
	context.save();
	context.strokeStyle = color;
	context.lineWidth = 0.5;

	for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, context.canvas.height);
		context.stroke();
		if (0 == ((i - 0.5) / stepx) % 10) {
			context.save();
			context.beginPath();
			context.moveTo(i, 0);
			context.lineTo(i, stepx * 1.0);
			context.strokeStyle = "gray";
			context.stroke();
			context.restore();
		}
	}

	for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(context.canvas.width, i);
		context.stroke();

		if (0 == ((i - 0.5) / stepy) % 10) {
			context.save();
			context.beginPath();
			context.moveTo(0, i);
			context.lineTo(stepx * 1.0, i);
			context.strokeStyle = "gray";
			context.stroke();
			context.restore();
		}
	}

	context.restore();
}

var swapItems = function(arr, index1, index2) {
	var temp = arr.splice(index2, 1, arr[index1]);
	arr[index1] = temp[0];
	return arr;
};

var AdvancedArray = function() {
	this.array = [];
	this.len = 0;
}

AdvancedArray.prototype.push = function(item) {
	this.array.push(item);
	this.len = this.array.length;
}

AdvancedArray.prototype.up = function(index) {
	if (index + 1 > this.len || index < 0) {
		throw "Index exceeded the range!";
		return;
	}
	if (0 < index) {
		swapItems(this.array, index, index - 1);
	}
}

AdvancedArray.prototype.down = function(index) {
	if (index + 1 > this.len || index < 0) {
		throw "Index exceeded the range!";
		return;
	}
	if (index < this.len - 1) {
		swapItems(this.array, index, index + 1);
	}
}

AdvancedArray.prototype.get = function(index) {
	if (index + 1 > this.len || index < 0) {
		//throw "Index exceeded the range!";
		return undefined;
	}
	return this.array[index];
}

AdvancedArray.prototype.length = function() {
	return this.array.length;
}

var PointPair = function(pt1, pt2) {
	this.pt1 = new Point(pt1.x, pt1.y);
	this.pt2 = new Point(pt2.x, pt2.y);
}

PointPair.prototype.move = function(x, y) {
	this.pt1.x += x;
	this.pt1.y += y;
	this.pt2.x += x;
	this.pt2.y += y;
}

PointPair.prototype.rotate = function(angle) {
	var pointsAround = {
		x: this.pt1.x,
		y: this.pt1.y
	};

	var xNew = (this.pt2.x - pointsAround.x) * Math.cos(angle) -
		(this.pt2.y - pointsAround.y) * Math.sin(angle) + pointsAround.x;
	var yNew = (this.pt2.x - pointsAround.x) * Math.sin(angle) +
		(this.pt2.y - pointsAround.y) * Math.cos(angle) + pointsAround.y;
	this.pt2.x = xNew;
	this.pt2.y = yNew;
}

PointPair.prototype.copy = function() {
	var ppNew = new PointPair(this.pt1, this.pt2);
	return ppNew;
}


var Line = function(strokeStyle, fillStyle) {
	this.points = [];
	this.strokeStyle = 'blue';
	this.fillStyle = 'white';
	if (strokeStyle) {
		this.strokeStyle = strokeStyle;
	}
	if (fillStyle) {
		this.fillStyle = fillStyle;
	}
};

Line.prototype.setPoints = function(points) {
	this.points = [];
	for (var i = 0; i < points.length; i++) {
		this.points.push(new Point(points[i].x, points[i].y));
	}
};

Line.prototype.createPath = function(context) {
	if (this.points.length === 0)
		return;

	context.beginPath();
	context.moveTo(this.points[0].x,
		this.points[0].y);

	for (var i = 0; i < this.points.length; ++i) {
		context.lineTo(this.points[i].x,
			this.points[i].y);
	}

};

Line.prototype.stroke = function(context) {
	context.save();
	context.lineWidth = 3;
	context.strokeStyle = this.strokeStyle;
	this.createPath(context);
	context.stroke();
	context.restore();
}