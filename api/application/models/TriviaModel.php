<?php
header('Access-Control-Allow-Origin: *');
//header("Access-Control-Allow-Methods: GET, OPTIONS");
class TriviaModel extends CI_model
{
    public function get_user_Trivia_data()
    {
        $this->load->database();
        $param=$this->input->get();
        $this->db->where("user_id", $param['user_id']);
        $this->db->order_by("date", "asc");
        $q=$this->db->get('trivia');
        $data=$q->result_array();
        echo json_encode($data);
    }
    public function get_Trivia_data()
    {
        $this->load->database();
        $param=$this->input->get();
        $this->db->order_by("date", "asc");
        $q=$this->db->get('trivia');
        $data=$q->result_array();        
        echo json_encode($data);
    }
    public function addTrivia()
    {
      	$param = json_decode(file_get_contents('php://input'),true);
        $this->load->database();
      	$param['date']=date('Y-m-d');
        $q=$this->db->insert('trivia',$param);        
      	$data=array("success"=>"true","message"=>"Trivia added successfully","trivia_id"=>$this->db->insert_id(),"url"=>"https://saviour.earth/ZoomIn/trivia/question_list.php?trivia_id=".$this->db->insert_id());
      	echo json_encode($data);
    }
    public function updateTrivia()
    {
      	$this->load->database();
        $params=$this->input->get();
        $array=array('id'=>$params['id'],'user_id'=>$params['user_id']);
        $this->db->where($array);
        $q=$this->db->get('trivia');
        $data=$q->result_array();
        if(count($data)>0)
        {
          $param = json_decode(file_get_contents('php://input'),true);
          $array=array('id'=>$params['id'],'user_id'=>$params['user_id']);
          $this->db->where($array);
          $q=$this->db->update('trivia',$param);  
          $data=array("success"=>"true","message"=>"Trivia updated successfully");
          echo json_encode($data);
        }
      	else
        {
          $data=array("success"=>"false","message"=>"No User id and Trivia id not matched please check again");
          echo json_encode($data);
        }
    }
}

?>