define([],function(){

	var Perfil = function(html_id){
		"use strict";

		var main = this;
		this.html_id = html_id;
		this.dialog = $('[view_html_id="'+this.html_id+'"]');
		this.onclose = null;
		this.onsave = null;

		//elementos
		this.usuario_nome = this.dialog.find('.usuario_nome');
		this.usuario_pais = this.dialog.find('.usuario_pais');
		this.usuario_estado = this.dialog.find('.usuario_estado');
		this.usuario_cidade = this.dialog.find('.usuario_cidade');
		this.usuario_datanascimento = this.dialog.find('.usuario_datanascimento');
		this.usuario_sexo = this.dialog.find('.usuario_sexo');
		this.usuario_ocupacao = this.dialog.find('.usuario_ocupacao');
		this.usuario_email = this.dialog.find('.usuario_email');
		this.usuario_telefone = this.dialog.find('.usuario_telefone');
		this.usuario_celular = this.dialog.find('.usuario_celular');
		this.usuario_observacao = this.dialog.find('.usuario_observacao');
		this.div_listar = this.dialog.find('.div_listar');
		this.div_not_iten = this.dialog.find('.div_not_iten');
		this.btn_editar_perfil = this.dialog.find('.btn_editar_perfil');
		this.btn_editar_foto = this.dialog.find('.btn_editar_foto');
		this.edt_foto = this.dialog.find('.edt_foto');
		this.img_usuario = this.dialog.find('.img_usuario');

		//variaveis
		this.usuario_id = null;
		this.desc = null;
		this.resumo_id = null;

		//metodos
		this.show = function(usuario_id){
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

			main.listar();
		}

		this.preencher = function(usuario){
			main.usuario_nome.text(Util.UpperFirstLetter(usuario.nome + ' ' + usuario.sobrenome));
			main.img_usuario.attr('src', usuario.documento_path);
			main.usuario_email.text(usuario.email);
			main.usuario_pais.text(usuario.pais_nome ? usuario.pais_nome : 'Nenhuma informção.');
			main.usuario_estado.text(usuario.estado_nome ? usuario.estado_nome : 'Nenhuma informção.');
			main.usuario_cidade.text(usuario.municipio_nome ? usuario.municipio_nome : 'Nenhuma informção.');
			main.usuario_datanascimento.text(usuario.data_nascimento ? usuario.data_nascimento : 'Nenhuma informção.');
			main.usuario_sexo.text(usuario.sexo == 'M' ? 'Masculino' : (usuario.sexo == 'F' ? 'Feminino' : 'Nenhuma informção.'));
			main.usuario_ocupacao.text(usuario.ocupacao ? usuario.ocupacao : 'Nenhuma informção.');
			main.usuario_telefone.text(usuario.telefone ? usuario.telefone : 'Nenhuma informção.');
			main.usuario_celular.text(usuario.celular ? usuario.celular : 'Nenhuma informção.');
			main.usuario_observacao.text(usuario.observacoes ? usuario.observacoes : 'Nenhuma informção.');
		}

		this.listar = function(){

			var template_row = main.div_listar.find('[template-row="resumo"]');

			var add_row = function(i, item){

				var new_row = template_row.clone();
				new_row.addClass('rows').removeAttr('template-row').css('display', '');

				var field_publicacao = $(new_row.find('[template-field="publicacao"]'));
				field_publicacao.text('Criado em: '+ new Util.Date(item.insert_hora).format('d/m/y'));

				var field_tema = $(new_row.find('[template-field="tema"]'));
				field_tema.text(item.tema_nome ? 'Tema: ' + item.tema_nome : '');

				var field_title = $(new_row.find('[template-field="title"]'));
				field_title.text(item.titulo);
				
				var field_subtitle = $(new_row.find('[template-field="subtitle"]'));
				field_subtitle.text(item.subtitulo);
				item.conteudoReduzido = item.conteudoReduzido.split('&nbsp;').join(' ');
				var field_conteudo = $(new_row.find('[template-field="conteudo"]'));
				field_conteudo.html(item.conteudoReduzido);
				
				new_row.unbind('click');
				new_row.click(function(e){
					
				});

				new_row.appendTo(main.div_listar);
			}

			Util.get
				(
					'resumo/listarMinhasPublicacoes', 
					{
						desc: main.desc,
						usuario_id: main.usuario_id
					}, 
					function(response){
						main.div_listar.find('.rows').remove();
						if(response.length == 0){
							main.div_not_iten.removeClass('hidden');
						}else{
							main.div_not_iten.addClass('hidden');
							for (var i = 0; i < response.length; i++) {
								var item = response[i];
								add_row(i, item);
							}
						}
					}
				)
		}

		this.unload = function(){
			main.dialog.remove();
			if(main.onclose && typeof main.onclose == 'function'){
				main.onclose();
			}
		}

		//eventos
		this.btn_editar_perfil.unbind('click');
		this.btn_editar_perfil.click(function(){
			main.unload();
			Util.load_pag('usuario/editar_perfil', function(html_id, obj){
                obj.show();
            });
		});
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
			Util.post
			(
				'usuario/salvarImagem', 
				{
					usuario_id: main.usuario_id,
					imagem: file
				}, 
				function(response){
					main.edt_foto.val('');
					Util.sys.usuario.documento_path = response.documento_path;
					main.img_usuario.attr('src', response.documento_path);
					Util.sys.refreshUserInfo();
				}, 
				true
			);
		});
	};

	return Perfil;

});