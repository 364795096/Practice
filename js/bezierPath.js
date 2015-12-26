// 构造函数，接受四个贝塞尔点作为参数
var BezierCurve = function(p0, p1, p2, p3) {
	this.p0 = {
		x: p0.x,
		y: p0.y
	};
	this.p1 = {
		x: p1.x,
		y: p1.y
	};
	this.p2 = {
		x: p2.x,
		y: p2.y
	};
	this.p3 = {
		x: p3.x,
		y: p3.y
	};
	this.samplePoints = [];
	this.getSamplePoints();
	this.closeInterval = 16;
	this.selected = false;
}

BezierCurve.prototype.getSamplePoints = function() {
	// 50个样点，用于判断是否被选中
	var samplePoints = [];
	for (var i = 0.00; i <= 1; i += 0.02) {
		var x = this.p0.x * Math.pow(1 - i, 3) + 3 * this.p1.x * i * Math.pow(1 - i, 2) +
			3 * this.p2.x * Math.pow(i, 2) * (1 - i) + this.p3.x * Math.pow(i, 3);
		var y = this.p0.y * Math.pow(1 - i, 3) + 3 * this.p1.y * i * Math.pow(1 - i, 2) +
			3 * this.p2.y * Math.pow(i, 2) * (1 - i) + this.p3.y * Math.pow(i, 3);
		samplePoints.push(new Point(x, y));
	}

	this.samplePoints = samplePoints;
}

BezierCurve.prototype.isPointCloseToMe = function(x, y) {
	for (var i = 0; i < this.samplePoints.length; i++) {
		var point = this.samplePoints[i];
		if (Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)) <= this.closeInterval) {
			return true;
		}
	}
	return false;
}

// 近似地计算贝塞尔曲线与指定点的距离
BezierCurve.prototype.getDistanceFrom = function(x, y){
	var distance = 100000; // 默认为100000，足够大
	var index = undefined;
	for (var i = 0; i < this.samplePoints.length; i++) {
		var point = this.samplePoints[i];
		var distanceTemp = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
		// 挑选出最短的距离
		if(distanceTemp<distance){
			distance = distanceTemp;
		}
		/*
		if ( <= this.closeInterval) {
			return true;
		}*/
	}
	return distance;
}

BezierCurve.prototype.select = function(selected) {
	this.selected = selected;
}

BezierCurve.prototype.isSelected = function() {
	return this.selected;
}

BezierCurve.prototype.hitBezierPoint = function(x, y) {
	// 整个曲线没有选中，则不能点中贝塞尔点
	if (false == this.selected) {
		return undefined;
	}
	var hitInterval = 4;
	// 检查是否点中了贝塞尔点
	// 返回的对象通过index字段指定当前点中的是第几个贝塞尔点
	if (Math.sqrt(Math.pow(this.p0.x - x, 2) + Math.pow(this.p0.y - y, 2)) <= hitInterval) {
		return {
			p: this.p0,
			index: 0
		};
	} else if (Math.sqrt(Math.pow(this.p1.x - x, 2) + Math.pow(this.p1.y - y, 2)) <= hitInterval) {
		return {
			p: this.p1,
			index: 1
		};
	} else if (Math.sqrt(Math.pow(this.p2.x - x, 2) + Math.pow(this.p2.y - y, 2)) <= hitInterval) {
		return {
			p: this.p2,
			index: 2
		};
	} else if (Math.sqrt(Math.pow(this.p3.x - x, 2) + Math.pow(this.p3.y - y, 2)) <= hitInterval) {
		return {
			p: this.p3,
			index: 3
		};
	}
	return undefined;
}

BezierCurve.prototype.draw = function(context) {
	context.save();

	context.beginPath();
	context.strokeStyle = 'orange';
	context.moveTo(this.p0.x, this.p0.y);
	context.bezierCurveTo(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
	context.stroke();
	// 被选中了，需要将贝塞尔点画出来
	if (this.selected) {
		// 端点红色
		context.strokeStyle = 'red';
		var circle = new Circle(this.p0.x, this.p0.y, 4);
		circle.strokeStyle = context.strokeStyle;
		context.lineWidth = 2;
		circle.stroke(context);

		circle = new Circle(this.p3.x, this.p3.y, 4);
		circle.strokeStyle = context.strokeStyle;
		circle.stroke(context);
		// 第二个端点实心
		circle.fillStyle = 'red';
		circle.fill(context);

		// 控制点绿色
		context.strokeStyle = 'green';
		circle = new Circle(this.p1.x, this.p1.y, 4);
		circle.strokeStyle = context.strokeStyle;
		context.lineWidth = 2;
		circle.stroke(context);
		circle = new Circle(this.p2.x, this.p2.y, 4);
		circle.strokeStyle = context.strokeStyle;
		circle.stroke(context);
		circle.fillStyle = 'green';
		circle.fill(context);
	}

	context.restore();
}

var BezierPath = function(){
	this.bezierCurves = [];
	this.firstPoint = undefined;
	this.closed = false;
	this.fillStyle = 'white';
	this.filled = false;
	this.selectedCurveIndex = undefined;
}

BezierPath.prototype.push = function(point){
	if(this.closed){
		throw "Bezier path has already been closed!";
		return;
	}
	// 当firstPoint没有设置时，push进来的一个点无法生成一条原始的贝塞尔曲线
	if(undefined == this.firstPoint){
		this.firstPoint = point;
	}
	else{
		var len = this.bezierCurves.length;
		var p0 = this.firstPoint;
		if(0 != len){
			// 上一条曲线的第二个端点成为心曲线的第一个端点
			p0 = {x: this.bezierCurves[len-1].p3.x, y: this.bezierCurves[len-1].p3.y};
		}
		
		var p3 = {x: point.x, y: point.y};
		// 新增的贝塞尔曲线，控制点默认居于两个端点中央，因此新增的贝塞尔曲线看起来如同一条直线。
		var x = (p0.x+p3.x)/2;
		var y = (p0.y+p3.y)/2;
		var pControl = {x: x, y: y};
		this.bezierCurves.push(new BezierCurve(p0, pControl, pControl, p3));
	}
}

BezierPath.prototype.showPath = function(context){
	if(undefined != this.firstPoint && 0 == this.bezierCurves.length){
		context.save();
		var circle = new Circle(this.firstPoint.x, this.firstPoint.y, 2);
		circle.strokeStyle = 'red';
		circle.stroke(context);
		context.restore();
	}
	context.save();
	context.beginPath();
	if(this.bezierCurves.length>0)
	{
		context.moveTo(this.bezierCurves[0].p0.x, this.bezierCurves[0].p0.y);	
	}
	
	for(var i=0; i<this.bezierCurves.length; i++){
		context.bezierCurveTo(this.bezierCurves[i].p1.x, this.bezierCurves[i].p1.y, 
			this.bezierCurves[i].p2.x, this.bezierCurves[i].p2.y,
			this.bezierCurves[i].p3.x, this.bezierCurves[i].p3.y);
		this.bezierCurves[i].getSamplePoints();
	}
	context.stroke();
	if(this.filled && this.closed){
		context.fillStyle = this.fillStyle;
		context.fill();
	}
	if(undefined != this.selectedCurveIndex){
		this.bezierCurves[this.selectedCurveIndex].draw(context);
	}
	context.restore();
}

BezierPath.prototype.closePath = function(){
	this.push({x: this.bezierCurves[0].p0.x, y: this.bezierCurves[0].p0.y});
	this.closed = true;
}

BezierPath.prototype.curveSelectionTest = function(x, y) {
	for (var i = 0; i < this.bezierCurves.length; i++) {
		this.bezierCurves[i].select(false);
	}
	var pass = false;
	var selectedCurve = undefined;
	var selectedCurveIndex = undefined;
	this.selectedCurveIndex = undefined;
	var distance = 100000;
	for (var i = 0; i < this.bezierCurves.length; i++) {
		var curve = this.bezierCurves[i];
		var distanceTemp = curve.getDistanceFrom(x, y);
		if(distanceTemp<distance){
			distance = distanceTemp;
			if(distance<=curve.closeInterval){
				// 选中的贝塞尔曲线，在显示时，会将端点和控制点也绘制出来
				curve.select(true);
				if(undefined != selectedCurve){
					// 找到更近的曲线，原来的曲线要取消选择
					selectedCurve.select(false);
				}
				// 新的曲线
				selectedCurve = curve;
				selectedCurveIndex = i;
				// 不中断循环，因为还可能找到与测试点距离更近的贝塞尔曲线
				// 这样是为了更精准地选择曲线，避免更近的曲线没有选择，更远的反而选择了的情况出现
				pass = true; 	
			}
		}
	}
	if(true == pass){
		this.selectedCurveIndex = selectedCurveIndex;
		return({curve: selectedCurve, index: selectedCurveIndex});
	}
	else{
		return undefined;
	}
}
BezierPath.prototype.updateBezierPoint = function(pointParam) {
	var curve = this.bezierCurves[pointParam.curveIndex];
	var p = curve.p0;
	if(1==pointParam.pointIndex){
		 p = curve.p1;
	}
	else if(2==pointParam.pointIndex){
		p = curve.p2;
	}
	else if(3==pointParam.pointIndex){
		p = curve.p3;
	}
	
	p.x = pointParam.x;
	p.y = pointParam.y;
	curve.getSamplePoints();
	
	// 如果拖动的是端点，那么前后的连接的曲线也要受影响
	// 拖动的是第一个端点
	if (0 == pointParam.pointIndex) {
		// 如果有前置的曲线
		if (pointParam.curveIndex > 0) {
			var pToProcess = this.bezierCurves[pointParam.curveIndex - 1].p3;
			pToProcess.x = pointParam.x;
			pToProcess.y = pointParam.y;
		}
		// 如果路径已经闭合，拖动了第一条曲线的第一个端点，最后一条曲线的第二个端点需要跟着联动
		if(0 == pointParam.curveIndex && true == this.closed){
			var pToProcess = this.bezierCurves[this.bezierCurves.length-1].p3;
			pToProcess.x = pointParam.x;
			pToProcess.y = pointParam.y;
		}
	}
	
	// 拖动的是第二个端点
	if (3 == pointParam.pointIndex) {
		if (pointParam.curveIndex < (this.bezierCurves.length - 1)) {
			var pToProcess = this.bezierCurves[pointParam.curveIndex + 1].p0;
			pToProcess.x = pointParam.x;
			pToProcess.y = pointParam.y;
		}
		if(this.bezierCurves.length-1 == pointParam.curveIndex && true == this.closed){
			var pToProcess = this.bezierCurves[0].p0;
			pToProcess.x = pointParam.x;
			pToProcess.y = pointParam.y;
		}
	}
	
}

/*
 * @descriptor fill方法不直接填充路径，而是在showPath方法中根据fill设置好的参数进行填充。
 */
BezierPath.prototype.fill = function(fillStyle){
	if(false == this.closed){
		throw "Bezier path has not been closed!";
		return;
	}
	this.fillStyle = fillStyle;
	this.filled = true;
}
