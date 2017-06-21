<?php

class System {

	public static $sessao_model;

	function __construct(){

		require_once('sys/RouteMap.class.php');
		require_once('sys/Controller.class.php');
		require_once('sys/Model.class.php');
		require_once('sys/Dao.class.php');
		require_once('sys/DB.class.php');
		require_once('sys/Cache.class.php');
		
		//pego a rota de destino da requisicao
		$flag = 'index.php/';
		$pos_ini = strlen($flag)+strpos($_SERVER['PHP_SELF'], $flag);
		$pos_fim = strlen($_SERVER['PHP_SELF']);
		$route = substr($_SERVER['PHP_SELF'], $pos_ini, $pos_fim);
		
		try{
			//carregos os objetos da sessao
			$sessao_dao = self::LoadDao('Sessao', true);
			self::$sessao_model = self::LoadModel('Sessao', true);
			self::$sessao_model->md5 = Controller::ReadRequest('sessao_id');

			$disparaThrow = true;

			if(
				$route == 'usuario/login' 
				|| $route == 'usuario/salvar' 
				|| $route == 'usuario/validaUser'
				|| $route == 'usuario/validaEmail'
				|| $route == 'usuario/esqueciSenha'
			){
				$disparaThrow = false;
			}

			self::$sessao_model = $sessao_dao->popularMd5(self::$sessao_model->md5, $disparaThrow);
			self::LoadController($route);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			Controller::ReturnResponse($obj_error);
		}
	}

	public static function LoadController($route){
		$route = RouteMap::getRoute($route);
		if(is_array($route)){
			$file_controller = 'controller/'.$route[0].'.controller.php';
			if(file_exists($file_controller)){
				require_once($file_controller);
				$class_name = $route[0].'_Controller';
				$obj_controller = new $class_name(self::$sessao_model);
				$func_name = $route[1];
				$obj_controller->$func_name();
			}
		}
	}

	public static function LoadModel($classe, $instacia = false){
		$file_model = 'model/'.$classe.'.model.php';
		if(file_exists($file_model)){
			require_once($file_model);
			if($instacia === true){
				$class_name = $classe.'_Model';
				$obj_model = new $class_name;
				return $obj_model;
			}
		}
	}

	public static function LoadDao($classe, $instacia = false){
		$file_model = 'dao/'.$classe.'.dao.php';
		if(file_exists($file_model)){
			require_once($file_model);
			if($instacia === true){
				$class_name = $classe.'_Dao';
				$obj_dao = new $class_name;
				return $obj_dao;
			}
		}
	}
}



