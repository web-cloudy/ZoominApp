<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");
class GameModel extends CI_model
{
    public function get_game()
    {
        $this->load->database();
        $this->db->order_by("id", "asc");
        $q=$this->db->get('game');
        $data=$q->result_array();
        echo json_encode($data);
    }
  	public function get_event()
    {
        $param = $this->input->post();
        $this->load->database();
        $this->db->where("id", $param['event_id']);
        $q=$this->db->get('event');
        $data=$q->result_array();
      	if($param['return']=='no')
        {
          echo json_encode($data);
        }
      	else
        {
          return json_encode($data);
        }
        
    }
    
}

?>