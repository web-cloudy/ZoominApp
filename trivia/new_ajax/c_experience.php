<?php
header("Cache-Control: no-cache, must-revalidate");
include('../db_new.php');
extract($_REQUEST);
$datetime=date('Y/m/d H:i');
if($req==1)
{
  	$sql=mysqli_query($connect,"select correct from question where id='$id'");
 	$ar=mysqli_fetch_array($sql);
 	echo $ar['correct'];
}
if($req==2)
{
  	$sqls=mysqli_query($connect,"select * from question where  trivia_id='$trivia_id' AND question NOT LIKE ''");
  	if(mysqli_num_rows($sqls)>0)
    {
      $sql=mysqli_query($connect,"select * from question where id>'$id' AND trivia_id='$trivia_id' AND question NOT LIKE '' ORDER BY id ASC LIMIT 1");
      if(mysqli_num_rows($sql)>0)
      {
        while($rs=mysqli_fetch_assoc($sql))
        {
          ?>
            <input type="hidden" id="id" value="<?php echo $rs['id']?>">

            <div class="quiz pull-left w-100 font20 p-10">
                <span id="question">
                  <div class="textele text-left hebrewright text-white hebrew m-t-20 m-b-20"><?php echo $rs['question']?>?</div>
                </span>
              </div>
              <div class="answers w-100 m-t-10 p-b-100 pull-left">
                <?php if($rs['answer1']!=''){?>
                <div class="w-100 m-t-10 m-b-10 pull-left">
                  <div class="p-l-10 p-r-30 relative answer textele  c_answer answer1" onclick="set_answer('1')">
                    <div class="form-check mb-1 mt-2 w-100 float-start">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="ans1">
                      <label class="form-check-label w-100" for="ans1">
                        <div class="border-dark-grey ans_text border b-radius-6 w-100 p-10 text-left"><?php echo $rs['answer1']?></div>
                      </label>
                    </div>

                  </div>
                </div>
                <?php }if($rs['answer2']!=''){?>
                <div class="w-100 m-t-10 m-b-10 pull-left">
                  <div class="p-l-10 p-r-30 relative answer textele   answer2" onclick="set_answer('2')">
                    <div class="form-check mb-1 mt-2 w-100 float-start">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="ans2">
                      <label class="form-check-label w-100" for="ans2">
                        <div class="border-dark-grey ans_text border b-radius-6 w-100 p-10 text-left"><?php echo $rs['answer2']?></div>
                      </label>
                    </div>
                  </div>
                </div>
                <?php }if($rs['answer3']!=''){?>
                <div class="w-100 m-t-10 m-b-10 pull-left">
                  <div class="p-l-10 p-r-30 relative answer textele   answer3" onclick="set_answer('3')">
                    <div class="form-check mb-1 mt-2 w-100 float-start">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="ans3">
                      <label class="form-check-label w-100" for="ans3">
                        <div class="border-dark-grey ans_text border b-radius-6 w-100 p-10 text-left"><?php echo $rs['answer3']?></div>
                      </label>
                    </div>
                  </div>
                </div>
                <?php }if($rs['answer4']!=''){?>
                <div class="w-100 m-t-10 m-b-10 pull-left">
                  <div class="p-l-10 p-r-30 relative answer textele   answer4" onclick="set_answer('4')">
                    <div class="form-check mb-1 mt-2 w-100 float-start">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="ans4">
                      <label class="form-check-label w-100" for="ans4">
                        <div class="border-dark-grey ans_text border b-radius-6 w-100 p-10 text-left"><?php echo $rs['answer4']?></div>
                      </label>
                    </div>
                  </div>
                </div>
                <?php }?>
              </div>
            <?php
        }
      }
      else
      {
        echo "Thank you for playing";
      }
    }
  	else
    {
      echo "No questions added";
    }
}
if($req==3)
{
  	?>
	<div class="col-lg-9  text-white darkgrey valid" style="border: 2px solid #fff;border-radius: 10px;padding-top: 10px;padding-bottom: 10px;">
    <?php
  	$i=1;
  	$sql=mysqli_query($connect,"select * from trivia where id='$trivia_id'");
  	while($rs=mysqli_fetch_assoc($sql))
    {
      $status=$rs['status'];
    }
  	$sql=mysqli_query($connect,"select * from question where trivia_id='$trivia_id'");
  	while($rs=mysqli_fetch_assoc($sql))
    {
      	?>
		<div class="col-lg-12 pull-left p-0 m-t-10" style="display: flex;align-items: center;">
            <div class="col-lg-1 p-0">
              <?php echo $i++?>
          	</div>
            <div class="col-lg-8 text-ellipsis">
          		<a class="text-white" <?php if($rs['question']==""){ echo 'style="text-decoration: underline;"'; }?> href="add_question.php?trivia_id=<?php echo $trivia_id ?>&item_id=<?php echo $rs['id'] ?>"><?php if($rs['question']==''){echo "Add Details";}else{echo $rs['question'];}?></a>
      		</div>
            <div class="col-lg-3 p-0 text-right">
              <?php if($rs['question']!=''){?>
              	<div class="col-lg-6 p-0">
                  <a href="add_question.php?item_id=<?php echo $rs['id'] ?>" class="btn btn-sm btn-app-gradient bold inter-font" style="padding: 1px 7px;border-radius: 4px;background:#157db8">Edit</a>
              </div>
              <?php }?>
              <div class="col-lg-<?php if($rs['question']==''){echo "12";}else{echo "6"; }?> p-0" onclick="set_id('#delete_modal .id','<?php echo $rs['id'] ?>')" data-target="#delete_modal" data-toggle="modal"><button class="btn btn-sm btn-app-gradient bold inter-font" style="padding: 1px 7px;border-radius: 4px;">Delete</button></div></div>
  		</div>
		<?php
    }
  	?>
	</div>
	<div class="col-lg-12 p-0">
      <div class="col-lg-9 p-0 m-t-20">
        <div class="col-lg-4 p-0">
        	<a href="add_question.php?trivia_id=<?php echo $trivia_id ?>" class="btn col-lg-12 btn-app-gradient bold inter-font p-0" style="height:40px;line-height: 40px;background:#157db8" >Add More</a>
        </div>
        <div class="col-lg-4 p-0">
        	<div class="col-lg-12 pull-left text-center p-0 font15 status1 text-black line-height40 bold ">
              <span class="lable1 text-white" style="font-weight:normal"><?php if($status=='' || $status=='draft'){?>Draft<?php }else{echo "Published";}?></span>
              <div class="toggle-switch text-center" data-ts-color="<?php if($status=='' || $status=='draft'){?>red<?php }else{echo "green";}?>">
                <input id="check1" type="checkbox" <?php if($status=='' || $status=='draft'){ }else{?>checked=""<?php }?> onclick="publish('<?php echo $trivia_id ?>','#check1')" hidden="hidden">
                <label for="check1" class="ts-helper"></label>
              </div>													
          </div>
        </div>
        <div class="col-lg-4 p-0">
        	<a href="create_trivia.php" class="btn col-lg-12 btn-app-gradient bold inter-font p-0 pull-right" style="height:40px;line-height: 40px;" >Create New Trivia</a>
        </div>        
      </div>     	
	</div>

    <?php  	
}
if($req==4)
{
  mysqli_query($connect,"delete from question where id='$id'");
}
if($req==5)
{
  mysqli_query($connect,"update trivia set status='$status' where id='$trivia_id'");
}
if($req==7)
{	
        $background=$quotebg;
	    $question=addslashes($question);
  		if($id=='')
        {
	    	mysqli_query($connect,"INSERT INTO `question` (question,`answer1`, answer2,answer3,answer4,background,correct,trivia_id) VALUES ('$question','$answer1','$answer2','$answer3','$answer4','$background','$correct_answer','$trivia_id')");
        }
  		else
        {
          mysqli_query($connect,"UPDATE `question` set question='$question',`answer1`='$answer1', answer2='$answer2',answer3='$answer3',answer4='$answer4',background='$background',correct='$correct_answer' where id='$id'");
        }
		echo "ok";
}
if($req==8)
{
 	    $name=addslashes($name);
  		$date=date('Y-m-d',strtotime($date));
	    mysqli_query($connect,"INSERT INTO `trivia` (date,`name`, no_of_question) VALUES ('$date','$name','$no_of_question')");
  		$sql=mysqli_query($connect,"select MAX(id) as id from trivia");
  		$data=mysqli_fetch_assoc($sql);
  		for($i=1;$i<=$no_of_question;$i++)
        {
  			mysqli_query($connect,"INSERT INTO `question` (trivia_id) VALUES ('".$data['id']."')");
        }
  		echo "ok,,$".$data['id'];
}
?>