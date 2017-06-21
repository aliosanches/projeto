<?php 

class RouteMap {

	function __construct(){

	}

	public static function getRoute($route = null){

		$array_route = array(
			
			//Usuario.controller.php
			'usuario/login' => array('Usuario', 'login'), 
			'usuario/logout' => array('Usuario', 'logout'), 
			'usuario/dados' => array('Usuario', 'dados'),
			'usuario/excluir' => array('Usuario', 'excluir'),
			'usuario/listar' => array('Usuario', 'listar'),
			'usuario/salvar' => array('Usuario', 'salvar'),

			//Configuracoes.controller.php
			'configuracoes/set' => array('Configuracoes', 'set'),
			'configuracoes/get' => array('Configuracoes', 'get'),

			//Projeto.controller.php
			'projeto/listar' => array('Projeto', 'listar'), 
			'projeto/salvar' => array('Projeto', 'salvar'),
			'projeto/dados' => array('Projeto', 'dados'),
			'projeto/excluir' => array('Projeto', 'excluir'),

			//Atividade.controller.php
			'atividade/listar' => array('Atividade', 'listar'), 
			'atividade/salvar' => array('Atividade', 'salvar'),
			'atividade/dados' => array('Atividade', 'dados'),
			'atividade/excluir' => array('Atividade', 'excluir'), 
			      
		);

		if(!is_null($route) && isset($array_route[$route])){
			return $array_route[$route];
		}

		throw new Exception("Rota nao encontrada", 4);
		
	}
}