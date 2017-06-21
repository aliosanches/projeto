
function alertModal(title, text, fnLoad, utilizaConfirm, titleConfirm, 
					fnConfirm, utilizaCancel, titleCancel, fnCancel, ignoraConfirmClose, lg){

	var params = {
		title: title,
		text: text,
		fnLoad: fnLoad,
		utilizaConfirm: utilizaConfirm,
		titleConfirm: titleConfirm,
		fnConfirm: fnConfirm,
		utilizaCancel: utilizaCancel,
		titleCancel: titleCancel,
		fnCancel: fnCancel,
		ignoraConfirmClose: ignoraConfirmClose,
		lg: lg
	}

	if(typeof title == 'object'){
		params = title;
	}

	params.title = (typeof params.title != "undefined" ? params.title : 'Alert'); 
	params.text = (typeof params.text != "undefined" ? params.text : '');
	params.fnLoad = (typeof params.fnLoad == "function" ? params.fnLoad : null);
	params.utilizaConfirm = (typeof params.utilizaConfirm != "undefined" ? params.utilizaConfirm : false);
	params.titleConfirm = (typeof params.titleConfirm != "undefined" ? params.titleConfirm : 'Confirmar');
	params.fnConfirm = (typeof params.fnConfirm == "function" ? params.fnConfirm : null);
	params.utilizaCancel = (typeof params.utilizaCancel != "undefined" ? params.utilizaCancel : true);
	params.titleCancel =  (typeof params.titleCancel != "undefined" ? params.titleCancel : 'Ok');
	params.fnCancel = (typeof params.fnCancel == "function" ? params.fnCancel : null);
	params.ignoraConfirmClose = (typeof params.ignoraConfirmClose != "undefined" ? params.ignoraConfirmClose : false);
	params.lg = (typeof params.lg != "undefined" ? params.lg : false);

	var modal_id = Util.gerar_hash();
	var modal = $('<div class="modal" modal-id="'+modal_id+'" role="dialog">');
	//var dialog = $('<div class="modal-dialog">');
	var content = $('<div class="modal-content ' + ( params.lg ? 'modal-lg' : '' ) + '">');
	//var header = $('<div class="modal-header">');
	var body = $('<div class="modal-body">');
	var footer = $('<div class="modal-footer">');		
	var btn_close = $('<button type="button" class="modal-close">&times;</button>');
	var title = $('<h4 class="modal-title">');
	var btn_cancelar = $('<button type="button" class="waves-effect waves-light btn btn-default" style="margin: 6px 3px;">');
	var btn_confirmar = $('<button type="button" class="waves-effect waves-light btn btn-primary" style="margin: 6px 3px;">');
	btn_cancelar.css('width', 'initial');
	btn_confirmar.css('width', 'initial');

	title.text(params.title);
	//header.append(btn_close);
	//header.append(title);
	content.append(title);
	//content.append(header);
	content.append(body);
	content.append(footer);
	//dialog.append(content);
	//modal.append(dialog);
	modal.append(content);
	modal.appendTo($('.container'));

	btn_close.unbind('click');
	btn_close.click(function(e){

		if(params.utilizaCancel == true){
			if(typeof params.fnCancel == 'function'){
				params.fnCancel(modal_id, modal, e);
			}
		}

		modal.modal('close');
		modal.remove();
	});
	
	
	body.html(params.text);

	if(params.utilizaConfirm == true){
		btn_confirmar.html(params.titleConfirm);
		btn_confirmar.unbind('click');
		btn_confirmar.click(function(e){

			if(typeof params.fnConfirm == 'function'){
				params.fnConfirm(modal_id, modal, e);
			}

			if(!params.ignoraConfirmClose){
				modal.modal('close');
				modal.remove();
			}
			
		});

		footer.append(btn_confirmar);
	}	

	if(params.utilizaCancel == true){
		btn_cancelar.html(params.titleCancel);
		btn_cancelar.unbind('click');
		btn_cancelar.click(function(e){

			if(typeof params.fnCancel == 'function'){
				params.fnCancel(modal_id, modal, e);
			}

			modal.modal('close');
			modal.remove();

		});

		footer.append(btn_cancelar);
	}

	if(typeof params.fnLoad == 'function'){
		params.fnLoad(modal_id, modal, function(){
			Util.instanciaFn();
		});
	}
	modal.modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

      },
      complete: function() {
      	 
      }
    }).modal('open');
}