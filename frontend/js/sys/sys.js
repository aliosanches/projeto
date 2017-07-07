function SystemConfig(sessao_obj, elem) {
	'use strict'
	if(!elem){
		elem = $(document);
	}
	var main = this;
	this.dialog = elem;
	//elementos
	

	//variaveis
	var sessao_obj = sessao_obj;
	var sessao_id = sessao_obj.sessao_id;
	this.usuario = sessao_obj.usuario;
	this.menu_meus_projetos = this.dialog.find('#menu_meus_projetos');
	this.menu_perfil = this.dialog.find('#menu_perfil');
	this.menu_config = this.dialog.find('#menu_config');
	this.menu_usuarios = this.dialog.find('#menu_usuarios');
	this.menu_home = this.dialog.find('#menu_home');
	this.menu_minhas_atividades = this.dialog.find('#menu_minhas_atividades');
	this.menu_sair = this.dialog.find('#menu_sair');
	this.unloadObj = null;

	this.setSessionID = function(value){
		window.localStorage.setItem('sessao_id', value);
		sessao_id = value;
	}

	this.getSessionID = function(){
		return sessao_id;
	}
	this.unload = function(){
		if(typeof main.unloadObj == 'function'){
			main.unloadObj();
		}
	}
	this.refreshUserInfo = function(callback){
		Util.get
		(
			'usuario/dados', 
			{
				usuario_id: main.usuario.id,
				safemode: true
			}, 
			function(response){
				main.usuario = response;
				
				if(typeof callback == 'function'){
					callback(response);
				}

			}
		)
	}
	this.construct = function(){

		if(!sessao_id){
			throw 'Session not found!';
		}

		main.setSessionID(sessao_id);
		main.refreshUserInfo();
		main.menu_meus_projetos.unbind('click').click(function(){
			Util.load_pag('projeto/listar', function(html_id, obj){
				main.unload();
            	main.unloadObj = obj.unload;
            	obj.show();
        	});
		});

		main.menu_minhas_atividades.unbind('click').click(function(){
			main.unload();
			Util.load_pag('atividade/listar_user', function(html_id, obj){
				main.unloadObj = obj.unload;
            	obj.show();
        	});
		});

		main.menu_home.unbind('click').click(function(){
			main.unload();
			Util.load_pag('home/home', function(html_id, obj){
				main.unloadObj = obj.unload;
            	obj.show();
        	});
		});

		Util.load_pag('home/home', function(html_id, obj){
			main.unloadObj = obj.unload;
        	obj.show();
    	});
	}
}