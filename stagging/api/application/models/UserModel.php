<?php
header('Access-Control-Allow-Origin: *');
Class UserModel extends CI_model
{
    public function get_user_data()
    {
        $this->load->database();
        $param=$this->input->get();
        $this->db->where("user_id", $param['id']);
        $q=$this->db->get('user');
        $data=$q->result_array();
      	if($data[0]['dob']=='0000-00-00')
        {
          $data[0]['dob']='';
        }
      	else
        {
        	$data[0]['dob']= date('d-m-Y', strtotime($data[0]['dob']));
        }
        echo json_encode($data);
    }
    public function login()
    {
        $this->load->database();
        $param=$this->input->post();
        $array = array("email" => $param['email'], "password" => $param["password"]);
        $this->db->where($array);
        $q=$this->db->get('user');
        $data=$q->result_array();
        if (count($data) > 0) 
        {
            if($data[0]['password']=='' || $data[0]['username']=='')
            {
                $data = array(array("success" => false, "message" => "set_user", "user_id" => $data[0]['user_id']));    
                echo json_encode($data);            
            } else {
                echo json_encode($data);
            }
        }
        else
        {
            $data = array(array("success" => false, "message" => "Username or password is invalid"));
            echo json_encode($data);
        }
    }    
    public function addUser()
    {
        $this->load->database();
        $param = $this->input->post();
        $param['dob'] = date('Y-m-d', strtotime($param['dob']));    
        if ($param['user_id'] == '') {
            $q=$this->db->insert('user',$param);     
            $data=array(array("success"=>true,"message"=>"User registered successfully","user_id"=>$this->db->insert_id()));   
            echo json_encode($data);
        }
        else{
            $array = array("user_id" => $param['user_id']);
            $this->db->where($array);
            $q = $this->db->get('user');
            $data = $q->result_array();
            if (count($data) > 0) {
                $array = array('user_id' => $param['user_id']);
                $this->db->where($array);
                $q = $this->db->update('user', $param);
                $data = array(array("success" => true, "message" => "Data updated successfully"));
                echo json_encode($data);
            } else {
                $data = array(array("success" => false, "message" => "User does not exist"));
                echo json_encode($data);
            }
        }
    }
  
    public function addSocialUser()
    {
        $this->load->database();
        $param = $this->input->post();
      	$param['logourl']=str_replace('amps','&',$param['logourl']);
        $array = array("email" => $param['email']);
        $this->db->where($array);
        $q=$this->db->get('user');
        $data=$q->result_array();
        if (count($data) > 0) 
        {
            $array = array('email' => $param['email']);
            $this->db->where($array);
            $q = $this->db->update('user', $param);
            if($data[0]['password']=='' || $data[0]['username']=='')
            {
                $data = array(array("success" => false, "message" => "set_user", "user_id" => $data[0]['user_id']));    
                echo json_encode($data);            
            } else {
              	$data=array(array("success"=>true,"message"=>"done","user_id"=>$data[0]['user_id'],"email"=>$data[0]['email']));   
                echo json_encode($data);
            }
        }
        else
        {
            $q=$this->db->insert('user',$param);     
            $data=array(array("success"=>true,"message"=>"User registered successfully","user_id"=>$this->db->insert_id()));   
            echo json_encode($data);
        }
    }
    public function checkUsername()
    {
        $this->load->database();
        $param = $this->input->post();
        if ($param['user_id'] != '') {
            $array = array("username" => $param['username'], "user_id NOT LIKE " => $param['user_id']);
        } else {
            $array = array("username" => $param['username']);
        }
        $this->db->where($array);
        $q = $this->db->get('user');
        $data = $q->result_array();
        if (count($data) > 0) 
        {
            $data = array(array("success" => false, "message" => "Username already exist"));
            echo json_encode($data);
        } else {
            $data = array(array("success" => true));
            echo json_encode($data);
        }
    
    }    
    public function checkEmail()
    {
        $this->load->database();
        $param = $this->input->post();
        if ($param['user_id'] != '') {
            $array = array("email" => $param['email'], "user_id NOT LIKE " => $param['user_id']);
        } else {
            $array = array("email" => $param['email']);
        }
        $this->db->where($array);
        $q = $this->db->get('user');
        $data = $q->result_array();
        if (count($data) > 0) 
        {
            $data = array(array("success" => false, "message" => "Email already exist"));
            echo json_encode($data);
        } else {
            $data = array(array("success" => true));
            echo json_encode($data);
        }
    
    }    
}

?>