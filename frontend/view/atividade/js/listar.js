define([],function(){

	var Listar = function(html_id){
		"use strict";

		var main = this;
		this.html_id = html_id;
		this.dialog = $('[view_html_id="'+this.html_id+'"]');
		this.onclose = null;
		this.onsave = null;

		//elementos
		this.btn_add_atividade = this.dialog.find('.btn_add_atividade');
		this.table_atividades = this.dialog.find('.table_atividades');
		this.template_row = main.table_atividades.find('[template-row="atividade"]');
		this.tbody = main.table_atividades.find('tbody');
		this.projeto_codigo = this.dialog.find('#projeto_codigo');
		this.projeto_nome = this.dialog.find('#projeto_nome');
		this.projeto_status = this.dialog.find('#projeto_status');
		this.projeto_data_inicio = this.dialog.find('#projeto_data_inicio');
		this.projeto_data_fim = this.dialog.find('#projeto_data_fim');
		//variaveis
		this.projeto = null;
		//metodos
		this.show = function(projeto){
			main.projeto = projeto;
			main.addProjeto();
			main.listar();
		}

		this.addProjeto = function(){
			main.projeto_codigo.text(main.projeto.id);
			main.projeto_nome.text(main.projeto.nome);
			main.projeto_status.text(main.projeto.status);
			main.projeto_data_inicio.text(main.projeto.data_inicio);
			main.projeto_data_fim.text(main.projeto.data_fim);
		}

		this.addRow = function(item){
			var row = main.template_row.clone();
			row.addClass('rows').removeAttr('template-row').removeClass('hidden');
			row.find('[template-field="codigo"]').text(item.id);
			var status = '';
			if(item.status == 1){
				status = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
			}else if(item.status == 2){
				status = '<i class="fa fa-ellipsis-h" aria-hidden="true"></i>';
			}else if(item.status == 3){
		 		status = '<i class="fa fa-clock-o" aria-hidden="true"></i>';
			}else if(item.status == 4){
				status = '<i class="fa fa-minus-circle" aria-hidden="true"></i>';
			}else if(item.status == 5){
				status = '<i class="fa fa-check-circle" aria-hidden="true"></i>';
			}
			row.find('[template-field="status"]').html(status);
			row.find('[template-field="nome"]').text(item.nome);
			row.find('[template-field="inicio"]').text(item.data_inicio);
			row.find('[template-field="fim"]').text(item.data_fim);

			var param = [
				{
					click: function(e){
						Util.load_pag('atividade/listar', function(html_id, obj){
			                obj.show(item);
			            });
					},
					icon: '<i class="fa fa-list" aria-hidden="true"></i>', 
					title: 'Atividades'
				}
			]
			Util.createOptions(row.find('[template-field="options"]'), param);
			

			main.tbody.append(row);
		}

		this.listar = function(){
			Util.get('atividade/listar', {nome: null}, function(response){
				main.table_atividades.find('.rows').remove();
				for (var i = 0; i < response.length; i++) {
					var item = response[i];
					main.addRow(item);
				}
			});
		}

		this.unload = function(){
			main.dialog.remove();
			if(main.onclose && typeof main.onclose == 'function'){
				main.onclose();
			}
		}

		//eventos
		this.btn_add_atividade.unbind('click').click(function(){
			var obj = {
				title: 'Nova atividade', 
				text: '', 
				fnLoad: function(modal_id, modal){
					modal.find('.modal-body').load('view/atividade/html/detalhes_atividade.html', function(html_string, error){
				        if(error == 'error'){
				            console.log('erro ao carregar pag');
				            return;
				        }
				     
					});
				}, 
				utilizaConfirm: true, 
				titleConfirm: 'Salvar', 
				fnConfirm: function(modal_id, modal){
					Util.post
					(
						'atividade/salvar', 
						{
							nome: modal.find('#nome').val(),
							status: modal.find('#status').val(),
							data_inicio: modal.find('#data_inicio').val(),
							data_fim: modal.find('#data_fim').val()
						}, 
						function(response){
							main.addRow(response);
							modal.find('.modal-footer').remove();
							modal.find('.modal-body').load('view/success.html', function(html_string, error){
						        if(error == 'error'){
						            console.log('erro ao carregar pag');
						            return;
						        }
						     	setTimeout(function(){
						     		modal.remove();
						     	}, 3000);
							});
						}
					);
				}, 
				utilizaCancel: true, 
				titleCancel: 'Cancelar', 
				ignoraConfirmClose: true,
			};
			alertModal(obj);
		});
	};

	return Listar;

});