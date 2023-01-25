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

		<link href="css/bootstrap-datetimepicker.min.css" rel="stylesheet">
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
                              	<input type="hidden" name="trivia_id" value="<?php echo $trivia_id?>">
                                <input type="hidden" name="transmedia_type" value="quiz">
                                <input type="hidden" name="transmedia_subtype" value="quiz">
                                <input type="hidden" name="background" id="backgroundimg">
                                <input type="hidden" id="pdfdeleted" name="pdfdeleted">
                                <input type="hidden" value="" name="changepdf" id="changepdf"/>
                                <input type="hidden" value="" name="set_image" id="set_image"/>
                              	<div class="col-lg-12 p-0">
                                    <div class="col-lg-7 col-md-8 col-sm-8 p-0">
                                        <div class="col-lg-9 pull-left p-0">
                                          <div class="w-100 pull-left text-center m-t-20 m-b-20"><img style="max-width:250px" src="logo.png"></div>
                                          <div class="w-100 pull-left text-center">
                                            <div class="m-t-20 divider col-lg-8 card-title m-b-20 text-center" style="float:none;margin:auto"><span></span><span class="bold" style="font-size: 25px;color: white;">TRIVIA</span><span></span></div>
                                          </div>
                                        </div>
                                  	</div>	
                              	</div>
                                <div class="col-lg-12 p-0">
                                  <div class="col-lg-7 col-md-8 col-sm-8 p-0">
                                      <div>
                                          <div class="tab-content">
                                            	<div class="col-lg-12">
                                                  	<div class="col-lg-9" style="border: 2px solid #fff;border-radius: 10px;padding-top: 10px;padding-bottom: 10px;">                                                      
                                                      <div class="col-lg-12 p-0 darkgrey valid">
                                                          <div class="form-group fg-float pull-left col-lg-12 p-0 m-t-30 m-b-0">
                                                              <div class="m-b-0 bold col-sm-12 p-0">
                                                                  <label class="bold pull-left" style="line-height:20px;color: #04B4DD;">
                                                                      Add Name of Trivia 
                                                                  </label>
                                                              </div>
                                                              <div class="fg-line">
                                                                  <input type="text" name="name" placeholder="Insert Name" class="input-sm darkgreyboder  form-control fg-input p-l-5" data-required='yes' data-validation-required-message="This field is required" value="<?php echo $rs['name']?>">
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div class="col-lg-12 p-0 darkgrey valid">
                                                          <div class="form-group fg-float pull-left col-lg-12 p-0 m-t-30 m-b-0">
                                                              <div class="m-b-0 bold col-sm-12 p-0">
                                                                  <label class="bold pull-left" style="line-height:20px;color: #04B4DD;">
                                                                      No of Questions 
                                                                  </label>
                                                              </div>
                                                              <div class="fg-line">
                                                                  <input type="text" name="no_of_question" placeholder="Enter Number of Questions" class="input-sm darkgreyboder  form-control fg-input p-l-5" data-required='yes' data-validation-required-message="This field is required" value="<?php echo $rs['no_of_question']?>" data-pattern="^(\d)+$" data-validation-message="Only Numbers">
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div class="col-lg-12 p-0 darkgrey valid">
                                                          <div class="form-group fg-float pull-left col-lg-12 p-0 m-t-30 m-b-0">
                                                              <div class="m-b-0 bold col-sm-12 p-0">
                                                                  <label class="bold pull-left" style="line-height:20px;color: #04B4DD;">
                                                                      Publishing Date 
                                                                  </label>
                                                              </div>
                                                              <div class="fg-line">
                                                                  <input type="text" name="date" placeholder="Select Date" class="input-sm darkgreyboder datepicker  form-control fg-input p-l-5" data-required='yes' data-validation-required-message="This field is required" value="<?php echo $rs['no_of_question']?>">
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div class="error pull-left text-left w-100 text-danger bold m-t-10"></div>
										
                                                      <div class="col-lg-12 b-radius-6 p-b-10 p-0 m-t-10">
                                                          <div class="col-lg-12 p-0 m-t-20" style="text-align: center;">
                                                              <button class="btn btn-app-gradient bold inter-font waves-effect" style="height:40px;min-width: 200px;" onclick="validates('#text_form','add_trivia')" id="save">Next</button>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="col-lg-5 col-md-4 col-sm-4 p-t-20">
										<div class="col-lg-12 m-t-20 m-b-20"></div>
                                      	<div class="col-lg-12">                                              
                                          <span class="col-lg-12 font20">Instructions</span>
                                          <span class="col-lg-12 m-t-10 font16"><span style="color:#15d7fe">Step 1 : </span>Lorem Ipsum is simply dummy text</span>
                                          <span class="col-lg-12 m-t-10 font16"><span style="color:#15d7fe">Step 2 : </span>Lorem Ipsum is simply dummy text</span>
                                          <span class="col-lg-12 m-t-10 font16"><span style="color:#15d7fe">Step 3 : </span>Lorem Ipsum is simply dummy text</span>
                                          <span class="col-lg-12 m-t-10 font16"><span style="color:#15d7fe">Step 4 : </span>Lorem Ipsum is simply dummy text</span>
                                          <span class="col-lg-12 m-t-10 font16"><span style="color:#15d7fe">Step 5 : </span>Lorem Ipsum is simply dummy text</span>
                                          
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
		
		<script src="js/moment.min.js"></script>

		<script src="js/bootstrap-datetimepicker.min.js"></script>
      	<script src="js/farbtastic.min.js"></script>
        <script src="js/functions.js"></script>
        <script src="js/demo.js"></script>
    </body>
  </html>
<script type="text/javascript">
if ($('.datepicker')[0]) {
  $('.datepicker').datetimepicker({
    format: 'DD/MM/YYYY'
  }) .on('dp.change', function(e){
        $(this).blur()
        $(this).siblings('.help-block').remove();
        $(this).parent().parent().removeClass('has-error');
    });
}
function add_trivia()
{
  $.ajax(
    {
        type: "POST",
        url: baseurl+'new_ajax/c_experience.php',
        async: true,
        data:decodeURIComponent($("#text_form").find('select, textarea, input').serialize())+'&req=8',
        beforeSend: function() {
        },
        success: function (result) {
          	result=result.split(',,$')
            if(result[0].trim()=='ok')
            {
              window.location.href='question_list.php?trivia_id='+result[1]
            }
        }
    });
}
</script>
