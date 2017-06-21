<?php

class Atividade_Controller extends Controller{
	function __construct($sessao_model){
		$this->sessao_model = $sessao_model;
	}

	function listar(){
		try{
			$this->checkPermission($this->sessao_model->usuario_id, array('ver_atividade_all'));
			$atividade_dao = System::LoadDao('Atividade', true);
			$nome = $this->ReadGet('nome');
			$ret = $atividade_dao->listar($nome);
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
			$this->checkPermission($this->sessao_model->usuario_id, array('criar_atividade_all', 'editar_atividade_all'));
			$atividade_dao = System::LoadDao('Atividade', true);
			$atividade_model = System::LoadModel('Atividade', true);
			$atividade_id = $this->ReadPost('atividade_id');
			
			if($atividade_id > 0){
				$atividade_model = $atividade_dao->popular($atividade_id);
			}

			$atividade_model->nome = $this->ReadPost('nome');
			$atividade_model->status = $this->ReadPost('status');
			$atividade_model->descricao = $this->ReadPost('descricao');
			$atividade_model->projeto_id = $this->ReadPost('projeto_id');
			$atividade_model->data_inicio = $this->ReadPost('data_inicio');
			$atividade_model->data_fim = $this->ReadPost('data_fim');
			$atividade_model->tempo_previsto = $this->ReadPost('tempo_previsto');
			$atividade_model->tempo_gasto = $this->ReadPost('tempo_gasto');
			$atividade_model->valor_hora = $this->ReadPost('valor_hora');
			$atividade_model->usuario_id = $this->ReadPost('usuario_id');
			$atividade_model = $atividade_dao->salvar($atividade_model);

			$this->ReturnResponse($atividade_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function dados(){
		try{
			$this->checkPermission($this->sessao_model->usuario_id, array('ver_atividade_all'));
			$atividade_dao = System::LoadDao('Atividade', true);
			$atividade_model = System::LoadModel('Atividade', true);
			$atividade_id = $this->ReadGet('atividade_id');
			$atividade_model = $atividade_dao->popular($atividade_id);
			
			$this->ReturnResponse($atividade_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function excluir(){
		try{
			$this->checkPermission($this->sessao_model->usuario_id, array('delete_atividade_all'));
			$atividade_dao = System::LoadDao('Atividade', true);
			$atividade_model = System::LoadModel('Atividade', true);
			$atividade_id = $this->ReadPost('atividade_id');
			$atividade_model = $atividade_dao->popular($atividade_id);
			$atividade_model = $atividade_dao->delete($atividade_model, true);
			
			$this->ReturnResponse($atividade_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

}