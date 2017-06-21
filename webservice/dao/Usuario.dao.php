<?php

class Usuario_Dao extends Dao{

	function __construct(){

		System::LoadModel('Usuario');
	}

	function salvar($usuario_model, $safemode = false){

		try{

			if($this->existe($usuario_model->id)){
				$usuario_model = $this->update($usuario_model, $safemode);
			}else{
				$usuario_model = $this->insert($usuario_model, $safemode);
			}

			return $usuario_model;

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = 1;
			Controller::ReturnResponse($obj_error);
		}
	}

	function validaUser($usuario, $usuario_id = null){

		$sql = "SELECT id FROM usuario WHERE excluido = 0 AND usuario = :usuario ";
		$params = array();
		if($usuario_id > 0){
			$sql .= " AND id != :usuario_id ";
			$params[':usuario_id'] = $usuario_id;
		}
		$params[':usuario'] = $usuario;
		$query = DB::query($sql, $params);

		if(count($query) > 0 && $query[0]['id'] > 0){
			return false;
		}

		return true;
	}

	function validaEmail($email, $usuario_id = null){

		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
			return false;
		}

		$sql = "SELECT id FROM usuario WHERE excluido = 0 AND email = :email ";
		$params = array();
		if($usuario_id > 0){
			$sql .= " AND id != :usuario_id ";
			$params[':usuario_id'] = $usuario_id;
		}
		
		$params[':email'] = $email;
		$query = DB::query($sql, $params);

		if(count($query) > 0 && $query[0]['id'] > 0){
			return false;
		}

		return true;
	}

	function existe($usuario_id){

		$sql = "SELECT id FROM usuario WHERE id = :usuario_id ";
		$params = array();
		$params[':usuario_id'] = $usuario_id;
		$query = DB::query($sql, $params);

		if(count($query) > 0 && $query[0]['id'] > 0){
			return true;
		}

		return false;
	}

	function validar ($usuario_model, $ignoraConfirm = false){

		$validar = array();
		if(strlen($usuario_model->usuario) == 0){
			$validar[] = 'Informe o usuario';
		}else{
			if($ignoraConfirm == false){
				if(!$this->validaUser($usuario_model->usuario, $usuario_model->id)){
					$validar[] = 'Usuario invalido';
				}
			}
		}

		if(strlen($usuario_model->nome) == 0){
			$validar[] = 'Informe o nome';
		}

		if(strlen($usuario_model->sobrenome) == 0){
			$validar[] = 'Informe o sobrenome';
		}

		if(strlen($usuario_model->email) == 0){
			$validar[] = 'Informe o e-mail';
		}else{
			if(!filter_var($usuario_model->email, FILTER_VALIDATE_EMAIL)){
				$validar[] = 'E-mail invalido';
			}else{
				if(!$this->validaEmail($usuario_model->email, $usuario_model->id)){

					
					$validar[] = 'E-mail já cadastrado';
				}
			}
		}

		if(strlen($usuario_model->senha) == 0){
			$validar[] = 'Informe a senha';
		}else{
			if($ignoraConfirm == false){
				if(strlen($usuario_model->confirm_senha) == 0){
					$validar[] = 'Confirme a senha';
				}else{
					
					if($usuario_model->senha != $usuario_model->confirm_senha){
						$validar[] = 'As senhas devem ser identicas';
					}
				}
			}
		}

		return $validar;
		
	}

	function verificaPermissao($usuario_id, $permissao){
		$sql = "SELECT usuario_id 
				FROM permissao 
				WHERE usuario_id = :usuario_id 
				AND nome IN (:permissao) AND valor = 1 ";
		$params = array();
		$params[':usuario_id'] = $usuario_id;
		$params[':permissao'] = $permissao;
		$query = DB::query($sql, $params);
		if(count($query) > 0 && $query[0]['usuario_id'] > 0){
			return true;
		}
		return false;
		/*array(
			'cadastrar_user' => 1,
			'delete_user' => 1,
			'criar_projeto_all' => 1,
			'ver_projeto_all' => 1,
			'editar_projeto_all' => 1,
			'delete_projeto_all' => 1,
			'ver_projeto_user' => 1,
			'editar_projeto_user' => 1,
			'delete_projeto_user' => 1,
			'criar_atividade_all' => 1,
			'ver_atividade_all' => 1,
			'editar_atividade_all' => 1,
			'delete_atividade_all' => 1,
			'criar_atividade_user' => 1,
			'ver_atividade_user' => 1,
			'editar_atividade_user' => 1,
			'delete_atividade_user' => 1,
		);*/
	}

	function insert($usuario_model, $safemode = false){

		if(count($this->validar($usuario_model)) > 0){
			throw new Exception(json_encode($this->validar($usuario_model)), 1);
		}

		$sql = "INSERT INTO usuario
				(
					insert_hora,
					nome,
					email,
					senha
				)
				VALUES
				(
					:insert_hora,
					:nome,
					:email,
					:senha
				) ";

		$params = array();
		$params[':insert_hora'] = $this->DateNow();
		$params[':nome'] = $usuario_model->nome;
		$params[':email'] = $usuario_model->email;
		$params[':senha'] = $usuario_model->senha;

		DB::exec($sql, $params);
		$usuario_model->id = DB::last_insert_id();
		$usuario_model = $this->popular($usuario_model->id, $safemode);

		return $usuario_model;
	}

	function update($usuario_model, $safemode = false){

		if(!$this->existe($usuario_model->id)){
			throw new Exception("Usuario nao encontrado", 1);
		}

		if(count($this->validar($usuario_model, true)) > 0){
			throw new Exception(json_encode($this->validar($usuario_model, true)), 1);
		}

		$sql = "UPDATE usuario SET 
					update_hora = :update_hora,
					nome = :nome,
					email = :email,
					senha = :senha
				WHERE id = :usuario_id ";

		$params = array();
		$params[':update_hora'] = $this->DateNow();
		$params[':nome'] = $usuario_model->nome;
		$params[':email'] = $usuario_model->email;
		$params[':senha'] = $usuario_model->senha;
		DB::exec($sql, $params);
		
		$usuario_model = $this->popular($usuario_model->id, $safemode);

		return $usuario_model;
	}

	function delete($usuario_model, $safemode = false){

		if(!$this->existe($usuario_model->id)){
			throw new Exception("Usuario nao encontrado", 1);
		}

		$sql = "UPDATE usuario SET 
		            delete_hora = :delete_hora,
					excluido = 1
				WHERE id = :usuario_id ";

		$params = array();
		$params[':delete_hora'] = $this->DateNow();
		$params[':usuario_id'] = $this->KeyToSQL($usuario_model->id);
		DB::exec($sql, $params);
		
		$usuario_model = $this->popular($usuario_model->id, $safemode);

		return $usuario_model;
	}

	function popular($usuario_id, $safemode = false){

		if(!$this->existe($usuario_id)){
			throw new Exception("Usuario nao encontrado", 1);
		}

		$sql = "SELECT 
					usuario.id AS usuario_id,
					usuario.insert_hora,
					usuario.update_hora,
					usuario.delete_hora,
					usuario.excluido,
					usuario.nome,
					usuario.email,
					usuario.senha
				FROM usuario
				WHERE usuario.id = :usuario_id ";

		$params = array();
		$params[':usuario_id'] = $usuario_id;
		$query = DB::query($sql, $params);

		return $this->preencher($query[0], $safemode);
	}

	function preencher($row_query, $safemode = false){

		$usuario_model = System::LoadModel('Usuario', true);

		if(isset($row_query['usuario_id']) && $row_query['usuario_id'] > 0){

			$usuario_model->id = $row_query['usuario_id'];
			if($safemode == false){
				$usuario_model->insert_hora = $row_query['insert_hora'];
				$usuario_model->update_hora = $row_query['update_hora'];
				$usuario_model->delete_hora = $row_query['delete_hora'];
				$usuario_model->excluido = $row_query['excluido'];
				$usuario_model->senha = $row_query['senha'];
			}
			$usuario_model->nome = $row_query['nome'];
			$usuario_model->email = $row_query['email'];

			
		}

		return $usuario_model;
	}

	function ValidarLogin($email, $senha){
		$sql = "SELECT id FROM usuario WHERE excluido = 0 AND email = :email AND senha = :senha ";
		
		$params = array();
		$params[':email'] = $email;
		$params[':senha'] = $senha;
		$query = DB::query($sql, $params);
		
		if(count($query) > 0 && $query[0]['id'] > 0){
			//carregos os objetos da sessao
			$sessao_dao = System::LoadDao('Sessao', true);
			$sessao_model = System::LoadModel('Sessao', true);

			$sessao_model->usuario_id = $query[0]['id'];
			$sessao_model->sessao_id = md5($query[0]['id'].microtime());
			$sessao_model->insert_hora = $this->DateNow();
			$sessao_model->ultimo_acesso = $this->DateNow();
			$sessao_model = $sessao_dao->salvar($sessao_model);

			return $sessao_model;
		}

		throw new Exception("Login invalido", 1);
		
	}

	function listar($nome = null){

		$sql = "SELECT 
					id,
					nome,
					email,
				FROM usuario
				WHERE excluido = 0 ";

		$params = array();
		if(strlen($nome) > 0){

			$sql .= " AND nome LIKE :nome ";
			$params[':nome'] = '%'.$nome.'%';
		}
		
		$query = DB::query($sql, $params);

		return $query;
	}

}