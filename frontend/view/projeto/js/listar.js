define([],function(){

	var Listar = function(html_id){
		"use strict";

		var main = this;
		this.html_id = html_id;
		this.dialog = $('[view_html_id="'+this.html_id+'"]');
		this.onclose = null;
		this.onsave = null;

		//elementos
		this.btn_add_projeto = this.dialog.find('.btn_add_projeto');
		this.table_projetos = this.dialog.find('.table_projetos');
		this.template_row = main.table_projetos.find('[template-row="projeto"]');
		this.tbody = main.table_projetos.find('tbody');
		//variaveis

		//metodos
		this.show = function(){
			main.listar();
		}

		this.addRow = function(item){
			var row = main.template_row.clone();
			var aux = $('[projeto-id="'+item.id+'"]').parent();
			if(aux.length > 0){
				row = aux;
			}
			row.addClass('rows').removeAttr('template-row').removeClass('hide');
			row.find('[template-field="codigo"]').text(item.id).attr('projeto-id', item.id);
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
			row.data('item', item);
			row.find('[data-activates="drop"]').attr('data-activates', 'drop_' + item.id);
			row.find('[id="drop"]').attr('id', 'drop_' + item.id);
			row.find('[data-activates="drop2"]').attr('data-activates', 'drop_xs_' + item.id);
			row.find('[id="drop2"]').attr('id', 'drop_xs_' + item.id);
			if(aux.length == 0){
				row.find('[template-button="atividades"]')
				   .unbind('click')
				   .click(function(e){
						var item = $(this).parents('tr').data('item');
						Util.load_pag('atividade/listar', function(html_id, obj){
			                obj.show(item);
			                main.unload();
			            });
					});
				row.find('[template-button="editar"]')
				   .unbind('click')
				   .click(function(e){
				   		var item = $(this).parents('tr').data('item');
						var obj = {
							title: 'Editar Projeto', 
							text: '', 
							fnLoad: function(modal_id, modal, loadModal){
								modal.find('.modal-body').load('view/projeto/html/detalhes_projeto.html', function(html_string, error){
							        if(error == 'error'){
							            console.log('erro ao carregar pag');
							            return;
							        }
							     	var elem = $(this);
							     	elem.find('#nome').val(item.nome);
							     	elem.find('#status').val(item.status);
							     	elem.find('#data_inicio').attr('data-value', item.data_inicio);
							     	elem.find('#data_fim').attr('data-value', item.data_fim);
							     	loadModal();
							     	$('.inputSelect').inputSelect({
							        	label: 'Usuários',
									}).setData([{
											text: '1',
											id: 1
										},
										{
											text: '2',
											id: 2
										},
										{
											text: '3',
											id: 3
										}]);
								});
							}, 
							utilizaConfirm: true, 
							titleConfirm: 'Salvar', 
							fnConfirm: function(modal_id, modal){
								Util.post
								(
									'projeto/salvar', 
									{
										projeto_id: item.id,
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
							ignoraConfirmClose: true
						};
						alertModal(obj);
					});
				row.find('[template-button="excluir"]')
				   .unbind('click')
				   .click(function(e){
				   		var item = $(this).parents('tr').data('item');
						Util.post
						(
							'projeto/excluir', 
							{
								projeto_id: item.id,
							}, 
							function(response){
								row.remove();
							}
						);
					});			
				main.tbody.append(row);
			}
		}

		this.listar = function(){
			Util.get('projeto/listar', {nome: null}, function(response){
				main.table_projetos.find('.rows').remove();
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
		this.btn_add_projeto.unbind('click').click(function(){
			var obj = {
				title: 'Novo Projeto', 
				text: '', 
				fnLoad: function(modal_id, modal, loadModal){
					modal.find('.modal-body').load('view/projeto/html/detalhes_projeto.html', function(html_string, error){
				        if(error == 'error'){
				            console.log('erro ao carregar pag');
				            return;
				        }
				        loadModal();
				        $('.inputSelect').inputSelect({
				        	label: 'Usuários',
							data: [{
								text: '1',
								id: 1
							},
							{
								text: '2',
								id: 2
							},
							{
								text: '3',
								id: 3
							}]
						});
					});
				}, 
				utilizaConfirm: true, 
				titleConfirm: 'Salvar', 
				fnConfirm: function(modal_id, modal){
					Util.post
					(
						'projeto/salvar', 
						{
							nome: modal.find('#nome').val(),
							status: modal.find('#status').val(),
							data_inicio: Util.dateBrToBd(modal.find('#data_inicio').val()),
							data_fim: Util.dateBrToBd(modal.find('#data_fim').val()),
							usuarios: $('.inputSelect').inputSelect('data'),
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
				ignoraConfirmClose: true
			};
			alertModal(obj);
		});
	};

	return Listar;

});