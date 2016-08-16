// 可收起的工具条
// 依赖popupWindow.js
var FoldableTooBar = function(){
	this.id = undefined;
	this.width = 0;
	this.height = 0;
	this.top = 0;
	this.left = 0;
	this.target = undefined;
	this.parent = undefined;
	
	this.name = undefined;
	
	this.position = "left";
	this.indicatorImg = {
		folded: "images/arrowRight.png",
		unfolded: "images/arrowRight.png",
	}
	this.folded = false;
	this.moving = false;
}

FoldableTooBar.prototype = new PopupWindow();


FoldableTooBar.prototype.setName = function(name){
	this.name = name;
}

// position: 可取值：left, top, right, bottom
// 20151231: 目前只支持顶部位置
FoldableTooBar.prototype.initialize = function(id, parentId, width, height, position){
	this.constructor.prototype.initialize(id, parentId, width, height);
	
	this.id = id;
	// 访问父类的成员
	this.left = this.constructor.prototype.target.style.top.left;
	this.top = 0;
	this.width = width;
	this.height = height;
	
	this.position = position;
	if("left" == position){
		this.indicatorImg = {
			folded: "images/arrowRight.png",
			unfolded: "images/arrowLeft.png",
		}
	}else if("right" == position){
		
	}else if("top" == position){
		this.indicatorImg = {
			folded: "images/arrowDown.png",
			unfolded: "images/arrowUp.png",
		}
	}else{
		
	}
	
	var selector = "#"+id+" #head";
	var head = document.querySelector(selector);
	head.style.display = 'none';
	
	selector = "#"+id+" #close";
	var close = document.querySelector(selector);
	close.style.display = 'none';
	
	this.constructor.prototype.target.style.top = '0px';
	this.constructor.prototype.target.style.overflow = 'visible';
	
	selector = "#"+id+" #toolBarDirectionIndicator";
	var indicator = document.querySelector(selector);
	indicator.style.left = (width-48)/2 + 'px';
	
	selector = "#"+id+" .toolBarDirectionIndicatorMakeup";
	var indicatorMakeup = document.querySelector(selector);
	indicatorMakeup.style.left = (width-48)/2 + 'px';
	 
	var self = this;
	indicator.onclick = function(e){
		if(true == this.moving){
			return;
		}
		if(self.folded){
			self.unfold();
		}
		else{
			self.fold();		
		}
	}
	
}

FoldableTooBar.prototype.fold = function(){
	selector = "#"+this.id+" #toolBarDirectionIndicator";
	var indicator = document.querySelector(selector);
	indicator.setAttribute("src", this.indicatorImg.folded);
	var totalY = -(4+this.height) - (this.top);
	var changeTimes = 6;
	var dy = totalY/changeTimes;
	var self = this;
	var count = 0;
	this.moving = true;
	var timerHandle = setInterval(function(){
		self.top += dy;
		self.constructor.prototype.target.style.top = self.top+'px';
		count++;
		if(count>=changeTimes){
			clearInterval(timerHandle);
			timerHandle = undefined;
			this.moving = false;
		}
	}, 25);
	this.folded = true;
}

FoldableTooBar.prototype.unfold = function(){
	selector = "#"+this.id+" #toolBarDirectionIndicator";
	var indicator = document.querySelector(selector);
	indicator.setAttribute("src", this.indicatorImg.unfolded);
	var totalY = 0 - (this.top);
	var changeTimes = 6;
	var dy = totalY/changeTimes;
	var self = this;
	var count = 0;
	this.moving = true;
	var timerHandle = setInterval(function(){
		self.top += dy;
		self.constructor.prototype.target.style.top = self.top+'px';
		count++;
		if(count>=changeTimes){
			clearInterval(timerHandle);
			timerHandle = undefined;
			this.moving = false;
		}
	}, 25);
	this.folded = true;
	this.folded = false;
}

FoldableTooBar.prototype.show = function(){
	this.constructor.prototype.target.style.display = 'block';
}

FoldableTooBar.prototype.hide = function(){
	this.constructor.prototype.target.style.display = 'none';
}
