<?php

class Projeto_Controller extends Controller{
	function __construct($sessao_model){
		$this->sessao_model = $sessao_model;
	}
	
	function listar(){
		try{
			$this->checkPermission($this->sessao_model->usuario_id, array('ver_projeto_all'));
			$projeto_dao = System::LoadDao('Projeto', true);
			$nome = $this->ReadGet('nome');
			$ret = $projeto_dao->listar($nome);
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
			$this->checkPermission($this->sessao_model->usuario_id, array('criar_projeto_all', 'editar_projeto_all'));
			$projeto_dao = System::LoadDao('Projeto', true);
			$projeto_model = System::LoadModel('Projeto', true);
			$projeto_id = $this->ReadPost('projeto_id');
			
			if($projeto_id > 0){
				$projeto_model = $projeto_dao->popular($projeto_id);
			}

			$projeto_model->nome = $this->ReadPost('nome');
			$projeto_model->status = $this->ReadPost('status');
			$projeto_model->data_inicio = $this->ReadPost('data_inicio');
			$projeto_model->data_fim = $this->ReadPost('data_fim');
			$projeto_model = $projeto_dao->salvar($projeto_model);
			$this->ReturnResponse($projeto_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function dados(){
		try{
			$this->checkPermission($this->sessao_model->usuario_id, array('ver_projeto_all'));
			$projeto_dao = System::LoadDao('Projeto', true);
			$projeto_model = System::LoadModel('Projeto', true);
			$projeto_id = $this->ReadGet('projeto_id');
			$projeto_model = $projeto_dao->popular($projeto_id);
			$this->ReturnResponse($projeto_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

	function excluir(){
		try{
			$this->checkPermission($this->sessao_model->usuario_id, array('delete_projeto_all'));
			$projeto_dao = System::LoadDao('Projeto', true);
			$projeto_model = System::LoadModel('Projeto', true);
			$projeto_id = $this->ReadPost('projeto_id');
			$projeto_model = $projeto_dao->popular($projeto_id);
			$projeto_model = $projeto_dao->delete($projeto_model, true);
			$this->ReturnResponse($projeto_model);

		}catch(Exception $e){
			$obj_error = (object)array();
			$obj_error->mensagem = $e->getMessage();
			$obj_error->err_code = $e->getCode();
			$this->ReturnResponse($obj_error);
		}
	}

}