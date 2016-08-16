var IconToolBar = function(elemId) {
	this.canvas = document.getElementById(elemId);
	this.context = this.canvas.getContext("2d");
	this.timerHandle = undefined;
	this.initialize();
	this.normalWidth = this.canvas.offsetWidth;
	this.normalHeight = this.canvas.offsetHeight;
	this.currentWidth = this.normalWidth;
	this.currentHeight = this.normalHeight;
	this.minWidth = 24;
	this.minHeight = 24;
	this.sizeStatus = "normal"; // 可选：normal、minimized、resizing
	this.iconSpecification = {
		colums: 1,
		size: 32,
		interval: 16
	};

	this.icons = [];
	this.selectedIconIndex = 0;
}

// 工具条的头部，包含了一个最小化按钮
IconToolBar.prototype.drawHead = function() {
	var context = this.context;
	context.save();
	context.fillStyle = 'gray';
	context.fillRect(0, 0, this.canvas.width, 32);
	context.strokeStyle = 'white';
	context.lineWidth = 4;
	context.beginPath();
	context.moveTo(this.canvas.width - 24, 16);
	context.lineTo(this.canvas.width - 8, 16);
	context.stroke();

	context.restore();
}

IconToolBar.prototype.initialize = function() {
		this.drawHead();
		var self = this;
		this.canvas.addEventListener('click', function(e) {
			var x = e.x || e.clientX,
				y = e.y || e.clientY;
			// 处于正常状态的工具栏才可点击切换图标选择
			if ("normal" == self.sizeStatus) {
				var loc = windowToCanvas(self.canvas, x, y, 1, 0, 0);
				if (loc.x >= self.canvas.width - 24 && loc.x <= self.canvas.width - 8 &&
					loc.y >= 8 && loc.y <= 24) {
					self.minimize();
				} else {
					var selectChanged = false;
					for (var i = 0; i<self.icons.length; i++) {
						var icon = self.icons[i];
						try{
						if (loc.x >= icon.rect.x && loc.x <= icon.rect.x + icon.rect.size &&
							loc.y >= icon.rect.y && loc.y <= icon.rect.y + icon.rect.size) {
							//if (self.selectedIconIndex != icon.index) {
								selectChanged = true;
								self.selectedIconIndex = icon.index;
								self.onSelectionChange(icon.index);
							//}
							break;
						}
						}catch(e){
							throw "execption caught!";
						}
					}
					if (true == selectChanged) {
						self.drawIcons();
					}
				}
			} else if ("minimized" == self.sizeStatus) {
				self.normalize();
			}
		});
}

IconToolBar.prototype.onSelectionChange = function(index){
	
}
// setSurfaceSize、setElemSize不常用
IconToolBar.prototype.setSurfaceSize = function(width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
}
IconToolBar.prototype.setElemSize = function(width, height) {
	this.canvas.style.width = width + 'px';
	this.canvas.style.height = height + 'px';
}
IconToolBar.prototype.minimize = function() {
	var self = this;

	function shrinkGentley() {
		var canvas = self.canvas;
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		width = width * 0.875;
		height = height * 0.875;
		self.sizeStatus = "resizing";
		if (height < self.minWidth * 1.25 || width < self.minHeight * 1.25) {
			clearInterval(self.timerHandle);
			self.timerHandle = undefined;
			canvas.style.width = self.minWidth + "px";
			canvas.style.height = self.minHeight + "px";
			self.sizeStatus = "minimized";
		} else {
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
		}
	}
	this.timerHandle = setInterval(function() {
		shrinkGentley();
	}, 20);
}
IconToolBar.prototype.normalize = function() {
	var self = this;

	function magnifyGentley() {
		var canvas = self.canvas;
		var width = canvas.offsetWidth;
		var height = canvas.offsetHeight;
		if ("minimized" == self.sizeStatus) {
			if (self.normalHeight >= self.normalWidth) {
				width = self.minWidth;
				height = (self.normalHeight / self.normalWidth) * self.minWidth;
			}
		}
		self.sizeStatus = "resizing";
		width = width * 1.25;
		height = height * 1.25;
		if (height >= self.normalHeight * 0.9 || width >= self.normalWidth * 0.9) {
			clearInterval(self.timerHandle);
			self.timerHandle = undefined;
			canvas.style.width = self.normalWidth + "px";
			canvas.style.height = self.normalHeight + "px";
			self.sizeStatus = "normal";
		} else {
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
		}
	}
	this.timerHandle = setInterval(function() {
		magnifyGentley();
	}, 20);
}

// 设置图标的规格，包含列数，尺寸（宽和高一致，都用size表示）和间隔
IconToolBar.prototype.setIconSepecification = function(colums, size, interval) {
	if (colums * size + (colums - 1) * interval > this.normalWidth) {
		throw "Invalid Specification!";
	}
	this.iconSpecification.colums = colums;
	this.iconSpecification.size = size;
	this.iconSpecification.interval = interval;
}

IconToolBar.prototype.getIconRect = function(index) {
	var rowIndex = Math.floor(index / this.iconSpecification.colums);
	var columIndex = Math.floor(index % this.iconSpecification.colums);
	var marginHorizontal = this.iconSpecification.colums * this.iconSpecification.size +
		(this.iconSpecification.colums - 1) * this.iconSpecification.interval;
	marginHorizontal = (this.normalWidth - marginHorizontal) / 2;
	var x = marginHorizontal + columIndex * (this.iconSpecification.interval + this.iconSpecification.size);
	var y = 48 + rowIndex * (this.iconSpecification.interval + this.iconSpecification.size);
	return {
		x: x,
		y: y,
		size: this.iconSpecification.size
	};
}
IconToolBar.prototype.setIcon = function(index, imgUrl, fillStyle) {
	for(var i=0; i<this.icons.length; i++){
		// 已经存在，则仅需更新
		if(this.icons[i].index == index){
			this.icons[i].img = imgUrl;
			this.icons[i].fillStyle = fillStyle;
			this.drawIcons();
			return;
		}
	}
	var rect = this.getIconRect(index);
	this.icons.push({
		index: index,
		rect: {
			x: rect.x,
			y: rect.y,
			size: this.iconSpecification.size
		},
		img: imgUrl,
		fillStyle: fillStyle,
	});
	this.drawIcons();
}

IconToolBar.prototype.drawIcons = function() {
	var context = this.context;
	var selectedIndex = this.selectedIconIndex;
	context.fillStyle = 'rgba(236, 236, 236, 1)';
	context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.drawHead();

	for (var i = 0; i < this.icons.length; i++) {
		var icon = this.icons[i];
		drawIcon(icon, selectedIndex == icon.index);
	}
	// 把drawIcon提炼成一个单独的函数，除了代码更加易读，还有个原因就是：
	// 在for循环体中执行以下函数，发现只有最后一次循环的img.onload被触发。
	// var img = new Image();
	// ...
	// img.onload = function()
	function drawIcon(icon, selected) {
		var img = new Image();
		img.src = icon.img;

		context.save();
		context.lineWidth = 1;
		context.beginPath();

		context.moveTo(icon.rect.x, icon.rect.y);
		context.lineTo(icon.rect.x + icon.rect.size, icon.rect.y);
		context.lineTo(icon.rect.x + icon.rect.size, icon.rect.y + icon.rect.size);
		context.lineTo(icon.rect.x, icon.rect.y + icon.rect.size);
		context.lineTo(icon.rect.x, icon.rect.y);
		context.fillStyle = 'white';
		if(icon.fillStyle){
			context.fillStyle = icon.fillStyle;
		}
		context.strokeStyle = "gray";
		if (icon.index == selectedIndex) {
			context.shadowBlur = 6;
			context.shadowOffsetX = 3;
			context.shadowOffsetY = 3;
			context.shadowColor = 'black';
			context.strokeStyle = "black";
		}
		
		context.fill();
		context.stroke();
		context.restore();

		img.onload = function() {
			context.drawImage(img, 0, 0, img.width, img.height,
				icon.rect.x, icon.rect.y, icon.rect.size, icon.rect.size);
		}
	}
}

IconToolBar.prototype.getSelectedIconIndex = function() {
	return this.selectedIconIndex;
}