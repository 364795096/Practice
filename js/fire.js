$(document).ready(function() {

	// 设置绘图表面
	var space = document.getElementById("surface");
	var context = space.getContext("2d");
	context.scale(1, 1);

	// 设置粒子，许多的粒子的行为叠加，从而实现了火焰效果
	var particles = [];
	var particle_count = 120;
	for (var i = 0; i < particle_count; i++) {
		particles.push(new particle());
	}
	var time = 0;
	// Set wrapper and canvas items size
	/*
	var canvasWidth = 320;
	var canvasHeight = 480;
	$(".wrapper").css({
		width: canvasWidth,
		height: canvasHeight
	});
	$("#surface").css({
		width: canvasWidth,
		height: canvasHeight
	});*/

	// 不是所有浏览器都实现了W3C所定义的requestAnimationFrame方法，为了兼容各浏览器,
	// 定义requestAnimFrame方法替代requestAnimationFrame方法。
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 6000 / 60);
			};
	})();

	// 粒子
	function particle() {
		// 粒子的速度、位置、直径、寿命、颜色等参数都采用随机的方式赋值
		this.speed = {
			x: -1 + Math.random() * 2, // 水平方向上，可能向左或向右
			y: -5 + Math.random() * 5 // 垂直方向上，保持向上
		};
		canvasWidth = (document.getElementById("surface").width);
		canvasHeight = (document.getElementById("surface").height);
		this.location = {
			x: canvasWidth / 2,
			y: (canvasHeight / 2) + 35
		};

		this.radius = 0.5 + Math.random() * 1;

		this.life = 10 + Math.random() * 10; // 时间以毫秒计
		this.death = this.life;

		this.r = 255;
		this.g = Math.round(Math.random() * 155);
		this.b = 0;
	}

	function ParticleAnimation() {
		context.globalCompositeOperation = "source-over";
		context.fillStyle = "black";

		// 清空绘图表面
		context.fillRect(0, 0, canvasWidth, canvasHeight);
		// 图像的合成模式是“变亮”。变亮说白了就是rgb相加，
		context.globalCompositeOperation = "lighter";

		// 重绘每一个粒子
		for (var i = 0; i < particles.length; i++) {
			var p = particles[i];

			context.beginPath();
			// 剩余生命越短，透明度越低
			p.opacity = Math.round(p.death / p.life * 100) / 100;

			var gradient = context.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			//gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
			gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
			context.fillStyle = gradient;
			context.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
			context.fill();
			p.death--;
			p.radius++;
			p.location.x += (p.speed.x);
			p.location.y += (p.speed.y);

			// 如果粒子已经死亡，或者粒子因直接太小而不可见，重新产生一个粒子代替它
			if (p.death < 0 || p.radius < 0) {
				//a brand new particle replacing the dead one
				particles[i] = new particle();
			}
		}



		requestAnimFrame(ParticleAnimation);

	}

	ParticleAnimation();

});