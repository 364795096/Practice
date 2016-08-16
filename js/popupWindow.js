var PopupWindow = function(){
	this.id = undefined;
	this.width = 0;
	this.height = 0;
	this.top = 0;
	this.left = 0;
	this.target = undefined;
	this.parent = undefined;
	
	//this.initialize(id, parentId, width, height);
}

PopupWindow.prototype.initialize = function(id, parentId, width, height){
	this.id = id;
	this.width = width;
	this.height = height;
	// 总体
	this.target = document.getElementById(id);
	this.target.style.width = width+'px';
	this.target.style.height = height+'px';
	this.target.style.borderRadius = '4px';
	this.target.style.boxShadow = '2px 2px 4px black';
	this.target.style.position ='absolute';
	this.target.style.background = 'rgb(236, 236, 236)';
	this.target.style.overflow = 'hidden';
	
	this.parent = document.getElementById(parentId);
	// 父亲元素比目标更宽
	if(this.parent.offsetWidth>width){
		this.left = (this.parent.offsetWidth-width)/2;
	}
	this.target.style.left = this.left+'px';
	// 父亲元素比目标更高
	if(this.parent.offsetHeight>height){
		this.top = (this.parent.offsetHeight-height)/2;
	}
	this.target.style.top = this.top+'px';
	
	// head
	var head = document.createElement('div');
	head.setAttribute('id', 'head');
	head.style.width = width+'px';
	head.style.height = '32px';
	head.style.background = 'gray';
	head.style.position = 'absolute';
	head.style.left = '0';
	head.style.top = '0';
	var title = document.createElement('p');
	
	title.style.height = '32px';
	title.style.lineHeight = '32px';
	title.style.marginLeft = '16px';
	title.setAttribute("id", "title");
	
	head.appendChild(title);
	
	this.target.appendChild(head);
	
	// 关闭按钮
	var close = document.createElement('p');
	close.setAttribute('id', 'close');
	close.innerHTML = "╳";
	close.style.width = '32px';
	close.style.position = 'absolute';
	close.style.left = '268px';
	close.style.top = '0';
	close.style.fontSize = '24px';
	close.style.lineHeight = '32px';
	close.style.height = '32px';
	close.style.color = 'white';
	
	var self = this;
	close.onclick = function(){
		self.hide();
	}
	this.target.appendChild(close);
}
PopupWindow.prototype.setTitle = function(title){
	var selector = "#" + this.id+ " " + "#title";
	var titleElem = document.querySelector(selector);
	titleElem.innerHTML = title;
}
PopupWindow.prototype.show = function(){
	
	var timerHandle = undefined;
	var self = this;
	// 缓慢弹出
	
	var count = 0;
	var delta = 100;
	this.target.style.top = (this.top-delta)+'px';
	this.target.style.display = 'block';
	
	timerHandle = setInterval(function(){
		self.target.style.top = (self.top-delta+count*10)+'px';
		count++;
		if(count >= 10){
			clearInterval(timerHandle);
			timerHandle = undefined;
		}
		
	}, 25);
	
	
}
PopupWindow.prototype.hide = function(){
	this.target.style.display = 'none';
}
