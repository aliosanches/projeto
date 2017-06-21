define([],function(){

	var Login = function(html_id){
		"use strict";

		var main = this;
		this.html_id = html_id;
		this.dialog = $('[view_html_id="'+this.html_id+'"]');
		this.onclose = null;
		this.onsave = null;

		//elementos
		this.edt_usuario = this.dialog.find('.edt_usuario');
		this.edt_senha = this.dialog.find('.edt_senha');
		this.btn_entrar = this.dialog.find('.btn_entrar');
		this.btn_esqueci = this.dialog.find('.btn_esqueci');
		
		//metodos
		this.show = function(){
			var sessao_id = window.localStorage.getItem('sessao_id');
			if(sessao_id != null && sessao_id != '' && sessao_id.length == 32){
				$(main.btn_entrar[0]).trigger('click');	
			}
		}


		this.unload = function(){
			main.dialog.remove();
			if(main.onclose && typeof main.onclose == 'function'){
				main.onclose();
			}
		}

		//eventos
		this.btn_entrar.unbind('click');
		this.btn_entrar.click(function(e){
			
			Util.post
			(
				'usuario/login', 
				{
					usuario: main.edt_usuario.val(),
					senha: md5(main.edt_senha.val()),
				}, 
				function(response){
					Util.sys = new SystemConfig(response);
					Util.sys.construct();
					main.unload();
				}
			);
		});

		this.btn_esqueci.unbind('click');
		this.btn_esqueci.click(function(e){
			alertModal({
				title: 'Recuperacao de Senha',
				text: 	'<div class="row">'+
							'<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'+
								'<div class="">'+
									'<label class="" for="edt_email">E-mail*</label>'+
									'<input type="text" id="edt_email" maxlength="150" class="edt_email form-control">'+
								'</div>'+
							'</div>'+
					  	'</div>',
				fnLoad: function(modal_id, modal){

				},
				utilizaConfirm: true,
				fnConfirm: function(modal_id, modal, e){
					var edt_email = modal.find('.edt_email');
					
					Util.post
					(
						'usuario/esqueciSenha', 
						{
							email: edt_email.val()
						}, 
						function(response){
							modal.remove();
						}
					);
				},
				utilizaCancel: true,
				titleCancel: 'Cancelar',
				ignoraConfirmClose: true
			});
		});
	};

	return Login;

});