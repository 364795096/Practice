// 图层
// 一个图层可包含若干个绘图对象
// type: 0-路径 1-图像
var Layer = function(name){
	this.name = 'new layer';
	this.grahicObjects = new AdvancedArray(); // 元素格式：{type:X, obj:Y}
}

Layer.prototype.getSelectedObject = function(){
	
}

Layer.prototype.push = function(type, obj){
	var existed = false;
	for(var i=0; i<this.grahicObjects.length; i++){
		if(this.grahicObjects.length.obj == obj){
			existed = true;
		}
	}
	
	if(true == existed){
		throw "Graphic object is already exisited!";
		return;
	}
	
	this.grahicObjects.push({type: type, obj: obj});
}

Layer.prototype.setName = function(name){
	this.name = name;
}


var Layers = function(){
	this.layerArray = new AdvancedArray();
	this.activeLayerIndex = undefined;
}

Layers.prototype.print = function(){
	debugPrint("log", "Layers basic:");
	for(var i=i; i<this.layerArray.length(); i++){
		var layer = this.layerArray.get(i);
		var obj = layer.get(0);
		var log = "layer name: "+ layer.name;
		debugPrint("log", log);
	}
}

Layers.prototype.get = function(index){
	return this.layerArray.get(index);
}

// 添加新图层
Layers.prototype.push = function(layer){
	this.layerArray.push(layer);
}

// 图层向上移动
Layers.prototype.up = function(index){
	this.layerArray.up(layer);
}

// 图层向下移动
Layers.prototype.down = function(index){
	this.layerArray.down(layer);
}

Layers.prototype.setActiveLayer = function(index){
	if(index>=this.layerArray.length() || index <0){
		throw "Index is out of range!";
	}
	this.activeLayerIndex = index;
}

Layers.prototype.getActiveLayer = function(){
	return this.activeLayerIndex;
}

// 根据坐标获取选择的对象
Layers.prototype.getSelectedObject = function(x, y){
}
