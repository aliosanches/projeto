<?php

class Usuario_Controller extends Controller{
	function __construct($sessao_model){
		$this->sessao_model = $sessao_model;
	}
	
	function login(){

		try{

			if(strlen(System::$sessao_model->id) == 0){

				$usuario_dao = System::LoadDao('Usuario', true);
				$usuario = $this->ReadPost('usuario');
				$senha = $this->ReadPost('senha');
				System::$sessao_model = $usuario_dao->ValidarLogin($usuario, $senha);
			}
			
			$this->ReturnResponse(System::$sessao_model);

		}catch(Exception $e){

			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function logout(){

		try{

			$sessao_dao = System::LoadDao('Sessao', true);
			System::$sessao_model = $sessao_dao->delete(System::$sessao_model);
			$this->ReturnResponse(true);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function listar(){
		try{

			$usuario_dao = System::LoadDao('Usuario', true);
			
			$nome = $this->ReadGet('nome');

			$ret = $usuario_dao->listar($nome);
			
			$this->ReturnResponse($ret);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function salvar(){
		
		try{

			$usuario_dao = System::LoadDao('Usuario', true);
			$usuario_model = System::LoadModel('Usuario', true);
			$usuario_id = $this->ReadPost('usuario_id');
			
			if($usuario_id > 0){
				$usuario_model = $usuario_dao->popular($usuario_id);
			}

			$usuario_model->senha = $this->ReadPost('senha');
			$usuario_model->email = $this->ReadPost('email');
			$usuario_model->nome = $this->ReadPost('nome');
			$usuario_model = $usuario_dao->salvar($usuario_model);

			$this->ReturnResponse($usuario_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function dados(){

		try{

			$usuario_dao = System::LoadDao('Usuario', true);
			$usuario_model = System::LoadModel('Usuario', true);
			$usuario_id = $this->ReadGet('usuario_id');
			$safemode = $this->ReadGet('safemode');
			$usuario_model = $usuario_dao->popular($usuario_id, $safemode);
			
			$this->ReturnResponse($usuario_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function excluir(){

		try{

			$usuario_dao = System::LoadDao('Usuario', true);
			$usuario_model = System::LoadModel('Usuario', true);
			$usuario_id = $this->ReadPost('usuario_id');
			$usuario_model = $usuario_dao->popular($usuario_id);
			$usuario_model = $usuario_dao->delete($usuario_model, true);
			
			$this->ReturnResponse($usuario_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function validaUser(){
		try{

			$usuario_dao = System::LoadDao('Usuario', true);
			$usuario = $this->ReadGet('usuario');

			$ret = $usuario_dao->validaUser($usuario);
			$this->ReturnResponse($ret);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function validaEmail(){
		try{

			$usuario_dao = System::LoadDao('Usuario', true);
			$email = $this->ReadGet('email');

			$ret = $usuario_dao->validaEmail($email, (isset(System::$sessao_model->usuario_id) ? System::$sessao_model->usuario_id : null));
			$this->ReturnResponse($ret);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function esqueciSenha(){
		try{

			
			$email = $this->ReadPost('email');
			if(strlen($email) == 0){
				throw new Exception("Informe o e-mail", 1);
			}else{
				if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
					throw new Exception("E-mail invalido", 1);
				}
			}
			$this->ReturnResponse(true);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}
}