<?php 

class Dao {

	public static function BoolToStr($value){
		if($value === true || $value === 'true' || $value === 'S'){
			return 'S';
		}
		return 'N';
	}

	public static function KeyToSQL($value){
		if((int)$value > 0){
			return (int)$value;
		}
		return null;
	}

	public static function DateNow(){
		
		return date('Y-m-d H:i:s');
	}
}



