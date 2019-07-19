var app = app || {};
app.hasJqueryObject = function($elem) {return $elem.length > 0;};

// Init Check Console
app.console = new function() {
	this.log = function(name) {console.log("pubLog : " + name + " is added");};
	this.error = function(name) {console.log("pubError : " + name + " is not init");};
	this.reset = function(name) {console.log("Reset : "+ name +" Reset Complete");};
};

// Module Manager
// add - app.moduleManager.add("name", func);
// find - app.moduleManager.find("name");
// all - app.moduleManager.all();
// reset - app.moduleManager.reset();
app.moduleManager = new function() {
	var _that = this;
	_that.hash = {};
	_that.arr = [];
	_that.add = function(name, func) {
		var _func = new func();
		app.console.log(name);
		return _that.hash[name] = _func, _that.arr.push({ name: name, func: _func}), _that;
	};

	_that.find = function(name) {
		return _that.hash[name];
	};

	_that.all = function() {
		return _that.arr;
	};

	_that.reset = function() {
		for (var i = 0; i < _that.arr.length; i++) {
			if (_that.arr[i].func.isInit) {
				if (typeof _that.arr[i].func.reset === "function") {
					_that.arr[i].func.reset();
					app.console.reset(_that.arr[i].name);
				}
			} else {
				app.console.error(_that.arr[i].name);
			}
		}
	};
};

// Center Align
// @params
// $el - Selector
app.align = function(el) {
	if (el === undefined) return;
	var winWidth = app.$window.width();
	var winHeight = app.$window.height();
	el.each(function(){
		if ($(this).is(":visible")) {
			var popWidth = el.outerWidth(true);
			var popHeight = el.outerHeight(true);
			$(this).css({"top": (winHeight- popHeight) *.5, "left": (winWidth - popWidth) *.5});
		}
	});
};

// UI
// find = app.UI.find(String);
// all = app.UI.all();
// reset = app.UI.reset();
// init = app.UI.startup();
app.UI = new function() {
	this.find = function(name) {
		return app.moduleManager.find(name);
	};

	this.all = function() {
		return app.moduleManager.all();
	};

	this.reset = function() {
		return app.moduleManager.reset();
	};

	this.addModule = function() {
		if (app.hasJqueryObject( app.$body.find(".initTab")) && app.moduleManager.find("app.tab") === undefined ) app.moduleManager.add("app.tab", app.tab);
	};

	this.init = function() {
		if (app.hasJqueryObject( app.$body.find(".initTab")) && app.moduleManager.find("app.tab").isInit === undefined ) app.moduleManager.find("app.tab").init();
	};

	this.startup = function() {
		app.UI.addModule();
		app.UI.init();
	};
};

$(function() {
	app.$window = $(window);
	app.$body = $("body");
	app.$dim = app.$body.find(".dim");
	app.UI.startup();
});