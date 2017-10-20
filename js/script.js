;(function(){
	var RotateFocus = function(el, options){
		this.default = {
			prevClass: 'prev',
			nextClass: 'next',
			childTag: 'li',
			scale: 0.9,
			autoPlay: false,
			verticalAlign: 'middle',
			speed: 500,
			interval: 4000,
			isOpacity: true
		};
		this.opt = Object.assign({}, this.default, options);
		this.focus = el;
		this.li = Array.prototype.slice.call(this.focus.getElementsByTagName(this.opt.childTag));//获取所有子项的数组形式
		this.len = this.li.length;
		this.prev = this.getByClass(this.focus, this.opt.prevClass);
		this.next = this.getByClass(this.focus, this.opt.nextClass);
		this.width = this.opt.width;  												//容器宽度
		this.height = this.opt.height;												//容器高度
		this.carrouselWidth = this.opt.carrouselWidth;								//首帧宽度
		this.carrouselHeight = this.opt.carrouselHeight;							//首帧高度
		this.scale = this.opt.scale;											    //缩放比例
		this.autoPlay = this.opt.autoPlay;											//是否自动轮播
		this.verticalAlign = this.opt.verticalAlign;								//图片对齐方式
		this.isOpacity = this.opt.isOpacity;										//是否设置透明度
		this.rotateFlag = true;														
		this.speed = this.opt.speed;												//过渡时间ms
		this.timer = null;
		this.interval = this.opt.interval;											//自动轮播间隔
		this.count = 0;
		this.list = this.li.slice();
		this.init();
	}
	RotateFocus.prototype = {
		init: function(){
			var self = this;
			//设置容器宽高
			this.focus.style.width = this.width + "px";
			this.focus.style.height = this.height + "px";
			//设置第一帧
			this.setFirstFrame();
			//设置其他帧
			this.setOtherFrame();
			//左右点击事件
			this.prev.onclick = function(){
				if(self.rotateFlag){
					self.rotateFlag = false;
					self.rotateAnimate('left');
				}
			}
			this.next.onclick = function(){
				if(self.rotateFlag){
					self.rotateFlag = false;
					self.rotateAnimate('right');
				}
			}
			//自动轮播
			if(this.autoPlay){
				this.timer = setInterval(function(){
					self.next.onclick();
				}, this.interval);
				this.focus.onmouseenter = function(){
					clearInterval(self.timer);
				}
				this.prev.onmouseenter = function(){
					clearInterval(self.timer);
				}
				this.next.onmouseenter = function(){
					clearInterval(self.timer);
				}
				this.focus.onmouseleave = function(){
					self.timer = setInterval(function(){
						self.next.onclick();
					}, self.interval);
				}
				this.prev.onmouseleave = function(){
					self.timer = setInterval(function(){
						self.next.onclick();
					}, self.interval);
				}
				this.next.onmouseleave = function(){
					self.timer = setInterval(function(){
						self.next.onclick();
					}, self.interval);
				}
			}

		},
		rotateAnimate: function(dir){
			var self = this;
			if(dir === 'left'){
				var zIndexArr = [];
				this.li.forEach(function(cur, index){
					var nextLi = self.li[++index] ? self.li[index] : self.li[0],
						width = nextLi.offsetWidth,
						height = nextLi.offsetHeight,
						top = nextLi.offsetTop,
						left = nextLi.offsetLeft;

					zIndexArr.push({zIndex: nextLi.style.zIndex, opacity: nextLi.style.opacity});

					self.animate(cur, {
						width: width,
						height: height,
						top: top,
						left: left
					}, function(){
						self.list.unshift(self.list.pop());
						self.rotateFlag = true;
					});
				});

				this.li.forEach(function(val, index){
					val.style.zIndex = zIndexArr[index].zIndex;
					if(self.isOpacity){
						val.style.opacity = zIndexArr[index].opacity;
					}					
				})
			}
			if(dir === 'right'){
				var zIndexArr = [];
				this.li.forEach(function(cur, index){
					var prevLi = self.li[--index] ? self.li[index] : self.li[self.len-1],
						width = prevLi.offsetWidth,
						height = prevLi.offsetHeight,
						top = prevLi.offsetTop,
						left = prevLi.offsetLeft;

					zIndexArr.push({zIndex: prevLi.style.zIndex, opacity: prevLi.style.opacity});
					self.animate(cur, {
						width: width,
						height: height,
						top: top,
						left: left
					}, function(){
						self.list.push(self.list.shift());
						self.rotateFlag = true;
					});
				});

				this.li.forEach(function(val, index){
					val.style.zIndex = zIndexArr[index].zIndex;
					if(self.isOpacity){
						val.style.opacity = zIndexArr[index].opacity;
					}
				})
			}
		},
		animate: function(elem, json, fn){
			var self = this;

			clearInterval(elem.timer);
			elem.timer = setInterval(function(){
				var flag = true;
				for(var k in json){
					if(k === 'opacity'){
						var start = self.getStyle(elem, k) * 100,
							end = json[k] * 100,
							step = (end - start) / 5;
						step = step > 0 ? Math.ceil(step) : Math.floor(step);
						start += step;
						elem.style[k] = start / 100;
					}else if(k === 'zIndex'){
						elem.style.zIndex = json[k];
					}else{
						var start = parseInt(self.getStyle(elem, k)) || 0,
							end = json[k],
							step = (end - start) / 5;
						step = step > 0 ? Math.ceil(step) : Math.floor(step);
						start = start + step;
						elem.style[k] = start + "px";
					}
					if(start != end){
						flag = false;
					}
				}
				if(flag){
					self.count++;
					clearInterval(elem.timer);
					if(fn && self.count === self.len){
						fn();
						self.count = 0;
					}
				}
			}, 17);
		},
		setFirstFrame: function(){
			var self = this;
			var firstFrame = this.li[0];

			firstFrame.style.zIndex = Math.floor(this.len / 2);
			firstFrame.style.width = this.carrouselWidth + "px";
			firstFrame.style.height = this.carrouselHeight + "px";
			firstFrame.style.top = (this.height - this.carrouselHeight) / 2 + "px";
			firstFrame.style.left = (this.width - this.carrouselWidth) / 2 + "px";
		},
		setOtherFrame: function(){
			var self = this;

			var items = this.li.slice(1),
				level = Math.floor(this.len/2),
				rightItem = items.slice(0, level),
				leftItem = items.slice(level),
				sideWidth = (this.width - this.carrouselWidth) / 2,
				gap = sideWidth / level;
			//设置右面
			var i = 1;
			var rightWidth = this.carrouselWidth;
			var rightHeight = this.carrouselHeight;
			var zLoop1 = level;
			rightItem.forEach(function(val, index){
				rightWidth = rightWidth * self.scale;
				rightHeight = rightHeight * self.scale;

				val.style.width = rightWidth + "px";
				val.style.height = rightHeight + "px";
				val.style.top = self.setVertical(rightHeight);
				val.style.left = sideWidth + self.carrouselWidth + i * gap - rightWidth + "px";
				val.style.zIndex = --zLoop1;
				if(self.isOpacity){
					val.style.opacity = 1 / i;
				}				
				i++;
			});
			//设置左面
			var j = level;
			var leftWidth = rightWidth;
			var leftHeight = rightHeight;
			var zLoop2 = zLoop1;
			leftItem.forEach(function(val, index){
				val.style.width = leftWidth + "px";
				val.style.height = leftHeight + "px";
				val.style.top = self.setVertical(leftHeight);
				val.style.left = index * gap + "px";
				val.style.zIndex = zLoop2++;
				if(self.isOpacity){
					val.style.opacity = 1 / j;
				}				
				j--;
				leftWidth = leftWidth / self.scale;
				leftHeight = leftHeight / self.scale;
			});
		},
		setVertical: function(ver){
			if(this.verticalAlign === 'top'){
				return 0 + "px";
			}else if(this.verticalAlign === 'bottom'){
				return this.height - ver + "px";
			}else{
				return (this.height - ver) / 2 + "px";
			}
		},
		getByClass: function(box, className){
			var self = this;
			var all = box.getElementsByTagName('*'),
				reg = new RegExp("(^|\\s+)" + className + "(\\s+|$)");

			for(var i = 0, len = all.length; i < len; i++){
				if(reg.test(all[i].className)){
					return all[i];
				}
			}
		},
		getStyle: function(elem, attr){
			if(window.getComputedStyle){
				return window.getComputedStyle(elem)[attr];
			}else{
				return obj.currentStyle[attr];
			}
		}
	}

	var rotate = function(el, options){
		new RotateFocus(el, options);
	}


	window.rotate = rotate;
})();