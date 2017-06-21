define([],function(){

	var EditarPerfil = function(html_id){
		"use strict";

		var main = this;
		this.html_id = html_id;
		this.dialog = $('[view_html_id="'+this.html_id+'"]');
		this.onclose = null;
		this.onsave = null;

		//elementos
		this.edt_usuario = this.dialog.find(".edt_usuario");
		this.edt_nome = this.dialog.find(".edt_nome");
		this.edt_sobrenome = this.dialog.find(".edt_sobrenome");
		this.edt_email = this.dialog.find(".edt_email");
		this.edt_senha = this.dialog.find(".edt_senha");
		this.edt_data_nascimento = this.dialog.find('.edt_data_nascimento');
		this.edt_ocupacao = this.dialog.find('.edt_ocupacao');
		this.edt_telefone = this.dialog.find('.edt_telefone');
		this.edt_celular = this.dialog.find('.edt_celular');
		this.cbo_sexo = this.dialog.find('.cbo_sexo');
		this.cbo_cidade = this.dialog.find('.cbo_cidade');
		this.cbo_estado = this.dialog.find('.cbo_estado');
		this.cbo_pais = this.dialog.find('.cbo_pais');
		this.img_usuario = this.dialog.find('.img_usuario');
		this.btn_concluir = this.dialog.find(".btn_concluir");
		this.span_validauser = this.dialog.find('.span_validauser');
		this.span_validaemail = this.dialog.find('.span_validaemail');
		this.edt_foto = this.dialog.find('.edt_foto');
		this.btn_editar_foto = this.dialog.find('.btn_editar_foto');
		this.edt_observacoes = this.dialog.find('.edt_observacoes');

		//variaveis 
		this.usuario_id = null;

		//metodos
		this.show = function(usuario_id){
			Util.sys.cbo_search.SelectTable('disabled', true);
			main.edt_telefone.mask('0000-0000');
			main.edt_celular.mask('0000-0000');
			main.cbo_sexo.SelectTable('construct');
			main.cbo_cidade.SelectTable('construct', {
				route: 'geoinfo/listarMunicipios',
				TitleFilter: 'Município',
				ColumShow: 'nome',
            	ColumFilter: 'nome',
            	columValue: 'id',
            	getAll: false,
				maxheight: '250px',
			});
			main.cbo_estado.SelectTable('construct', {
				route: 'geoinfo/listarEstados',
				TitleFilter: 'Estado',
				ColumShow: 'nome',
            	ColumFilter: 'nome',
            	columValue: 'id',
            	getAll: false,
            	arrExtraTitles: ['Sigla'],
				arrExtraColuns: ['sigla'],
				maxheight: '250px',
				fnOnSelect: function(e, item){
					main.cbo_cidade.SelectTable('refresh', {
		            	paramFixed: ['estado_id'],
						paramFixedValue: [item.value],
					});
				}
			});
			main.cbo_pais.SelectTable('construct', {
				route: 'geoinfo/listarPaises',
				TitleFilter: 'País',
				ColumShow: 'nome',
            	ColumFilter: 'nome',
            	columValue: 'id',
            	getAll: false,
            	arrExtraTitles: ['Sigla'],
				arrExtraColuns: ['sigla'],
				maxheight: '250px',
				fnOnSelect: function(e, item){
					main.cbo_estado.SelectTable('refresh', {
		            	paramFixed: ['pais_id'],
						paramFixedValue: [item.value],
					});
				}
			});
			

			
			main.usuario_id = Util.sys.usuario.id;
			Util.get
				(
					'usuario/dados', 
					{
						usuario_id: main.usuario_id
					}, 
					function(response){
						main.preencher(response);
					}
				)
		}

		this.preencher = function(usuario){
			main.img_usuario.attr('src', usuario.documento_path);
			main.edt_usuario.val(usuario.usuario);
			main.edt_nome.val(usuario.nome);
			main.edt_sobrenome.val(usuario.sobrenome);
			main.edt_email.val(usuario.email);
			main.edt_senha.val(usuario.senha);
			main.edt_data_nascimento.val(usuario.data_nascimento);
			main.edt_telefone.val(usuario.telefone);
			main.edt_celular.val(usuario.celular);
			main.edt_ocupacao.val(usuario.ocupacao);
			main.cbo_pais.attr('valorSalvo', usuario.pais_id).trigger('change');
			main.cbo_estado.attr('valorSalvo', usuario.estado_id).trigger('change');
			main.cbo_cidade.attr('valorSalvo', usuario.municipio_id).trigger('change');
			main.cbo_sexo.val(usuario.sexo == 'M' ? 1 : 2).trigger('change');
			main.edt_observacoes.val(usuario.observacoes);

		}

		this.unload = function(){
			Util.sys.cbo_search.SelectTable('disabled', false);
			main.dialog.remove();
			if(main.onclose && typeof main.onclose == 'function'){
				main.onclose();
			}
		}

		//eventos
		this.btn_editar_foto.unbind('click');
		this.btn_editar_foto.click(function(e){
			main.edt_foto.trigger('click');
		});

		this.edt_foto.unbind('change');
		this.edt_foto.change(function(e){
			var file = this.files[0];
			if(Util.extensoes.indexOf(file.name.substring(file.name.lastIndexOf('.')+1, file.name.length)) == -1){
		        var params = {
		          title: 'Tipo de arquivo inválido!',
		          text: 'Extensão <strong>.' + file.name.substring(file.name.lastIndexOf('.')+1, file.name.length) +  '</strong> não permitida!',
		          fnLoad: null,
		          utilizaConfirm: false
		        }
		        main.edt_foto.val('');
		        alertModal(params);
				return;
			}

			var reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = function (e) {
				main.img_usuario.attr('src', e.target.result);
			};
		});

		this.edt_usuario.unbind('keyup');
		this.edt_usuario.keyup(function(e){

			if(main.edt_usuario.val() == ''){
				main.span_validauser.addClass('hidden');
				main.edt_usuario.addClass('form-control-mat').removeClass('form-control-mat-danger');
			}else{
				main.span_validauser.removeClass('hidden');

				Util.get
				(
					'usuario/validaUser', 
					{
						usuario: main.edt_usuario.val(),
					}, 
					function(response){
						if(response == true){
							main.span_validauser.removeClass('text-danger').removeClass('glyphicon-remove');
							main.span_validauser.addClass('text-primary').addClass('glyphicon-ok');
							main.edt_usuario.addClass('form-control-mat').removeClass('form-control-mat-danger');
						}else{
							main.span_validauser.removeClass('text-primary').removeClass('glyphicon-ok');
							main.span_validauser.addClass('text-danger').addClass('glyphicon-remove');
							main.edt_usuario.addClass('form-control-mat-danger').removeClass('form-control-mat');
						}
					}
				);
				
			}

		});

		this.edt_email.unbind('keyup');
		this.edt_email.keyup(function(e){

			if(main.edt_email.val() == ''){
				main.span_validaemail.addClass('hidden');
				main.edt_email.addClass('form-control-mat').removeClass('form-control-mat-danger');
			}else{
				main.span_validaemail.removeClass('hidden');

				Util.get
				(
					'usuario/validaEmail', 
					{
						email: main.edt_email.val(),
					}, 
					function(response){
						if(response == true){
							main.span_validaemail.removeClass('text-danger').removeClass('glyphicon-remove');
							main.span_validaemail.addClass('text-primary').addClass('glyphicon-ok');
							main.edt_email.addClass('form-control-mat').removeClass('form-control-mat-danger');
						}else{
							main.span_validaemail.removeClass('text-primary').removeClass('glyphicon-ok');
							main.span_validaemail.addClass('text-danger').addClass('glyphicon-remove');
							main.edt_email.addClass('form-control-mat-danger').removeClass('form-control-mat');
						}
					}
				);
				
			}

		});
		

		this.btn_concluir.unbind('click');
		this.btn_concluir.click(function(){
			var file = main.edt_foto[0].files[0];
			Util.post
			(
				'usuario/salvar', 
				{
					usuario_id: main.usuario_id,
					usuario: main.edt_usuario.val(),
					senha: main.edt_senha.val(),
					email: main.edt_email.val(),
					nome: main.edt_nome.val(),
					sobrenome: main.edt_sobrenome.val(),
					sexo: main.cbo_sexo.val(),
					data_nascimento: main.edt_data_nascimento.val(),
					telefone: main.edt_telefone.val(),
					celular: main.edt_celular.val(),
					observacoes: main.edt_observacoes.val(),
					pais_id: main.cbo_pais.val(),
					estado_id: main.cbo_estado.val(),
					municipio_id: main.cbo_cidade.val(),
					ocupacao: main.edt_ocupacao.val(),
					imagem: file
				}, 
				function(response){

					Util.sys.refreshUserInfo(function(usuario){
						Util.sys.btn_perfil.trigger('click');
					});
					
				}, true
			);
		});
	};

	return EditarPerfil;

});