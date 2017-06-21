<?php

class Projeto_Dao extends Dao{

	function __construct(){

		System::LoadModel('Projeto');
	}

	function salvar($projeto_model){

		try{

			if($this->existe($projeto_model->id)){
				$projeto_model = $this->update($projeto_model);
			}else{
				$projeto_model = $this->insert($projeto_model);
			}

			return $projeto_model;

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = 1;
			Controller::ReturnResponse($obj_error);
		}
	}


	function existe($projeto_id){

		$sql = "SELECT id FROM projeto WHERE id = :projeto_id ";
		$params = array();
		$params[':projeto_id'] = $projeto_id;
		$query = DB::query($sql, $params);

		if(count($query) > 0 && $query[0]['id'] > 0){
			return true;
		}

		return false;
	}

	function validar ($projeto_model, $ignoraConfirm = false){

		$validar = array();
		if(strlen($projeto_model->nome) == 0){
			$validar[] = 'Informe o projeto';
		}

		if(strlen($projeto_model->status) == 0){
			$validar[] = 'Informe o status';
		}

		return $validar;
	}

	

	function insert($projeto_model){

		if(count($this->validar($projeto_model)) > 0){
			throw new Exception(json_encode($this->validar($projeto_model)), 1);
		}

		$sql = "INSERT INTO projeto
				(
					insert_hora,
					nome,
					status,
					data_inicio,
					data_fim
				)
				VALUES
				(
					:insert_hora,
					:nome,
					:status,
					:data_inicio,
					:data_fim
				) ";

		$params = array();
		$params[':insert_hora'] = $this->DateNow();
		$params[':nome'] = $projeto_model->nome;
		$params[':status'] = $projeto_model->status;
		$params[':data_inicio'] = $projeto_model->data_inicio;
		$params[':data_fim'] = $projeto_model->data_fim;

		DB::exec($sql, $params);
		$projeto_model->id = DB::last_insert_id();
		$projeto_model = $this->popular($projeto_model->id);

		return $projeto_model;
	}

	function update($projeto_model){

		if(!$this->existe($projeto_model->id)){
			throw new Exception("Projeto nao encontrado", 1);
		}

		if(count($this->validar($projeto_model, true)) > 0){
			throw new Exception(json_encode($this->validar($projeto_model, true)), 1);
		}

		$sql = "UPDATE projeto SET 
					update_hora = :update_hora,
					nome = :nome,
					status = :status,
					data_inicio = :data_inicio,
					data_fim = :data_fim
				WHERE id = :projeto_id ";

		$params = array();
		$params[':update_hora'] = $this->DateNow();
		$params[':nome'] = $projeto_model->nome;
		$params[':status'] = $projeto_model->status;
		$params[':data_inicio'] = $projeto_model->data_inicio;
		$params[':data_fim'] = $projeto_model->data_fim;
		$params[':projeto_id'] = $projeto_model->id;
		DB::exec($sql, $params);
		
		$projeto_model = $this->popular($projeto_model->id);

		return $projeto_model;
	}

	function delete($projeto_model){

		if(!$this->existe($projeto_model->id)){
			throw new Exception("Projeto nao encontrado", 1);
		}

		$sql = "UPDATE projeto SET 
		            delete_hora = :delete_hora,
					excluido = 1
				WHERE id = :projeto_id ";

		$params = array();
		$params[':delete_hora'] = $this->DateNow();
		$params[':projeto_id'] = $this->KeyToSQL($projeto_model->id);
		DB::exec($sql, $params);
		
		$projeto_model = $this->popular($projeto_model->id);

		return $projeto_model;
	}

	function popular($projeto_id){

		if(!$this->existe($projeto_id)){
			throw new Exception("Projeto nao encontrado", 1);
		}

		$sql = "SELECT 
					projeto.id AS projeto_id,
					projeto.insert_hora,
					projeto.update_hora,
					projeto.delete_hora,
					projeto.excluido,
					projeto.nome,
					projeto.status,
					projeto.data_inicio,
					projeto.data_fim
				FROM projeto
				WHERE projeto.id = :projeto_id ";

		$params = array();
		$params[':projeto_id'] = $projeto_id;
		$query = DB::query($sql, $params);

		return $this->preencher($query[0]);
	}

	function preencher($row_query, $safemode = false){

		$projeto_model = System::LoadModel('Projeto', true);

		if(isset($row_query['projeto_id']) && $row_query['projeto_id'] > 0){

			$projeto_model->id = $row_query['projeto_id'];
			$projeto_model->insert_hora = $row_query['insert_hora'];
			$projeto_model->update_hora = $row_query['update_hora'];
			$projeto_model->delete_hora = $row_query['delete_hora'];
			$projeto_model->excluido = $row_query['excluido'];
			$projeto_model->nome = $row_query['nome'];
			$projeto_model->status = $row_query['status'];
			$projeto_model->data_inicio = $row_query['data_inicio'];
			$projeto_model->data_fim = $row_query['data_fim'];
		}

		return $projeto_model;
	}

	function listar($nome = null){
		$where = '';
		$params = array();
		if(strlen($nome) > 0){
			$where .= " AND nome LIKE :nome ";
			$params[':nome'] = '%'.$nome.'%';
		}

		$sql = "SELECT 
					id,
					nome,
					status,
					data_inicio,
					data_fim
				FROM projeto
				WHERE excluido = 0
				{$where} 
				ORDER BY status ASC ";
		
		$query = DB::query($sql, $params);

		return $query;
	}

}