<?php

class Atividade_Dao extends Dao{

	function __construct(){

		System::LoadModel('Atividade');
	}

	function salvar($atividade_model){
		try{
			if($this->existe($atividade_model->id)){
				$atividade_model = $this->update($atividade_model);
			}else{
				$atividade_model = $this->insert($atividade_model);
			}
			return $atividade_model;
		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = 1;
			Controller::ReturnResponse($obj_error);
		}
	}


	function existe($atividade_id){
		$sql = "SELECT id FROM atividade WHERE id = :atividade_id ";
		$params = array();
		$params[':atividade_id'] = $atividade_id;
		$query = DB::query($sql, $params);

		if(count($query) > 0 && $query[0]['id'] > 0){
			return true;
		}
		return false;
	}

	function validar ($atividade_model, $ignoraConfirm = false){
		$validar = array();
		if(strlen($atividade_model->nome) == 0){
			$validar[] = 'Informe o atividade';
		}

		if(strlen($atividade_model->status) == 0){
			$validar[] = 'Informe o status';
		}
		return $validar;
	}

	function insert($atividade_model){
		if(count($this->validar($atividade_model)) > 0){
			throw new Exception(json_encode($this->validar($atividade_model)), 1);
		}

		$sql = "INSERT INTO atividade
				(
					insert_hora,
					nome,
					status,
					descricao,
					projeto_id,
					data_inicio,
					data_fim,
					tempo_previsto,
					tempo_gasto,
					valor_hora,
					usuario_id
				)
				VALUES
				(
					:insert_hora,
					:nome,
					:status,
					:descricao,
					:projeto_id,
					:data_inicio,
					:data_fim,
					:tempo_previsto,
					:tempo_gasto,
					:valor_hora,
					:usuario_id
				) ";

		$params = array();
		$params[':insert_hora'] = $this->DateNow();
		$params[':nome'] = $atividade_model->nome;
		$params[':status'] = $atividade_model->status;
		$params[':descricao'] = $atividade_model->descricao;
		$params[':projeto_id'] = $atividade_model->projeto_id;
		$params[':data_inicio'] = $atividade_model->data_inicio;
		$params[':data_fim'] = $atividade_model->data_fim;
		$params[':tempo_previsto'] = $atividade_model->tempo_previsto;
		$params[':tempo_gasto'] = $atividade_model->tempo_gasto;
		$params[':valor_hora'] = $atividade_model->valor_hora;
		$params[':usuario_id'] = $atividade_model->usuario_id;

		DB::exec($sql, $params);
		$atividade_model->id = DB::last_insert_id();
		$atividade_model = $this->popular($atividade_model->id);

		return $atividade_model;
	}

	function update($atividade_model){
		if(!$this->existe($atividade_model->id)){
			throw new Exception("Atividade nao encontrado", 1);
		}

		if(count($this->validar($atividade_model, true)) > 0){
			throw new Exception(json_encode($this->validar($atividade_model, true)), 1);
		}

		$sql = "UPDATE atividade SET 
					update_hora = :update_hora,
					nome = :nome,
					status = :status,
					descricao = :descricao,
					projeto_id = :projeto_id,
					data_inicio = :data_inicio,
					data_fim = :data_fim,
					tempo_previsto = :tempo_previsto,
					tempo_gasto = :tempo_gasto,
					valor_hora = :valor_hora,
					usuario_id = :usuario_id
				WHERE id = :atividade_id ";

		$params = array();
		$params[':update_hora'] = $this->DateNow();
		$params[':nome'] = $atividade_model->nome;
		$params[':status'] = $atividade_model->status;
		$params[':descricao'] = $atividade_model->descricao;
		$params[':projeto_id'] = $atividade_model->projeto_id;
		$params[':data_inicio'] = $atividade_model->data_inicio;
		$params[':data_fim'] = $atividade_model->data_fim;
		$params[':tempo_previsto'] = $atividade_model->tempo_previsto;
		$params[':tempo_gasto'] = $atividade_model->tempo_gasto;
		$params[':valor_hora'] = $atividade_model->valor_hora;
		$params[':usuario_id'] = $atividade_model->usuario_id;
		$params[':atividade_id'] = $atividade_model->id;
		DB::exec($sql, $params);
		
		$atividade_model = $this->popular($atividade_model->id);
		return $atividade_model;
	}

	function delete($atividade_model){
		if(!$this->existe($atividade_model->id)){
			throw new Exception("Atividade nao encontrado", 1);
		}

		$sql = "UPDATE atividade SET 
		            delete_hora = :delete_hora,
					excluido = 1
				WHERE id = :atividade_id ";

		$params = array();
		$params[':delete_hora'] = $this->DateNow();
		$params[':atividade_id'] = $this->KeyToSQL($atividade_model->id);
		DB::exec($sql, $params);
		
		$atividade_model = $this->popular($atividade_model->id);
		return $atividade_model;
	}

	function popular($atividade_id){
		if(!$this->existe($atividade_id)){
			throw new Exception("Atividade nao encontrado", 1);
		}

		$sql = "SELECT 
					atividade.id AS atividade_id,
					atividade.insert_hora,
					atividade.update_hora,
					atividade.delete_hora,
					atividade.excluido,
					atividade.nome,
					atividade.status,
					atividade.descricao,
					atividade.projeto_id,
					atividade.data_inicio,
					atividade.data_fim,
					atividade.tempo_previsto,
					atividade.tempo_gasto,
					atividade.valor_hora,
					atividade.usuario_id
				FROM atividade
				WHERE atividade.id = :atividade_id ";

		$params = array();
		$params[':atividade_id'] = $atividade_id;
		$query = DB::query($sql, $params);
		return $this->preencher($query[0]);
	}

	function preencher($row_query, $safemode = false){
		$atividade_model = System::LoadModel('Atividade', true);
		if(isset($row_query['atividade_id']) && $row_query['atividade_id'] > 0){

			$atividade_model->id = $row_query['atividade_id'];
			$atividade_model->insert_hora = $row_query['insert_hora'];
			$atividade_model->update_hora = $row_query['update_hora'];
			$atividade_model->delete_hora = $row_query['delete_hora'];
			$atividade_model->excluido = $row_query['excluido'];
			$atividade_model->nome = $row_query['nome'];
			$atividade_model->status = $row_query['status'];
			$atividade_model->data_inicio = $row_query['data_inicio'];
			$atividade_model->data_fim = $row_query['data_fim'];
		}
		return $atividade_model;
	}

	function listar($nome = null){
		$where = '';
		$params = array();
		if(strlen($nome) > 0){
			$where .= " AND atividade.nome LIKE :nome ";
			$params[':nome'] = '%'.$nome.'%';
		}

		$sql = "SELECT 
					atividade.id,
					atividade.nome,
					atividade.status,
					atividade.descricao,
					atividade.projeto_id,
					atividade.data_inicio,
					atividade.data_fim,
					atividade.tempo_previsto,
					atividade.tempo_gasto,
					atividade.valor_hora,
					atividade.usuario_id
				FROM atividade
				WHERE atividade.excluido = 0
				{$where} 
				ORDER BY atividade.status ASC ";
		
		$query = DB::query($sql, $params);
		return $query;
	}
}