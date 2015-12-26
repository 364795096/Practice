var PopupWindow = function(id, parentId, width, height){
	this.width = width;
	this.height = height;
	this.target = document.getElementById(id);
	this.target.style.width = width+'px';
	this.target.style.height = height+'px';
	
	this.target.style.borderRadius = '4px';
	this.target.style.boxShadow = '2px 2px 4px black';
	this.target.style.position ='absolute';
	this.target.style.background = 'lightgray';
	
	this.parent = document.getElementById(parentId);
	
	// 父亲元素比目标更宽
	if(this.parent.offsetWidth>width){
		this.target.style.left = (this.parent.offsetWidth-width)/2+'px';
	}
	else{
		this.target.style.left = '0';
	}
	// 父亲元素比目标更高
	if(this.parent.offsetHeight>height){
		this.target.style.top = (this.parent.offsetHeight-height)/2+'px';
	}
	else{
		this.target.style.top = '0';
	}
	
	var head = document.createElement('div');
	head.style.width = width+'px';
	head.style.height = '32px';
	head.style.background = 'gray';
	this.target.appendChild(head);
	
	var close = document.createElement('p');
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
	//close.style.marginLeft = '268px';
	//close.style.background = 'lightgray';
	this.target.appendChild(close);
}

PopupWindow.prototype.show = function(){
	this.target.style.display = 'block';
}
PopupWindow.prototype.hide = function(){
	this.target.style.display = 'none';
}
