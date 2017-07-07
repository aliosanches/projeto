define([],function(){

	var Listar = function(html_id){
		"use strict";

		var main = this;
		this.html_id = html_id;
		this.dialog = $('[view_html_id="'+this.html_id+'"]');
		this.onclose = null;
		this.onsave = null;

		//elementos
		
		//variaveis

		//metodos
		this.show = function(){
			
		}

		this.addRow = function(item){
			
		}

		this.listar = function(){
			
		}

		this.unload = function(){
			main.dialog.remove();
			if(main.onclose && typeof main.onclose == 'function'){
				main.onclose();
			}
		}

		//eventos
	};

	return Listar;

});