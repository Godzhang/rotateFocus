(function(){
	var RotateFocus = function(options){
		this.opt = Object.assign({}, options);
		this.focus = this.opt.focus;
		this.li = Array.prototype.slice.call(this.focus.getElementsByTagName('li'));
		this.len = this.li.length;
		this.prev = this.opt.prev;
		this.next = this.opt.next;
		this.width = this.opt.width;
		this.height = this.opt.height;
		this.carrouselWidth = this.opt.carrouselWidth;
		this.carrouselHeight = this.opt.carrouselHeight;
		this.scale = this.opt.scale;
		this.autoPlay = this.opt.autoPlay || false;
		this.verticalAlign = this.opt.verticalAlign || 'middle';
		this.index = 0;
		this.rotateFlag = true;
		this.init();
	}	
	// RotateFocus.pos = 
	RotateFocus.prototype = {
		init: function(){
			var self = this;

			this.setFirstFrame();
			this.setOtherFrame();

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
		},
		rotateAnimate: function(dir){
			var self = this;
			var arr = [];
			if(dir === 'left'){
				
			}
			if(dir === 'right'){

			}
		},
		setFirstFrame: function(){
			var self = this;
			var firstFrame = this.li[0];

			this.focus.style.width = this.width + "px";
			this.focus.style.height = this.height + "px";

			firstFrame.style.zIndex = 1000;
			firstFrame.style.width = this.carrouselWidth + "px";
			firstFrame.style.height = this.carrouselHeight + "px";
			firstFrame.style.top = (this.height - this.carrouselHeight) / 2 + "px";
			firstFrame.style.left = (this.width - this.carrouselWidth) / 2 + "px";
		},
		setOtherFrame: function(){
			var self = this;

			var items = this.li.slice(1),
				level = Math.floor(this.li.length/2),
				leftItem = items.slice(0, level),
				rightItem = items.slice(level),
				btnWidth = (this.width - this.carrouselWidth) / 2,
				gap = btnWidth / level;
			//设置左面
			var i = 1;
			var leftWidth = self.carrouselWidth;
			var leftHeight = self.carrouselHeight;
			var zLoop1 = level;
			leftItem.forEach(function(val, index){
				leftWidth = leftWidth * self.scale;
				leftHeight = leftHeight * self.scale;

				val.style.width = leftWidth + "px";
				val.style.height = leftHeight + "px";
				val.style.top = (self.height - leftHeight) / 2 + "px";
				val.style.left = btnWidth - gap * i + "px";
				val.style.zIndex = zLoop1--;
				i++;
			});
			//设置右面
			var j = level;
			var rightWidth = leftWidth * this.scale;
			var rightHeight = leftHeight * this.scale;
			var zLoop2 = 1;
			rightItem.forEach(function(val, index){
				rightWidth = rightWidth / self.scale;
				rightHeight = rightHeight / self.scale;

				val.style.width = rightWidth + "px";
				val.style.height = rightHeight + "px";
				val.style.top = (self.height - rightHeight) / 2 + "px";
				val.style.right = btnWidth - gap * j + "px";
				val.style.zIndex = zLoop1++;
				j--;
			});
		}
		






	}










	window.RotateFocus = RotateFocus;
})();