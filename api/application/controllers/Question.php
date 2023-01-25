<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Question extends CI_Controller 
{
    public function get_Questions()
    {
        $this->load->model('QuestionModel');
        return $this->QuestionModel->get_Question_data();
    }
    public function addQuestion()
    {
        $this->load->model('QuestionModel');
        return $this->QuestionModel->addQuestion();
    }
    public function updateQuestion()
    {
        $this->load->model('QuestionModel');
        return $this->QuestionModel->updateQuestion();
    }
}
?>