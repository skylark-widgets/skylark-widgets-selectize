/**
 * skylark-widgets-selectize - The skylark selectize widgets library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-selectize/
 * @license MIT
 */
define(["skylark-widgets-base/Widget","./selectize"],function(e,t){"use strict";var i=e.inherit({_construct:function(t){e.pototype._construct.call(this,t,"div");var i=this;this.element.style.display="block",this.element.style.boxSizing="border-box",this.element.style.cursor="pointer",this.element.style.backgroundColor=Editor.theme.boxColor,this.element.style.borderRadius="4px",this.element.onclick=function(){i.setValue(!i.value),null!==i.onChange&&i.onChange(i.value)},this.check=document.createElement("img"),this.check.style.visibility="hidden",this.check.style.pointerEvents="none",this.check.style.position="absolute",this.check.style.top="20%",this.check.style.left="20%",this.check.style.width="60%",this.check.style.height="60%",this.check.src=Global.FILE_PATH+"icons/misc/check.png",this.element.appendChild(this.check),this.value=!1,this.onChange=null,this.disabled=!1},setDisabled:function(e){this.disabled=e,!0===this.disabled?(this.element.style.cursor="initial",this.element.style.pointerEvents="none"):(this.element.style.cursor="pointer",this.element.style.pointerEvents="auto")},setValue:function(e){this.value=e,this.check.style.visibility=this.value?"visible":"hidden"},getValue:function(){return this.value},setOnChange:function(e){this.onChange=e},updateVisibility:function(){this.element.style.visibility=this.visible?"visible":"hidden"},updateSize:function(){this.element.style.width=this.size.y+"px",this.element.style.height=this.size.y+"px"}});return t.CheckBox=i});
//# sourceMappingURL=sourcemaps/CheckBox.js.map
