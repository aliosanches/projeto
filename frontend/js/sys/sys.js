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
	
	this.setSessionID = function(value){
		window.localStorage.setItem('sessao_id', value);
		sessao_id = value;
	}

	this.getSessionID = function(){
		return sessao_id;
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

		Util.load_pag('projeto/listar', function(html_id, obj){
            obj.show();
        });
	}
}