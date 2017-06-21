
var Util = {
    node: false,
	view_path: 'view/',
    webservice_path: '/projeto/webservice/index.php/',
    arrRequest: [],
    extensoes: 'jpg|jpeg|png|gif|bmp',
    sys: null 
};

Util.gerar_hash = function(text, justtext){ 
    if(justtext){
        return md5(text);
    }
    return md5(Math.random()+new Date()+Math.random()+text);
};

Util.setConfig = function(campo, valor){
    Util.post
    (
        'configuracoes/set', 
        {
            campo: campo,
            valor: valor,
        }
    );
}

Util.getConfig = function(campo, callback){
    Util.get
    (
        'configuracoes/get', 
        {
            campo: campo,
        },function(response){
            if(typeof callback == "function"){
                callback(response);
            }
        }
    );
}

Util.add_char = function(string) {
    var nextletter = String.fromCharCode(string.charCodeAt(parseInt(string.length, 10)-1) + 1);
    string = string.substring(0, parseInt(string.length, 10)-1);
    string = string + nextletter;
    return string;
}

Util.UpperFirstLetter = function(string) {
    string = string.split(' ');
    var aux = '';
    for (var i = 0; i < string.length; i++) {
        
        aux = aux + ' ' +string[i].charAt(0).toUpperCase() + string[i].slice(1).toLowerCase();
    }
    return aux;
}

Util.instanciaFn = function(){
    setTimeout(function(){
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'right', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
        });

        $('.datepicker').pickadate({
            autoclose: true,
            selectMonths: true, 
            selectYears: 15,
            monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            weekdaysLetter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Fechar',
            labelMonthNext: 'Próximo mes',
            labelMonthPrev: 'Mes anterior',
            labelMonthSelect: 'Selecione um mes',
            labelYearSelect: 'Selecione um ano',
            formatSubmit: 'yyyy-mm-dd',
            format: 'dd/mm/yyyy',
        });
        $('select').material_select();
        Materialize.updateTextFields();
    }, 300);
}

Util.define_language = function(){
    var idioma = (navigator.browserLanguage!= undefined)?  navigator.browserLanguage : navigator.language;
    $('#container').find('label').attr('language', idioma);  
}
Util.dateBrToBd = function (str){
    if(!str){
        return str;
    }
    str = str.split('/');
    return str[2] + '-' + str[1] + '-' + str[0];
};
Util.Date = function(str){
    var main = this;
    this.str = str;
    this.date = null;
    if(this.str){
        if(this.str.length == 10){
            this.str = this.str + " 00:00:00";
        }
        this.str = this.str.split(' ').join('');
        this.hour = this.str.substring(10, this.str.length);
        this.str = this.str.substring(0, 10);
        this.str = this.str.replace('/', '-');
        this.str = this.str.split('-');
        if(this.str.length == 3 && this.str[2].length == 4){
            var aux = this.str[2];
            this.str[2] = this.str[0];
            this.str[0] = aux;
        }
        this.str = this.str.join('-') + " " + this.hour;
        this.date = new Date(str);
    }else{
        this.date = new Date();
    }
    
    if(this.date == 'Invalid Date'){
        throw this.date;
    }
    this.hour = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();

    this.format = function(value){
        var day = main.date.getDate();
        day = (day < 10 ? '0' + day : day);
        var month = parseInt(main.date.getMonth()+1,10);
        month = (month < 10 ? '0' + month : month);
        var year = main.date.getFullYear();
        if(value){
            var hour = main.hour.split(':');
            value = value.toUpperCase();
            value = value.replace('D', day);
            value = value.replace('M', month);
            value = value.replace('Y', year);
            value = value.replace('H', hour[0]);
            value = value.replace('I', hour[1]);
            value = value.replace('S', hour[2]);
            return value;
        }
        return year + '-' + month + '-' + day + ' ' + main.hour;
    }
    return this;
}

Util.createOptions = function(parent, itens){
    parent = $(parent);
    if(parent.length > 0 && itens && itens.length > 0){
        var id = 'dropdown_' + Util.gerar_hash();
        var btn = $('<a data-activates="'+id+'" class="dropdown-button btn" data-tooltip="tooltip" title="Opcoes">');
        btn.append('<i class="fa fa-ellipsis-v"></i>');
        var ul = $('<ul class="dropdown-content" id="'+id+'">');

        for (var i = 0; i < itens.length; i++) {
            var op = itens[i];
            if(op.title && typeof op.click == 'function' && op.icon){
                var li = $('<li>');
                var link = $('<a href="#" class="text-left" title="'+ op.title +'">');
                link.html(op.icon + op.title).click(op.click);
                li.append(link);
                ul.append(li);
            }
        }
        
        parent.append(btn);
        parent.append(ul);
        setTimeout(function(){
            btn.dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false,
                gutter: 0, 
                belowOrigin: true,
                alignment: 'right', 
                stopPropagation: false
            });
        }, 300);
    }
}

Util.load_pag = function(caminho, callback){
    caminho = caminho.split('/');
	var caminho_html = Util.view_path+caminho[0]+'/html/'+caminho[1] + '.html';
    var caminho_js = Util.view_path+caminho[0]+'/js/'+caminho[1] + '.js';

    var html_id = Util.gerar_hash(caminho_html);
    $('#container').append('<div view_html_id="'+html_id+'" path="'+caminho+'">');
	$('[view_html_id="'+html_id+'"]').load(caminho_html, function(html_string, error){
        
        if(error == 'error'){
            console.log('erro ao carregar pag');
            return;
        }
        Util.define_language();
        Util.instanciaFn();
        require([caminho_js], function(obj_class){
            
            if(typeof obj_class == 'function'){
            	var object = new obj_class(html_id);
                $('[view_html_id="'+html_id+'"]').data('ObjcetClass', object);
                if(typeof callback != 'undefined'){
                    callback(html_id, object);
                }
            }
            
        });
	});
}

Util.validResponse = function(response){

    var defineTitle = function(err_code){
        switch(parseInt(err_code, 10)){
            case 1:
                return 'Validacao';
                break;
            case 2:
                return 'SQL Error';
                break;
            case 3:
                return 'PHP Error';
                break;
            case 4:
                return 'System Error';
                break;
            case 0:
                return 'Alert';
                break;
        }
    }
    try{

        var arr_mensagem = JSON.parse(response.mensagem);
        var span = '';
        for (var i = 0; i < arr_mensagem.length; i++) {
          span = span+'<span class="text-info" style="padding-left: 15px;">'+arr_mensagem[i]+'</span><br>';
        }

        var params = {
          title: defineTitle(response.err_code),
          text: span,
          fnLoad: null,
          utilizaConfirm: false
        }

        alertModal(params);

    }catch(error){

        var span = '<span class="text-info" style="padding-left: 15px;">'+response.mensagem+'</span>';
        var params = {
          title: defineTitle(response.err_code),
          text: span,
          fnLoad: null,
          utilizaConfirm: false
        }

        alertModal(params);
    }
}

Util.abortRequest = function(id){

    for (var i = 0; i < Util.arrRequest.length; i++) {
        var item = Util.arrRequest[i];

        if(id){
            if(id == item.id){
                item.objXhr.abort();
                Util.arrRequest.splice(i, 1);
            }
        }else{
            item.objXhr.abort();
            Util.arrRequest.splice(i, 1);
        }
    }
}

Util.post = function(route, params, fn_success, upload){

    var parametros = {
        route: route,
        data: params,
        fn_success: fn_success,
        upload: upload
    }
  
    if(typeof route == 'object'){
        parametros = route;
    }

    if(!parametros.data){
        parametros.data = {};
    }

    var objAjax = {
        url: (Util.node ? '/' : Util.webservice_path+parametros.route),
        dataType: 'JSON',
        method: 'POST',
        success: function(response, status, xhr){

            if(typeof response != "undefined"){
                if( 
                    typeof response.mensagem == "undefined" 
                    && typeof response.err_code == "undefined"
                  ){

                    if(typeof parametros.fn_success == 'function'){
                        parametros.fn_success(response);
                    }
                }else{

                    Util.validResponse(response);
                }
            }
        },
        error: function(xhr, ajaxOptions, error){
            if(xhr.responseText){
                var obj = {
                    mensagem: xhr.responseText,
                    err_code: 3
                };
                
                Util.validResponse(obj);
            }
        }
    }

    parametros.data.route = parametros.route;
    parametros.data.sessao_id = (Util.sys ? Util.sys.getSessionID() : window.localStorage.getItem('sessao_id'));
    objAjax.data = parametros.data;

    if(parametros.upload){
        objAjax.cache = false;
        objAjax.contentType = false;
        objAjax.processData = false;
        var data = new FormData();
        for(var i in parametros.data){ 
            data.append(i, parametros.data[i]); 
        }
        objAjax.data = data;
    }

    var objXhr = $.ajax(objAjax);
}

Util.get = function(route, params, fn_success){

    var parametros = {
        route: route,
        params: params,
        fn_success: fn_success
    }
  
    if(typeof route == 'object'){
        parametros = route;
    }

    if(!parametros.params){
        parametros.params = {};
    }
    parametros.params.route = parametros.route;
    parametros.params.sessao_id = (Util.sys ? Util.sys.getSessionID() : window.localStorage.getItem('sessao_id'));
    
    Util.abortRequest(Util.gerar_hash(parametros.route, true));

    var objXhr = $.ajax(
        {
            url: (Util.node ? '/' : Util.webservice_path+parametros.route),
            data: parametros.params,
            dataType: 'JSON',
            method: 'GET',
            success: function(response, status, xhr){

                if(typeof response != "undefined"){
                    if( 
                        typeof response.mensagem == "undefined" 
                        && typeof response.err_code == "undefined"
                      ){

                        if(typeof parametros.fn_success == 'function'){
                            parametros.fn_success(response);
                        }
                    }else{
                        
                        Util.validResponse(response);
                        
                    }
                }
            },
            error: function(xhr, ajaxOptions, error){
                if(xhr.responseText){
                    var obj = {
                        mensagem: xhr.responseText,
                        err_code: 3
                    };
                    
                    Util.validResponse(obj);
                    
                }
            }
        } 
    );

    var obj = {
        objXhr: objXhr,
        id: Util.gerar_hash(parametros.route, true),
        route: parametros.route
    }

    Util.arrRequest.push(obj);

}

