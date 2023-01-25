<?php 
session_start();
include('db_new.php');
extract($_REQUEST);
?>
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
        <meta http-equiv="Cache-control" content="no-cache">
        <meta http-equiv="Expires" content="-1">
        <title>Trivia</title>
        <link rel="icon" type="image/png" href="favicon.png" sizes="32x32">
    	<link rel="apple-touch-icon" sizes="180x180" href="favicon.png">
        <link href="css/bootstrap-select.css" rel="stylesheet">
        <link href="css/chosen.min.css" rel="stylesheet">
        <link href="css/material-design-iconic-font.min.css" rel="stylesheet">
        <link href="fonts1/fonts.css" rel="stylesheet">
        <link href="css/bootstrap-select.css" rel="stylesheet">
 		<link href="css/farbtastic.css" rel="stylesheet">
        <link href="css/app.min.1.css" rel="stylesheet">
        <link href="css/app.min.2.css" rel="stylesheet">
		<link rel="stylesheet" href="css/croppie.css">
      <style>
@import url("https://fonts.googleapis.com/css?family=Roboto:400,500,600&display=swap");
@import url("https://fonts.googleapis.com/css?family=Inter:400,500,600&display=swap");
body{ font-family: 'Roboto', sans-serif;
    font-size: 15px;
    letter-spacing: .004em;
    color: #FFFFFF;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #16012D;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale}
.divider span {
    display: table-cell;
    position: relative;
}

.divider span:first-child,
.divider span:last-child {
    width: 50%;
    top: 8px;
    /* adjust vertical align */
    -moz-background-size: 100% 2px;
    /* line width */
    background-size: 100% 2px;
    /* line width */
    background-position: 0 0, 0 100%;
    background-repeat: no-repeat;
}

.divider span:first-child {
    /* color changes in here */
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(transparent), to(#fff));
    background-image: -webkit-linear-gradient(180deg, transparent, #fff);
    background-image: -moz-linear-gradient(180deg, transparent, #fff);
    background-image: -o-linear-gradient(180deg, transparent, #fff);
    background-image: linear-gradient(90deg, transparent, #fff);
}

.divider span:nth-child(2) {
    color: #283477;
    padding: 0px 5px;
    width: auto;
    white-space: nowrap;
}

.divider span:last-child {
    /* color changes in here */
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fff), to(transparent));
    background-image: -webkit-linear-gradient(180deg, #fff, transparent);
    background-image: -moz-linear-gradient(180deg, #fff, transparent);
    background-image: -o-linear-gradient(180deg, #fff, transparent);
    background-image: linear-gradient(90deg, #fff, transparent);
}
    
.form-check {
    padding: 0;
    margin: 0;
    min-height: auto;
    height: auto
}

.form-check .form-check-input {
    display: none
}

.form-check .form-check-label {
    cursor: pointer;
    position: relative;
    min-height: 20px;
    padding: 0px 0 0 32px;
    line-height: 1.7em;
    color: #fff
}

.form-check .form-check-label:after {
    position: absolute;
    left: 0;
    top: 10px;
    content: "";
    display: block;
    width: 22px;
    height: 22px;
    background: transparent;
    border-radius: 2px;
    border: 1px solid #DCDCE9
}

.form-check .form-check-label:before {
    content: "";
    display: block;
    width: 22px;
    height: 22px;
    position: absolute;
    left: 0;
    top: 10px;
    z-index: 3;
    opacity: 0;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")
}

.form-check-input[type="radio"]~.form-check-label:before {
    background-image: url("data:image/svg+xml,%0A%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Ccircle id='Oval' fill='%23FFFFFF' cx='4' cy='4' r='4'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center
}

.form-check-input:checked~.form-check-label:after {
    background-color: #221343;
    border-color: #fff !important
}

.form-check-input:checked~.form-check-label:before {
    opacity: 1
}

.form-check-inline {
    margin-right: 0
}

.form-check-inline .form-check-label {
    margin-bottom: -3px;
    padding-left: 24px
}

.input-list .form-check:after {
    content: "";
    height: 1px;
    background: #DCDCE9;
    display: block;
    margin-left: 54px
}

.input-list .form-check .form-check-label {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 0.1s all;
    padding: 6px 16px 6px 54px
}

.input-list .form-check .form-check-label:before,
.input-list .form-check .form-check-label:after {
    left: 16px;
    top: 14px
}

.input-list .form-check .form-check-label:active {
    background: rgba(220, 220, 233, 0.3)
}

.input-list .form-check:last-child:after {
    height: 0
}

.form-switch {
    height: 30px
}

.form-switch .form-check-label {
    width: 56px;
    height: 30px;
    padding: 0;
    margin: 0
}

.form-switch .form-check-label:after {
    height: 30px;
    width: 56px;
    background: #DCDCE9;
    border: 1px solid #ccccdf;
    transition: .1s linear
}

.form-switch .form-check-label:before {
    opacity: 1;
    border-radius: 100px;
    width: 24px;
    height: 24px;
    top: 3px;
    left: 4px;
    background: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    transition: .15s ease-in-out
}

.form-switch .form-check-input:checked~.form-check-label:before {
    left: 28px
}
.inter-font {
    font-family: 'Inter';
}
.btn-app-gradient {
    color: #fff;
    border: 0px;
    box-shadow: 0px 3px 5px 0px #0000005c!important;
    background: #FF0676;
    border-radius: 8px;
}
.darkgreyboder {
    border: 2px solid #fff !important;
}
.fg-line .form-control:not(:disabled) {
    color: #fff;
}
.form-control::placeholder{color:#fff !important}
  </style>
  
    </head>
    <body class="toggled sw-toggled scrollbar  p-0 m-0">
        <section id="main">
            <section id="content">
                <div class="container ">
                    <div class="row">
                        <div class="">
                        	<div class="col-lg-12 p-0" id="text_form">
                              	<?php
                              	$sql=mysqli_query($connect,"select * from question where id='$item_id'");
                              	$rs=mysqli_fetch_assoc($sql);
                              	?>
                              	<input type="hidden" name="id" value="<?php echo $item_id?>">
                              	<input type="hidden" name="trivia_id" value="<?php echo $trivia_id?>">
                                <input type="hidden" name="transmedia_type" value="quiz">
                                <input type="hidden" name="transmedia_subtype" value="quiz">
                                <input type="hidden" name="background" id="backgroundimg">
                                <input type="hidden" id="pdfdeleted" name="pdfdeleted">
                                <input type="hidden" value="" name="changepdf" id="changepdf"/>
                                <input type="hidden" value="" name="set_image" id="set_image"/>
                                <div class="col-lg-7 col-md-8 col-sm-8 p-0">
                                  	<div class="col-lg-9 pull-left p-0">
                                      	<div class="w-100 pull-left text-center m-t-20 m-b-20"><img style="max-width:250px" src="logo.png"></div>
                                      	<div class="w-100 pull-left text-center">
                                      		<div class="m-t-20 divider col-lg-8 card-title m-b-20 text-center" style="float:none;margin:auto"><span></span><span class="bold" style="font-size: 25px;color: white;">TRIVIA</span><span></span></div>
                                     	</div>
                                  		<p class="m-b-10 font15 p-b-0 m-t-20 pull-left inter-font">Educate your readers on an important topic using a trivia quiz experience </p>
									</div>
                                    					
                                    <div>
                                        <div class="tab-content">
                                            <div class="col-lg-12 p-0 darkgrey valid">
                                                <div class="form-group fg-float pull-left col-lg-9 p-0 m-t-30 m-b-0">
                                                	<div class="m-b-0 bold col-sm-12 p-0">
                                                        <label class="bold pull-left" style="line-height:20px;color: #04B4DD;">
                                                            Add Question 
                                                        </label>
                                                    </div>
                                                    <div class="fg-line">
                                                        <input type="text" id="quizequestion" name="question" onKeyUp="changetext('#quizequestion','#question'),setquizheight()" placeholder="Insert a Question" class="input-sm darkgreyboder  form-control fg-input p-l-5" data-required='yes' data-validation-required-message="This field is required" value="<?php echo $rs['question']?>">
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 m-b-0 text-danger hidden error m-t-30 m-b-0 line-height40">Field Can't be empty</div>
                                            </div>
											<div class="col-lg-12 p-0 darkgrey valid  m-t-30 m-b-0">
                                                <div class="m-b-0 bold col-sm-12 p-0">
                                                    <label class="bold pull-left" style="line-height:20px;color: #04B4DD;">
                                                        Add Answers (Upto 4 Answers)  
                                                    </label>
                                                </div>
                                                <?php
												for($i=1;$i<=4;$i++)
												{
												?>
                                                <div class="col-lg-12 p-0 darkgrey valid relative m-t-<?php if($i==1){echo "0";}else{echo "30";}?> m-b-0">
                                                    <div class="form-group fg-float pull-left relative col-lg-9 p-0 m-t-0 m-b-0">
                                                        <div class="fg-line">
                                                            <input type="text" name="answer<?php echo $i;?>" id="answer<?php echo $i;?>" placeholder="Insert a Answer <?php echo $i;?>" onKeyUp="remove_ans_error(),changetext('#answer<?php echo $i?>','.answer<?php echo $i?>'),show_correct_text(this,'correct_ans')" class="input-sm darkgreyboder font15 form-control fg-input p-l-5 answer_textbox border-dark-grey ans_text border b-radius-6 w-100 p-10 text-left" value="<?php echo $rs['answer'.$i]?>" style="padding-right:20px">
                                                        </div>
                                                        <span class="clear_text hidden pointer z-index111" onClick="remove_text(this),show_correct_text('#answer<?php echo $i?>','correct_ans')"><i class="zmdi zmdi-close"></i></span>
                                                    </div>
                                                    <div class="success_radio m-b-10 col-sm-3  m-t-10 m-b-0 m-l-10 <?php if($rs['answer'.$i]==''){ echo "hidden";}?>" style="position: absolute;right: -7px;">
                                                        <label class="bold">
                                                            <input type="radio" value="<?php echo $i?>" <?php if($i==1 && $item_id==''){echo "checked";}else{if($rs['correct']==$i){echo "checked";}}?> name="correct_ans" onClick="set_correct()">
                                                            <i class="input-helper"></i>
                                                            <span style="line-height:17px;">Correct</span>
                                                        </label>
                                                    </div>    
                                                </div>
                                                <?php
												}
												?>
                                            </div>
                                            <div class="error pull-left text-left w-100 text-danger bold m-t-10"></div>
                                            
                                            <div class="col-lg-12 b-radius-6 p-b-10 p-0 m-t-10">
                                                <div class="col-lg-12 p-0 m-t-20">
                                                    <button class="btn col-lg-3 btn-app-gradient bold inter-font" style="height:40px" onClick="validates('#text_form','addcard')" id="save"><?php if($item_id==''){echo "Add";}else{echo "Update";}?> Question</button>
                                                </div>     	
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-5 	col-md-4 col-sm-4">
                                	<h2 class="text-white text-center">Mobile Preview</h2>
                                    <div class="text-center mobile" style="height: 633px;border: 10px solid #fff;border-radius: 50px;overflow: hidden;">
                                    	<div class="relative" style="width: 100%;background-image:url('bg.png');background-repeat: no-repeat;background-size: cover;background-color: #16012D;height: 100%;">
                                            <div class="mobilwi" id="mobile" style="padding-top: 45px;">
                                              	  <div class="w-100 pull-left text-center"><img style="max-width:200px" src="logo.png"></div>
      											  <div class="m-t-20 divider pull-left card-title m-b-20 text-center"><span></span><span class="bold" style="font-size: 25px;color: white;">TRIVIA</span><span></span></div>
      
                                                <div class="col-xs-12 p-0 relative w-100 height100"  style="border-radius: 0 0px 20px 20px;overflow: hidden;">
                                                    <div class="tab-content w-100 pull-left  scrollbar" style="height:560px; padding-bottom:80px">
                                                        <div role="tabpanel" class="animated fadeIn active pull-left width100 p-t-15" id="media">
                                                            <div id="transmedias" class="carousel slide divabsolute" data-ride="carousel">                                                            
                                                                <div class="carousel-inner height100 scrollbar" role="listbox" style="max-height:370px !important">
                                                                	<div class="item active width100" data-type="video" data-page="125" id="takeimg">
                                                                        <div class="quiz pull-left w-100 font30 text-white p-10 ">
                                                                        	<span id="question">
                                                                        		<div class="textele m-t-0"><?php if($item_id==''){ echo "Type a Question?";}else{echo $rs['question'];}?></div>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <?php
																	for($i=1;$i<=4;$i++)
																	{
																	?>
                                                                  	<div class="w-100 m-t-10 m-b-10 pull-left answer">
                                                                      <div class="p-l-10 p-r-30 relative textele ">
                                                                        <div class="form-check mb-1 mt-2 w-100 float-start">
                                                                          <input class="form-check-input" type="radio" name="flexRadioDefault" id="ans<?php echo $i;?>" <?php if($rs['correct']==$i){echo "checked";}?>>
                                                                          <label class="form-check-label answer w-100 answer<?php echo $i;?>" for="ans<?php echo $i;?>">
                                                                            <div class="border-dark-grey ans_text border b-radius-6 w-100 p-10 text-left <?php if($rs['correct']==$i){echo "border-success-color border-black-2";}?>"><?php if($rs['answer'.$i]==''){echo "Answer ".$i;}else{echo $rs['answer'.$i];}?></div>
                                                                          </label>
                                                                            <i class="zmdi zmdi-check text-success font20 <?php if($item_id==''){echo "hidden";}else{if($rs['correct']!=$i){echo "hidden";}}?> absolute top0 right10 line-height40"></i>
                                                                          
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                    <?php
																	}
																	?>
                                                                </div>
                                                              <div class="col-lg-12 b-radius-6 p-b-10 text-center p-0 m-t-10">
                                                                <div class="col-lg-12 p-10 m-t-0 p-l-20 p-r-20" style="text-align: center;float: left;width: 100%;">
                                                                  <button  class="btn btn-block btn-app-gradient bold inter-font" id="save" style="float: none;height:40px">Submit</button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                             
                                                        </div>
                                                    </div>                                               
                                                    
        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
        </section>
        		
        
        
		<script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
       	<script src="js/bootstrap-select.js"></script>

        <script src="js/chosen.jquery.min.js"></script>
		<script src="js/waves.min.js"></script>
        <script src="js/jquery.mobile.custom.min.js"></script>
        <script src="js/bootstrap-growl.min.js"></script>
		<script src="js/html2canvas.js" type="text/javascript" ></script>
		<script src="js/croppie.js"></script>
		<script src="js/farbtastic.min.js"></script>
        <script src="js/functions.js"></script>
        <script src="js/demo.js"></script>
    </body>
  </html>
<script type="text/javascript">

function setquotealign()
{
	align=$("input[name='quotealign']:checked").val();
	div='#quote';
	$(div).parent().removeClass('text-left text-right text-center');
	$(div).parent().addClass('text-'+align);
}
function changebg(id)
{
	$(id+' .first').click()
}

setquizheight();
function setquizheight()
{
	quotesignatureheight=$('.quotesignature').outerHeight();
	topheader=$('.topheader').outerHeight();
	quoteheight=$('.quoteheight').outerHeight();
	mobileheight=490;
	topbottom=topheader+quoteheight;
	middleheight=mobileheight-topbottom;
	
	quotetext=$('.quiz').outerHeight()-30;
	$('.item .absolute.bg').css('height',quotetext+'px');
	$('.item .absolute.bg').css('top',topbottom+'px');
	$('.color_bgs').css({'background-size':'cover','z-index':'-1'})
}
function show_correct_text(e,name)
{
	if($(e).val()=='')
	{
		texts=$(e).attr('id').split("answer").join(" ");
		$("."+$(e).attr('id')+'>div').html("Answer "+texts)
		$(e).parent().parent().find('.clear_text').addClass('hidden')
		$(e).parent().parent().parent().find('.success_radio').addClass('hidden').find('input[name='+name+']').prop('checked',false)
		$(e).parent().parent().find('.clear_text').css("right","8px")
		$('.success_radio input[type=radio]').each(function()
		{
			if($('.success_radio input[type=radio]:checked:visible').length<=0)
			{
				$('.success_radio input[type=radio]:visible:first').prop('checked',true)
				set_correct()
			}
			if($(this).prop('checked')==true)
			{
				set_correct()
			}
		})
	}
	else
	{
		$('.success_radio input[type=radio]').each(function()
		{
			if($('.success_radio input[type=radio]:checked:visible').length<=0)
			{
				$('.success_radio input[type=radio]:visible:first').prop('checked',true)
				set_correct()
			}
			if($(this).prop('checked')==true)
			{
				set_correct()
			}
		})
		$(e).parent().parent().find('.clear_text').removeClass('hidden')
		$(e).parent().parent().parent().find('.success_radio').removeClass('hidden')
		var str = $(e).val();
		var position = str.search(/[\u0590-\u05FF]/);
		if(position >= 0)
		{
			$(e).parent().parent().find('.clear_text').css("left","8px")
			$(e).css("padding-right","0px")
			$(e).css("padding-left","20px")
		}
		else
		{
			$(e).parent().parent().find('.clear_text').css("left","unset")
			$(e).parent().parent().find('.clear_text').css("right","8px")
			$(e).css("padding-left","0px")
			$(e).css("padding-right","20px")
		}
	}
	hebrew()
	
}
function remove_text(e)
{
	$(e).parent().find('input[type=text]').val('')
}
function set_correct()
{
	$('.answer .ans_text').removeClass('border-success-color border-black-2');
	$('.answer .zmdi-check').addClass('hidden')
  	$('.answer input[type=radio]').attr('checked',false)
  	$('#ans'+$('input[name="correct_ans"]:checked').val()).click();
	$('.answer'+$('input[name="correct_ans"]:checked').val()+' .ans_text').addClass('border border-success-color border-black-2');
	$('.answer'+$('input[name="correct_ans"]:checked').val()).siblings('.zmdi-check').removeClass('hidden')
}
check_category('#transmedia_category','<?php echo $rs['transmedia_section_id']?>')
</script>
