function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	var canvasLoc = {
		x: (x - bbox.left) * (canvas.width / bbox.width),
		y: (y - bbox.top) * (canvas.height / bbox.height)
	};
	return canvasLoc;
}

var swapItems = function(arr, index1, index2) {
	var temp = arr.splice(index2, 1, arr[index1]);
	arr[index1] = temp[0];
	return arr;
};

var AdvancedArray = function(){
	this.array = [];
	this.len = 0;
}

AdvancedArray.prototype.push = function(item){
	this.array.push(item);
	this.len = this.array.length;
}

AdvancedArray.prototype.up = function(index){
	if(index+1>this.len || index<0){
		throw "Index exceeded the range!";
		return;
	}
	if(0 < index){
		swapItems(this.array, index, index-1);
	}
}

AdvancedArray.prototype.down = function(index){
	if(index+1>this.len || index<0){
		throw "Index exceeded the range!";
		return;
	}
	if(index<this.len-1){
		swapItems(this.array, index, index+1);
	}
}

AdvancedArray.prototype.get = function(index){
	if(index+1>this.len || index<0){
		//throw "Index exceeded the range!";
		return undefined;
	}
	return this.array[index];
}

AdvancedArray.prototype.length = function(){
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