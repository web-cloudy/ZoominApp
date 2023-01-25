<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");
class PlayerModel extends CI_model
{
    public function get_player()
    {
        $this->load->database();
        $param=$this->input->get();
      
      	$this->db->select('p.*, u.*')
          ->from('player AS p, user AS u')
          ->where('u.user_id = p.user_id')
          ->where('p.event_id', $param['event_id']);
       	$q = $this->db->get();
      	$data=$q->result_array();
        echo json_encode($data);
    }
    public function get_winner()
    {
        $this->load->database();
        $param=$this->input->get();
      
      	$this->db->select('p.*, u.*')
          ->from('player AS p, user AS u')
          ->where('u.user_id = p.user_id')
          ->where(array("p.event_id"=> $param['event_id'],"p.winner"=>"yes"));
       	$q = $this->db->get();
      	$data=$q->result_array();
        
      	echo json_encode($data);
    }
    public function addEventPlayer()
    {
        $param=$this->input->post();
      	//$param = json_decode(file_get_contents('php://input'),true);
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => 'https://play.zoomingaming.com/api/event_api/'.$param['event_id'],
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        $response=json_decode($response, true);
        //$user_limit=$response['user_limit'];
      	$user_limit=10;
        $game_start_time = $response['EventStartTimeDate'];
        $duration = $response['Time_Limit'];
      	$start_time = strtotime(date('Y-m-d H:i'));
        $end_time =date('Y-m-d H:i',strtotime($response['EventCompleteTimeDate']));
      	if(date('Y-m-d H:i',strtotime($game_start_time))>date('Y-m-d H:i'))
        {
          $data=array("success"=>false,"message"=>"Event is not started yet");
          echo json_encode($data);
        }
        else if(date('Y-m-d H:i',strtotime($end_time))<date('Y-m-d H:i'))
        {
          $data=array("success"=>false,"message"=>"Event is over");
          echo json_encode($data);
        } else {
          $this->load->database();
          $array = array('event_id' => $param['event_id']);
          $this->db->where($array);
          $q = $this->db->get('player');
          $data = $q->result_array();
          $user_data = array();
          foreach ($data as $key => $value) {
            $user_data[$value['user_id']] = $value;
          }
          if (!array_key_exists($param['user_id'], $user_data)) {
            if (count($data) < $user_limit) {
              $param['datetime'] = date('Y-m-d H:i');
              $q = $this->db->insert('player', $param);
              $data = array("success" => true, "message" => "Player added successfully","end_time"=>$end_time,"duration"=>$duration);
              echo json_encode($data);
            } else {
              $data = array("success" => false, "message" => "Event is full");
              echo json_encode($data);
            }
          } else {
            $data = array("success" => true, "message" => "","end_time"=>$end_time,"duration"=>$duration);
            echo json_encode($data);
          }
        }
    }
    public function updateEventPlayerPoint()
    {
        $param=$this->input->post();      	
        $this->load->database();
        $array=array('event_id'=>$param['event_id'],'user_id'=>$param['user_id']);
        $this->db->where($array);
        $params = array();
        $params['points'] = $param['points'];

        $q=$this->db->update('player',$params);        
    }
    public function updateEventPlayerTime()
    {
        $param=$this->input->post();      	
        $this->load->database();
        $array=array('event_id'=>$param['event_id'],'user_id'=>$param['user_id']);
        $this->db->select('played_time')
            ->from('player AS p')
            ->where($array);
        $q = $this->db->get();
        $data=$q->result_array();
          
        $minutes=$param['second']+$data[0]['played_time'];

        $this->db->where($array);
        $params = array();
        $params['played_time'] = $minutes;

        $q=$this->db->update('player',$params);        
    }
    
    public function getHighestPlayerPoint()
    {
        $param=$this->input->post();      	
        $this->load->database();
        $array=array('event_id'=>$param['event_id']);
        $this->db->select('MAX(points) as points')
             ->from('player AS p')
             ->where($array);
       	$q = $this->db->get();
      	$data=$q->result_array();
      if ($data[0]['points'] == '') {
      echo 0;
      } else {
        echo $data[0]['points'];
      }
        
    }
}

        
?>