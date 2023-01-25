<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");
class QuestionModel extends CI_model
{
    public function get_Question_data()
    {
        $this->load->database();
        $param=$this->input->get();
        $array = array("trivia_id" => $param['trivia_id']);
        $this->db->where($array);
        $q=$this->db->get('question');
        $data=$q->result_array();  
      	echo json_encode($data);
    }
    public function addQuestion()
    {
        $params=$this->input->get();
        $param = json_decode(file_get_contents('php://input'),true);
      	$param['trivia_id']=$params['trivia_id'];
    	$this->load->database();
        $q=$this->db->insert('question',$param);        
      	$data=array("success"=>"true","message"=>"Question added successfully");
      	echo json_encode($data);
    }
    public function updateQuestion()
    {
        
      	$this->load->database();
        $params=$this->input->get();
        $array=array('id'=>$params['id'],'trivia_id'=>$params['trivia_id']);
        $this->db->where($array);
        $q=$this->db->get('question');
        $data=$q->result_array();  
      	if(count($data)>0)
        {
          $param = json_decode(file_get_contents('php://input'),true);
          $array=array('id'=>$params['id'],'trivia_id'=>$params['trivia_id']);
          $this->db->where($array);
          $q=$this->db->update('question',$param);        
          $data=array("success"=>"true","message"=>"Question updated successfully");
          echo json_encode($data);
        }
      	else
        {
          $data=array("success"=>"false","message"=>"No Question id and Trivia id not matched please check again");
          echo json_encode($data);
        }
    }
}

?>