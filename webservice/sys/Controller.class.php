<?php 

class Controller {
	public $sessao_model;

	public static function ReadPost($attributo, $deafult = null){
		if(isset($_POST[$attributo])){
			if(strlen($_POST[$attributo]) == 0 || is_null($_POST[$attributo]) || $_POST[$attributo] == array()){
				return $deafult;
			}
			return $_POST[$attributo];
		}
		return $deafult;
	}

	public static function ReadGet($attributo, $deafult = null){
		if(isset($_GET[$attributo])){
			return $_GET[$attributo];
		}
		return $deafult;
	}

	public static function ReadRequest($attributo, $deafult = null){
		if(isset($_REQUEST[$attributo])){
			return $_REQUEST[$attributo];
		}
		return $deafult;
	}

	public static function ReadFile($attributo, $deafult = null){
		if(isset($_FILES[$attributo])){
			return $_FILES[$attributo];
		}
		return $deafult;
	}

	public static function ReturnResponse($retorno){
		print_r(json_encode($retorno));exit();
	}

	public static function checkPermission($usuario_id, $permissao = array()){
		$usuario_dao = System::LoadDao('Usuario', true);
		$permissao = implode(',', $permissao);
		if(!$usuario_dao->verificaPermissao($usuario_id, $permissao)){
			$obj_error = (object)array();
			$obj_error->mensagem = 'Você não possui permissão para realizar essa ação!';
			$obj_error->err_code = 1;
			self::ReturnResponse($obj_error);
		}
	}
}