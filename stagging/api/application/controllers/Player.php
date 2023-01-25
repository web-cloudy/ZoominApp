<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Player extends CI_Controller 
{
    public function get_players()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->get_player();
    }
    public function get_winners()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->get_winner();
    }
    public function addEventPlayer()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->addEventPlayer();
    }
    public function updateEventPlayerPoint()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->updateEventPlayerPoint();
    }
    public function updateEventPlayerTime()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->updateEventPlayerTime();
    }
    public function getHighestPlayerPoint()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->getHighestPlayerPoint();
    }
    public function updateEventWinner()
    {
        $this->load->model('PlayerModel');
        return $this->PlayerModel->updateEventWinner();
    }
}
?>