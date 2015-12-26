
var iconSelectionIndex = 0;
var fillColorStyle = 'gray';

function initComponent() {
	var iconToolBar = new IconToolBar("iconCanvas");
	iconToolBar.setIconSepecification(2, 32, 12);
	iconToolBar.setIcon(0, "images/pen.png");
	iconToolBar.setIcon(1, "images/fill.png");
	iconToolBar.setIcon(2, "images/path.png");
	iconToolBar.setIcon(3, "images/color.png");
	iconToolBar.setIcon(4, "images/zoomin.png");
	iconToolBar.setIcon(5, "images/zoomout.png");
	iconToolBar.setIcon(6, "images/drag.png");
	
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
			var colorStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
			iconToolBar.setIcon(3, "images/color.png", colorStyle);
			fillColorStyle = colorStyle;
		}
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


	iconToolBar.onSelectionChange = function(index) {
		iconSelectionIndex = index;
		if (3 == index) {
			colorPicker.show();
		} else {
			colorPicker.hide();
		}
	}
	iconToolBar.drawIcons();
	colorPicker.hide();
}

function getSelectedIconIndex(){
	return iconSelectionIndex;
}
function getFillColorStyle(){
	return fillColorStyle;
}