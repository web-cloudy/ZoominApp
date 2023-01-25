<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller 
{
    public function get_user_data()
    {
        $this->load->model('UserModel');
        return $this->UserModel->get_user_data();
    }
    public function login()
    {
        $this->load->model('UserModel');
        return $this->UserModel->login();
    }
    public function addUser()
    {
        $this->load->model('UserModel');
        return $this->UserModel->addUser();
    }
    public function addSocialUser()
    {
        $this->load->model('UserModel');
        return $this->UserModel->addSocialUser();
    }
    public function checkUsername()
    {
        $this->load->model('UserModel');
        return $this->UserModel->checkUsername();
    }
    public function checkEmail()
    {
        $this->load->model('UserModel');
        return $this->UserModel->checkEmail();
    }
}
?>