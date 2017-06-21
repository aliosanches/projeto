<?php

class Cache {

	function __construct(){

	}

	private static $instance;

	public static function getInstance(){

		if(!isset(self::$instance)){
			try{
				self::$instance =  new Memcache();
				self::$instance->addServer(DB_HOST, DB_PORT);
				
			}catch(PDOException $e){
				$obj_error = (object)array();
				$obj_error->mensagem = $e->getMessage();
				$obj_error->err_code = 2;
				Controller::ReturnResponse($obj_error);
			}
		}

		return self::$instance;
	}

	public static function set($key, $valor){
		try{

			$cache = self::getInstance();
			$cache->set($key, $valor);
		
		} catch (PDOException $e) {
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = 2;
			Controller::ReturnResponse($obj_error);
		}
	}

	public static function get($key){
		try{

			$cache = self::getInstance();
			return $cache->get($key);
		
		} catch (PDOException $e) {
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = 2;
			Controller::ReturnResponse($obj_error);
		}
	}
}