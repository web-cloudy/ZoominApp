<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Trivia extends CI_Controller 
{
    public function get_user_trivia()
    {
        $this->load->model('TriviaModel');
        return $this->TriviaModel->get_user_Trivia_data();
    }
    public function get_all_trivia()
    {
        $this->load->model('TriviaModel');
        return $this->TriviaModel->get_Trivia_data();
    }
    public function addTrivia()
    {
        $this->load->model('TriviaModel');
        return $this->TriviaModel->addTrivia();
    }
    public function updateTrivia()
    {
        $this->load->model('TriviaModel');
        return $this->TriviaModel->updateTrivia();
    }
}
?>