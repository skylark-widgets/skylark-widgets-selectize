/**
 * skylark-widgets-selectize - The skylark selectize widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-selectize/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-widgets-selectize/selectize',[
	"skylark-langx/skylark"
],function(skylark) {
	var selectize = {};

	return skylark.attach("widgets.selectize",selectize);

});


define('skylark-widgets-selectize/CheckBox',[
	"skylark-widgets-base/Widget",
	"./selectize"
],function(Widget,selectize){
	"use strict";

	/**
	 * Check box input element.
	 * 
	 * @class CheckBox
	 * @extends {Widget}
	 * @param {Widget} parent Parent element.
	 */
	 var CheckBox = Widget.inherit({
		"_construct" : function (parent)
		{
			Widget.prototype._construct.call(this, parent, "div");

			var self = this;

			this.element.style.display = "block";
			this.element.style.boxSizing = "border-box";
			this.element.style.cursor = "pointer";
			this.element.style.backgroundColor = Editor.theme.boxColor;
			this.element.style.borderRadius = "4px";
			this.element.onclick = function()
			{
				self.setValue(!self.value);
				
				if(self.onChange !== null)
				{
					self.onChange(self.value);
				}
			};

			this.check = document.createElement("img");
			this.check.style.visibility = "hidden";
			this.check.style.pointerEvents = "none";
			this.check.style.position = "absolute";
			this.check.style.top = "20%";
			this.check.style.left = "20%";
			this.check.style.width = "60%";
			this.check.style.height = "60%";
			this.check.src = Global.FILE_PATH + "icons/misc/check.png";
			this.element.appendChild(this.check);

			/**
			 * Value stored in the checkbox.
			 *
			 * @property value
			 * @type {Boolean}
			 */
			this.value = false;

			/**
			 * On change callback function.
			 *
			 * @property onChange
			 * @type {Function}
			 */
			this.onChange = null;

			/** 
			 * If the checkbox is disabled the value cannot be edited.
			 *
			 * @attribute disabled
			 * @type {Boolean}
			 */
			this.disabled = false;
		},


		/**
		 * Set if element is disabled.
		 *
		 * When disabled the checkbox value cannot be edited.
		 *
		 * @method setDisabled
		 */
		setDisabled : function(value)
		{
			this.disabled = value;
			
			if(this.disabled === true)
			{
				this.element.style.cursor = "initial";
				this.element.style.pointerEvents = "none";
			}
			else
			{
				this.element.style.cursor = "pointer";
				this.element.style.pointerEvents = "auto";
			}
		},

		/**
		 * Set checkbox value.
		 * 
		 * @method setValue
		 * @param {Boolean} value
		 */
		setValue : function(value)
		{
			this.value = value;
			this.check.style.visibility = this.value ? "visible" : "hidden";
		},

		/**
		 * Get checkbox value.
		 * 
		 * @method getValue
		 * @return {Boolean} Value from the element.
		 */
		getValue : function()
		{
			return this.value;
		},

		/**
		 * Set onchange callback.
		 * 
		 * @method setOnChange
		 * @param {Function} callback
		 */
		setOnChange : function(callback)
		{
			this.onChange = callback;
		},

		updateVisibility : function()
		{
			this.element.style.visibility = this.visible ? "visible" : "hidden";
		},

		updateSize : function()
		{
			this.element.style.width = this.size.y + "px";
			this.element.style.height = this.size.y + "px";
		}

	 });



	return selectize.CheckBox = CheckBox;
});
define('skylark-widgets-selectize/DropdownList',[
	"skylark-widgets-base/Widget",
	"./selectize"
],function(Widget,selectize){
	"use strict";

	var DropdownList = Widget.inherit({
		"_construct" : function (parent)
		{
			Widget.prototype._construct.call(this, parent, "div");

			var skin = this.getSkin();

			// Select
			this.select = document.createElement("select");
			//this.select.style.backgroundColor = Editor.theme.boxColor;
			this.select.style.backgroundColor = skin.boxColor;
			//this.select.style.color = Editor.theme.textColor;
			this.select.style.color = skin.textColor;
			this.select.style.left = "0px";
			this.select.style.top = "0px";
			this.select.style.textIndent = "5px";
			this.select.style.borderStyle = "none";
			this.select.style.boxSizing = "border-box";
			this.select.style.borderRadius = "4px";
			this.select.style.outline = "none";
			this.select.style.cursor = "pointer";
			this.select.style.MozAppearance = "textfield";
			this.select.style.webkitAppearance = "caret";
			this.select.style.appearance = "textfield";
			this._elm.appendChild(this.select);

			// Arrow
			this.arrow = document.createElement("img");
			this.arrow.style.display = "block";
			this.arrow.style.position = "absolute";
			this.arrow.style.pointerEvents = "none";
			this.arrow.style.right = "6px";
			this.arrow.style.width = "10px";
			this.arrow.style.height = "10px";
			//this.arrow.src = Global.FILE_PATH + "icons/misc/arrow_down.png";
			this.arrow.src = skin.arrowDownIconUrl;
			this._elm.appendChild(this.arrow);

			// Attributes
			this.values = [];
		},


		/**
		 * Set the disabled state of the element.
		 *
		 * @method setDisabled
		 * @param {boolean} disabled
		 */
		setDisabled : function(value)
		{
			this.select.disabled = value;
		},

		/**
		 * Set onchange callback, called after changes.
		 *
		 * @method setOnChange
		 * @param {Function} onChange
		 */
		setOnChange : function(onChange)
		{
			this.select.onchange = onChange;
		},

		/**
		 * Add option to the dropdown list.
		 *
		 * @method addValue
		 * @param {string} text Label of the option.
		 * @param {Object} value Value of the option.
		 */
		addValue : function(text, value)
		{
			var option = document.createElement("option");
			option.appendChild(document.createTextNode(text));
			this.values.push(value);
			this.select.appendChild(option);
		},

		/**
		 * Remove all element from dropdown
		 *
		 * @method clearValues
		 */
		clearValues : function()
		{
			this.values = [];
			for(var i = 0; i < this.select.children.length; i++)
			{
				this.select.removeChild(this.select.children[i]);
			}
		},

		/**
		 * Get value stored in the input element.
		 *
		 * @method setValue
		 * @return {Object} Value stored in the input element.
		 */
		getValue : function()
		{
			if(this.select.selectedIndex > -1)
			{
				return this.values[this.select.selectedIndex];
			}
			return null;
		},

		/**
		 * Set value stored in the input element.
		 *
		 * @method setValue
		 * @param {Object} value
		 */
		setValue : function(value)
		{
			// Get value index
			for(var i = 0; i < this.values.length; i++)
			{
				if(this.values[i] === value)
				{
					this.select.selectedIndex = i;
					break;
				}
			}

			// If value not found set selectedIndex to -1
			if(i === this.values.length)
			{
				this.select.selectedIndex = -1;
			}
		},

		// Get dropdownlist selected index
		getSelectedIndex : function()
		{
			return this.select.selectedIndex;
		},

		// Set dropdownlist selected index
		setSelectedIndex : function(index)
		{
			this.select.selectedIndex = index;
		},

		updateVisibility : function()
		{
			this._elm.style.visibility = this.visible ? "visible" : "hidden";
		},

		updateSize : function()
		{
			Widget.prototype.updateSize.call(this);

			this.select.style.width = this.size.x + "px";
			this.select.style.height = this.size.y + "px";

			this.arrow.style.top = ((this.size.y - 10) / 2) + "px";
		}

	});


	return selectize.DropdownList = DropdownList;
});

define('skylark-widgets-selectize/main',[
	"./selectize",
	"./CheckBox",
	"./DropdownList"
],function(selectize){
	return selectize;
});
define('skylark-widgets-selectize', ['skylark-widgets-selectize/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-selectize.js.map
