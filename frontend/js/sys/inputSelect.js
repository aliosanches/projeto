$.prototype.inputSelect = function(param, value){
	var $elem = $(this);
	var id = Util.gerar_hash(null, null, 'inputSelect_');
	var inputSelect = $elem.data('inputSelect');
	var SelectData = [];

	if(!inputSelect){
		inputSelect = {
			id: id,
			$chip_users: $('<div class="chips-users">'),
			$div_input_field: $('<div class="div-input input-field">'),
			$label: $('<label for="'+id+'">'),
			$inp_usuarios: $('<input type="text" name="'+id+'" class="'+id+'" id="'+id+'">'),
			$ul: $('<ul class="autocomplete-content dropdown-content">'),
			getData: function(json){
				var chips = this.$chip_users.find('.chip');
				var aux = [];
				for (var i = 0; i < chips.length; i++) {
					var item = $(chips[i]).data('item');
					aux.push(item);
				}
				if(json){
					return JSON.stringify(aux);
				}
				return aux;
			},
			setData: function(data){
				for (var i = 0; i < data.length; i++) {
					addChips(data[i]);
				}
			}
		}
	}

	var _contruct = function(){
		SelectData = param.data || [];
		$elem.append(inputSelect.$chip_users);
		$elem.append(inputSelect.$div_input_field);
		inputSelect.$label.text(param.label);
		inputSelect.$div_input_field.append(inputSelect.$label);
		inputSelect.$div_input_field.append(inputSelect.$inp_usuarios);
		inputSelect.$div_input_field.append(inputSelect.$ul);
		inputSelect.$inp_usuarios.unbind('keyup').keyup(keyup);
		inputSelect.$inp_usuarios.unbind('keydown').keydown(keydown);
	}

	var _destruct = function(){
		inputSelect.$chip_users.remove();
	}
	
	var clean = function(){
		inputSelect.$ul.find('li').remove();
	}

	var addChips = function(item){
		var $chip = $('<div id="'+ item.id + '" class="chip">' + item.text + '<i class="close material-icons">close</i></div>');
		$chip.data('item', item);
		$chip.find('.close').click(function(){
			SelectData.push($chip.data('item'));
			var total = inputSelect.$ul.find('li').length;
			addLi(total, $chip.data('item'));
		});
		inputSelect.$chip_users.append($chip);
	}

	var addLi = function(i, item){
		var $li = $('<li index="'+i+'" id="'+item.id+'"><span>'+item.text+'</span></li>');
		$li.data('item', item)
		   .unbind('click')
		   .click(function(e){
				clean();
				addChips(item);
				SelectData.filter(function(itemFilter, index){
					if(item.id == itemFilter.id){
						SelectData.splice(index, 1);
					}
				});
			});
		inputSelect.$ul.append($li);
	}

	var keydown = function(e){
		var index = inputSelect.$ul.find('li.active').index();
		var total = inputSelect.$ul.find('li').length - 1;
		if(e.which == 40){
			index = parseInt(index + 1, 10);
			if(index > total){
				index = 0;
			}
			inputSelect.$ul.find('li.active').removeClass('active');
			inputSelect.$ul.find('li:eq('+ index +')').addClass('active');
			return;
		}else if(e.which == 38){
			index = parseInt(index - 1, 10);
			if(index < 0){
				index = total;
			}
			inputSelect.$ul.find('li.active').removeClass('active');
			inputSelect.$ul.find('li:eq('+ index +')').addClass('active');
			return;
		}
	}

	var keyup = function(e){
		if(e.which == 13){
			var $li = inputSelect.$ul.find('li.active');
			var item = $li.data('item');
			var index = $li.index();
			$li.remove();
			if(item){
				addChips(item);
				SelectData.splice(index, 1);
			}
			return;
		}
		if(this.value.length < 3){
			//return;
		}
		if(e.which != 40 && e.which != 38){
			clean();
			for (var i = 0; i < SelectData.length; i++) {
				if(SelectData[i].text.indexOf(this.value) > -1){
					addLi(i, SelectData[i]);
				}
			}
			inputSelect.$ul.find('li:eq(0)').addClass('active');
		}
	}

	if(typeof param == 'object'){
		_contruct();
	}else if(param == 'data'){
		return inputSelect.getData(value);
	}

	$elem.data('inputSelect', inputSelect);
	return inputSelect;
}