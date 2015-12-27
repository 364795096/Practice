var iconSelectionIndex = 0;
var fillColorStyle = 'gray';

function initComponent() {
	// 图标工具条

	var iconToolBar = new IconToolBar("iconCanvas");

	iconToolBar.setIconSepecification(2, 32, 12);
	iconToolBar.setIcon(0, "images/pen.png");
	iconToolBar.setIcon(1, "images/fill.png");
	iconToolBar.setIcon(2, "images/path.png");
	iconToolBar.setIcon(3, "images/color.png");
	iconToolBar.setIcon(4, "images/zoomin.png");
	iconToolBar.setIcon(5, "images/zoomout.png");
	iconToolBar.setIcon(6, "images/drag.png");



	iconToolBar.onSelectionChange = function(index) {
		iconSelectionIndex = index;
		if (3 == index) {
			colorPicker.show();
			pathView.hide();
		} else if (2 == index) {
			pathView.show();
			colorPicker.hide();
		} else {
			pathView.hide();
			colorPicker.hide();
		}

	}
	iconToolBar.drawIcons();
	// 颜色选择器
	var colorPicker = new PopupWindow("colorPicker", "mainBody", 300, 200);
	colorPicker.initialize = function() {
		this.redSlider = new COREHTML5.Slider('rgb(0,0,0)',
				'rgba(255,0,0,0.8)', 0),
			this.blueSlider = new COREHTML5.Slider('rgb(0,0,0)',
				'rgba(0,0,255,0.8)', 1.0),
			this.greenSlider = new COREHTML5.Slider('rgb(0,0,0)',
				'rgba(0,255,0,0.8)', 0.25),
			this.alphaSlider = new COREHTML5.Slider('rgb(0,0,0)',
				'rgba(255,255,255,0.8)', 0.5);
		this.redSlider.appendTo('redSliderDiv');
		this.blueSlider.appendTo('blueSliderDiv');
		this.greenSlider.appendTo('greenSliderDiv');
		this.alphaSlider.appendTo('alphaSliderDiv');
		this.alphaSlider.draw();
		this.redSlider.draw();
		this.greenSlider.draw();
		this.blueSlider.draw();
		var self = this;

		function updateColor() {
			var r = (self.redSlider.knobPercent * 255).toFixed(0),
				g = (self.greenSlider.knobPercent * 255).toFixed(0),
				b = (self.blueSlider.knobPercent * 255).toFixed(0),
				a = (self.alphaSlider.knobPercent * 255).toFixed(0);
			var colorStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a/255 + ')';
			iconToolBar.setIcon(3, "images/color.png", colorStyle);
			fillColorStyle = colorStyle;
		}

		// 拖动滑条，更新颜色
		this.redSlider.addChangeListener(function() {
			updateColor();
		});
		this.greenSlider.addChangeListener(function() {
			updateColor();
		});
		this.blueSlider.addChangeListener(function() {
			updateColor();
		});
		this.alphaSlider.addChangeListener(function() {
			updateColor();
		});
	}
	colorPicker.initialize();
	colorPicker.hide();

	var pathView = initPathView();
	pathView.hide();
}


var bezierPathArray = new AdvancedArray();
bezierPathArray.push(new BezierPath());
var bezierPathEdting = bezierPathArray.get(0);
function initPathView() {
	// 路径查看器
	var pathView = new PopupWindow("pathView", "mainBody", 300, 400);
	pathView.setTitle("Path View");
	//pathView.hide();

	var pathList = document.querySelector("#pathView #pathList");
	pathList.oncontextmenu = function(e) {
		e.preventDefault();
	}
	var selectionIndex = undefined;
	
	$('#pathView').on('click', '#add', function(e) {
		createNewPath();
		function createNewPath(){	
			var $items = $('.pathItem');
			
			var $pathItem = $('<div class="pathItem selected"></div>');
			var $img = $('<img src="images/pathDemo.png">');
			$pathItem.append($img);
			var $inputTitle = $('<input type="text" class="title" value="new path">');
			$pathItem.append($inputTitle);
			$pathItem.append($('<p style="clear: both;"></p>'));
			var $refNode = $($items[0]);
			$pathItem.insertBefore($refNode);
			$items.removeClass('selected');
			// 创建一条新路径
			var pathNew = new BezierPath();
			pathNew.setName("new path");
			bezierPathArray.push(pathNew);
			selectionIndex = bezierPathArray.len-1;
			bezierPathEdting = bezierPathArray.get(selectionIndex);
			bezierPathEdting = pathNew;
		}
	});
	$('#pathView').on('blur', '.title', function(e) {
		var path = bezierPathArray.get(selectionIndex);
		if(path){
			path.setName($(this).val());
		}	
	});
	
	$('#pathView').on('click', '.pathItem', function(e) {
		var $items = $('.pathItem');
		$items.removeClass('selected');
		for (var i = 0; i < $items.length; i++) {
			if ($items[i] == this) {
				//alert("biggo: "+i);
				$($items[i]).addClass('selected');
				// 逆向
				selectionIndex = $items.length-1-i;
				bezierPathEdting = bezierPathArray.get(selectionIndex);
				break;
			}
		}
	});

	$('#pathView').on('click', '#up', function(e) {
		if (undefined != selectionIndex) {
			if (bezierPathArray.len-1 <= selectionIndex) {
				return;
			}
			var $items = $('.pathItem');
			//if(0 >= selectionIndex){
			//	return;
			//}
			// 在html路径视图里，索引大的路径显示在更前面
			var htmlElemIndex = bezierPathArray.len-1-selectionIndex;
			var $refNode = $($items[htmlElemIndex - 1]);
			var $tarNode = $($items[htmlElemIndex]);
			$tarNode.insertBefore($refNode);
			//$items.length-1-i;
			bezierPathArray.down(selectionIndex);
			selectionIndex += 1;
			bezierPathEdting = bezierPathArray.get(selectionIndex);
		}
	});
	
	$('#pathView').on('click', '#down', function(e) {
		if (undefined != selectionIndex) {
			if (0 >= selectionIndex) {
				return;
			}
			var $items = $('.pathItem');
			
			// 在html路径视图里，索引大的路径显示在更前面
			var htmlElemIndex = bezierPathArray.len-1-selectionIndex;
			var $refNode = $($items[htmlElemIndex + 1]);
			var $tarNode = $($items[htmlElemIndex]);
			$tarNode.insertAfter($refNode);
			//$items.length-1-i;
			bezierPathArray.up(selectionIndex);
			selectionIndex -= 1;
			bezierPathEdting = bezierPathArray.get(selectionIndex);
		}
	});
	return pathView;
}

function getSelectedIconIndex() {
	return iconSelectionIndex;
}

function getFillColorStyle() {
	return fillColorStyle;
}

var DefaultProcessor = function() {}
DefaultProcessor.prototype.onClick = function(e) {};
DefaultProcessor.prototype.onMouseDown = function(e) {

};
DefaultProcessor.prototype.onMouseMove = function(e) {

};
DefaultProcessor.prototype.onMouseUp = function(e) {
	dragParam = undefined;
};
DefaultProcessor.prototype.onDblClick = function(e) {};



function drawBezierPaths(context){
	for(var i=0; i<bezierPathArray.len; i++){
		var path = bezierPathArray.get(i);
		path.showPath(context);
	}
	bezierPathEdting.showSelected(context);
}
// 跟缩放和Canvas平移相关的全局变量
var scale = 1;
var translateX = 0;
var translateY = 0;
// 标志刚刚拖拽过贝塞尔点，保证刚刚被选择的贝塞尔曲线，仍然处于被选择状态
var justDraggedBezierPoint = false; 
var selectedCurve = undefined;
var selectedCurveIndex = -1;
var selectedBezierPoint = undefined;
var curveSelectionTestResult = undefined;
var mouseRightButtonDown = false;
var interactionProcessor = [];
var dragParam = undefined;

function windowToCanvas(canvas, x, y, scale, tranX, tranY) {
	var bbox = canvas.getBoundingClientRect();
	var canvasLoc = {
		x: ((x - bbox.left) * (canvas.width / bbox.width) - scale * tranX) / scale,
		y: ((y - bbox.top) * (canvas.height / bbox.height) - scale * tranY) / scale
	};
	return canvasLoc;
}

function getCanvasLocation(e) {
	var x = e.x || e.clientX;
	var y = e.y || e.clientY;
	var loc = windowToCanvas(canvas, x, y, scale, translateX, translateY);
	return loc;
}

var penProcessor = {
	onClick: function(e) {
		var loc = getCanvasLocation(e);
		if (false == justDraggedBezierPoint) {
			selectedCurve = undefined;
		} else {
			// 避免拖动了控制点之后，已被选择的曲线失去选择
			justDraggedBezierPoint = false;
			return;
		}
		var testResult = bezierPathEdting.curveSelectionTest(loc.x, loc.y);
		if (undefined != testResult) {
			selectedCurve = testResult.curve;
			selectedCurveIndex = testResult.index;
		}
	},
	onMouseDown: function(e) {
		var loc = getCanvasLocation(e);
		e.preventDefault();
		if (0 == e.button) {
			if (undefined != selectedCurve) {
				// 如果没有点中，则返回undefined
				selectedBezierPoint = selectedCurve.hitBezierPoint(loc.x, loc.y);
				canvas.style.cursor = 'pointer';
			} else {
				selectedBezierPoint = undefined;
			}
		} else if (2 == e.button) {
			mouseRightButtonDown = true;
		}
	},
	onMouseMove: function(e) {
		var loc = getCanvasLocation(e);
		if (undefined != selectedBezierPoint) {
			bezierPathEdting.updateBezierPoint({
				x: loc.x,
				y: loc.y,
				pointIndex: selectedBezierPoint.index,
				curveIndex: selectedCurveIndex
			});
			justDraggedBezierPoint = true;
		}
	},
	onMouseUp: function(e) {
		e.preventDefault();
		selectedBezierPoint = undefined;
		canvas.style.cursor = 'crosshair';
		if (mouseRightButtonDown) {
			mouseRightButtonDown = false;
			bezierPathEdting.closePath();
		}
	},
	onDblClick: function(e) {
		var loc = getCanvasLocation(e);
		bezierPathEdting.push({
			x: loc.x,
			y: loc.y
		});
	}
}
var fillerProcessor = function() {}
fillerProcessor.prototype = new DefaultProcessor();
fillerProcessor.prototype.onClick = function(e) {
	bezierPathEdting.fill(getFillColorStyle());
}
var colorProcessor = function() {}
colorProcessor.prototype = new DefaultProcessor();
colorProcessor.prototype.onClick = function(e) {}

var ZoomInProcessor = function() {}
ZoomInProcessor.prototype = new DefaultProcessor();
ZoomInProcessor.prototype.onClick = function(e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.scale(1.25, 1.25);
	scale *= 1.25;
	translateX /= 1.25;
	translateY /= 1.25;
	context.clearRect(0, 0, canvas.width, canvas.height);
}
var ZoomOutProcessor = function() {} // 缩小
ZoomOutProcessor.prototype = new DefaultProcessor();
ZoomOutProcessor.prototype.onClick = function(e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.scale(0.8, 0.8);
	scale *= 0.8;
	context.clearRect(0, 0, canvas.width, canvas.height);
	translateX /= 0.8;
	translateY /= 0.8;
}


var DragProcessor = function() {}
DragProcessor.prototype = new DefaultProcessor();
DragProcessor.prototype.onMouseDown = function(e) {
	dragParam = {
		loc: getCanvasLocation(e)
	};
};

DragProcessor.prototype.onMouseUp = function(e) {
	loc = getCanvasLocation(e);
	var dx = loc.x - dragParam.loc.x;
	var dy = loc.y - dragParam.loc.y;

	console.log("drag, dx: " + dx + ", dy: " + dy);
	context.clearRect(0, 0, canvas.width, canvas.height);
	translateX += dx / scale;
	translateY += dy / scale;
	context.translate((dx / scale), dy / scale);
	dragParam = undefined;
};