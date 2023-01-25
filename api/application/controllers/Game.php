<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Game extends CI_Controller 
{
    public function get_games()
    {
        $this->load->model('GameModel');
        return $this->GameModel->get_game();
    }    
  	public function get_event()
    {
        $this->load->model('GameModel');
        return $this->GameModel->get_event();
    }    
}
?>