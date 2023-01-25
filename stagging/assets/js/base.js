baseurl='https://saviour.earth/ZoomIn/stagging/api/index.php/'
//baseurl='http://localhost/myproject/score/api/index.php/'
api_url='https://44.210.148.199/api/'

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
$(document).ready(function () {
    setTimeout(() => {
        $("#loader").fadeToggle(250);
    }, 800); // hide delay when page load
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Go Back
$(".goBack").click(function () {
    window.history.back();
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Input
$(".clear-input").click(function () {
    $(this).parent(".input-wrapper").find(".form-control").focus();
    $(this).parent(".input-wrapper").find(".form-control").val("");
    $(this).parent(".input-wrapper").removeClass("not-empty");
});
// active
$(".form-group .form-control").focus(function () {
    $(this).parent(".input-wrapper").addClass("active");
}).blur(function () {
    $(this).parent(".input-wrapper").removeClass("active");
})
// empty check
$(".form-group .form-control").keyup(function () {
    var inputCheck = $(this).val().length;
    if (inputCheck > 0) {
        $(this).parent(".input-wrapper").addClass("not-empty");
    }
    else {
        $(this).parent(".input-wrapper").removeClass("not-empty");
    }
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Searchbox Toggle
$(".toggle-searchbox").click(function () {
    $("#search").fadeToggle(200);
    $("#search .form-control").focus();
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// Owl Carousel
// $('.carousel-full').owlCarousel({
//     loop:true,
//     margin:8,
//     nav:false,
//     items: 1,
//     dots: false,
// });
// $('.carousel-single').owlCarousel({
//     stagePadding: 30,
//     loop:true,
//     margin:16,
//     nav:false,
//     items: 1,
//     dots: false,
// });
// $('.carousel-multiple').owlCarousel({
//     stagePadding: 32,
//     loop:true,
//     margin:16,
//     nav:false,
//     items: 2,
//     dots: false,
// });
// $('.carousel-small').owlCarousel({
//     stagePadding: 32,
//     loop:true,
//     margin:8,
//     nav:false,
//     items: 4,
//     dots: false,
// });
// $('.carousel-slider').owlCarousel({
//     loop:true,
//     margin:8,
//     nav:false,
//     items: 1,
//     dots: true,
// });
///////////////////////////////////////////////////////////////////////////
function check_session()
{
    let searchParams = new URLSearchParams(window.location.search)
    event_id = searchParams.get('event_id')
	
    var user_email = localStorage.getItem("user_email");
    if (typeof user_email == 'undefined' || user_email == null) {
        window.location.href = 'login.html?event_id='+event_id
    }

}
function get_userid()
{
    return localStorage.getItem("user_id");    
}
function logout()
{
    localStorage.removeItem("user_email");   
    window.location.href = 'login.html'
}
function validate(form_id,fun, parameter = false) 
{
    var error=0
    $(form_id +' .input-danger').remove()
    $(form_id+' input:visible,'+form_id+' textarea:visible,'+form_id+' select:visible').each(function()
    {
        $(this).parent().parent().find('.input-danger').remove()
        if($(this).attr("data-required")=='yes' && $(this).val()==null)
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-required-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        
        }
        else if($(this).attr("data-required")=='yes' && $(this).val()=='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-required-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr("data-pattern")!== undefined && !$(this).val().trim().match($(this).attr("data-pattern")) && $(this).val().trim()!='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr("data-match")!== undefined && $(this).val().trim()!=$('#'+$(this).attr("data-match")).val().trim() && $(this).val().trim()!='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr('minlength')>$(this).val().length && $(this).val()!='')
        {
            $(this).parent().parent().append('<div class="input-danger"> Minimum length '+$(this).attr('minlength')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr("data-unique-fun")!== undefined && $(this).val().trim()!='')
        {
            unique_fun=$(this).attr("data-unique-fun");
            request=$(this).attr("data-request");
            form=$(this).attr("data-form");
            $(this).parent().parent().parent().find('.error').html('')
            if(unique_fun!='get_balance')
            {
                if(unique_fun=='get_balance')
                {
                    var fun_error  = window[unique_fun](form);
                }
                else
                {
                    var fun_error  = window[unique_fun]($(this),request,form,false);
                }

                if(typeof fun_error!='undefined' && fun_error!='ok')
                {
                    if($(this).attr("data-show-toast")!== undefined)
                    {
                        $(this).parent().parent().parent().find('.error').html('')
                        $(this).parent().parent().parent().find('.error').html(fun_error)
                    }
                    else
                    {
                        $(this).parent().parent().parent().find('.error').html('')
                        $(this).parent().parent().append('<div class="input-danger">'+fun_error+'</div>')
                        $(this).parent().parent().addClass('text-danger')
                    }
                    error++
                }
                else
                {
                    $(this).siblings('.help-block').remove()
                    $(this).parent().parent().removeClass('text-danger')
                }
            }
        }

        else
        {
            $(this).siblings('.help-block').remove()
            $(this).parent().parent().removeClass('text-danger')
        }
    })
    if (error == 0) {
        if (fun != '') {
            if (parameter == false) {
                window[fun]()
            } else {
                window[fun](parameter)
            }
        }
    }
}

validate_onupdate()
function validate_onupdate()
{
    var error=0;
    $('input,textarea').keyup(function()
    {
        $(this).parent().parent().find('.input-danger').remove()
        $(this).parent().parent().removeClass('text-danger')
        if($(this).attr("data-required")=='yes' && $(this).val().trim()=='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-required-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr("data-pattern")!== undefined && !$(this).val().trim().match($(this).attr("data-pattern")) && $(this).val().trim()!='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr("data-match")!== undefined && $(this).val().trim()!=$('#'+$(this).attr("data-match")).val().trim() && $(this).val().trim()!='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
            error++
        }
        else if($(this).attr("data-unique-fun")!== undefined && $(this).val().trim()!='')
        {
            unique_fun=$(this).attr("data-unique-fun");
            request=$(this).attr("data-request");
            form=$(this).attr("data-form");
            if(unique_fun=='get_balance')
            {
                var fun_error  = window[unique_fun](form);
            }
            else
            {
                var fun_error  = window[unique_fun]($(this),request,form,true);
            }
            $(this).parent().parent().parent().find('.error').html('')
            if(typeof fun_error!='undefined' && fun_error!='ok')
            {
                if($(this).attr("data-show-toast")!== undefined)
                {
                    $(this).parent().parent().parent().find('.error').html('')
                    $(this).parent().parent().parent().find('.error').html(fun_error)
                }
                else
                {
                    $(this).parent().parent().parent().find('.error').html('')
                    $(this).parent().parent().append('<div class="input-danger">'+fun_error+'</div>')
                    $(this).parent().parent().addClass('text-danger')
                }
                error++
            }
            else
            {
                $(this).siblings('.help-block').remove()
                $(this).parent().parent().removeClass('text-danger')
            }
        }
        else
        {
            $(this).siblings('.help-block').remove()
            $(this).parent().parent().removeClass('text-danger')
        }
    })
    $('select').change(function()
    {
        $(this).siblings('.help-block').remove()
        if($(this).attr("data-required")=='yes' && $(this).val()=='')
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-required-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
        }
        else if($(this).attr("data-pattern")!== undefined && !$(this).val().trim().match($(this).attr("data-pattern")))
        {
            $(this).parent().parent().append('<div class="input-danger">'+$(this).attr('data-validation-message')+'</div>')
            $(this).parent().parent().addClass('text-danger')
        }
        else
        {
            $(this).siblings('.help-block').remove()
            $(this).parent().parent().removeClass('text-danger')
        }
    })
}
function detectandroid() { 
    if( navigator.userAgent.match(/Android/i)){
        return true;
        }
    else {
        return false;
    }
}
if(detectandroid()==true)
{
    $('.apple').addClass('hidden')
}
function detectios() { 
    if(navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i)|| navigator.userAgent.match(/iPod/i)){
        return true;
    }
    else {
        return false;
    }
}
function check_email_exist(event, req, form) {

    id = $(form+' .user_id').val()
    var returnval;
    $.ajax({
        type: "POST",
        url: baseurl + 'User/checkEmail',
        data: $(form).find('select, textarea, input').serialize()+ '&user_id=' + id,
        async: false,
        success: function(html) 
        {
            obj=JSON.parse(html)
            if (obj[0]['success'] == true) {
                $(event).parent().parent().removeClass('has-error')
            } else {
                $(this).parent().parent().parent().find('.error').html('')
                $(this).parent().parent().append('<div class="input-danger">' + obj[0]['message'] + '</div>')
                $(this).parent().parent().addClass('text-danger')
            }
            returnval = obj[0]['message'];
        }
    });
    return returnval;
}
function check_username_exist(event, req, form) {

    id = $(form+' .user_id').val()
    var returnval;
    $.ajax({
        type: "POST",
        url: baseurl + 'User/checkUsername',
        data: $(form).find('select, textarea, input').serialize()+ '&user_id=' + id,
        async: false,
        success: function(html) 
        {
            console.log(html)
            obj=JSON.parse(html)
            if (obj[0]['success'] == true) {
                $(event).parent().parent().removeClass('has-error')
            } else {
                $(this).parent().parent().parent().find('.error').html('')
                $(this).parent().parent().append('<div class="input-danger">' + obj[0]['message'] + '</div>')
                $(this).parent().parent().addClass('text-danger')
            }
            returnval = obj[0]['message'];
        }
    });
    return returnval;
}
function show_btn_loader(id)
{
    $(id+" .easy .spinner-border").removeClass('d-none')
    $(id+" .easy .text").addClass('d-none')
}
function hide_btn_loader(id)
{
    $(id+" .easy .spinner-border").addClass('d-none')
    $(id+" .easy .text").removeClass('d-none')
}

function login() 
{
    let searchParams = new URLSearchParams(window.location.search)
    event_id = searchParams.get('event_id')
	
    show_btn_loader('#login')
    $.ajax({
        type: "POST",
        url: baseurl + 'User/login',
        data: decodeURIComponent($("#login").find('select, textarea, input').serialize()),
        async:true,
        success: function(html) 
        {
            hide_btn_loader('#login')
            obj=JSON.parse(html);
            if(obj[0]['success']==false)
            {
                if(obj[0]['message']=='set_user')
                {
                    window.location.href="register.html?user_id="+obj[0]['user_id']+"&event_id="+event_id;
                }
                else
                {
                    show_toast(obj[0]['message'], "danger", '', "top", "danger");    
                }
            }
            else
            {
                localStorage.setItem("user_id", obj[0]['user_id']);
                localStorage.setItem("user_email", obj[0]['email']);
                get_event_details(event_id)
                //window.location.replace("dashboard.html?event_id="+event_id);
            }
        },

    });
}

function register() 
{
    let searchParams = new URLSearchParams(window.location.search)
    event_id = searchParams.get('event_id')
	show_btn_loader('#register')
    $.ajax({
        type: "POST",
        url: baseurl + 'User/addUser',
        data: decodeURIComponent($("#register").find('select, textarea, input').serialize()),
        async:true,
        success: function(html) 
        {
            hide_btn_loader('#register')
            obj=JSON.parse(html);
          	if(obj[0]['success']==true)
            {
                if($("#register input[name=user_id]").val()=='')
                {
                    show_toast("Registered successfully", "success", '', "top", "success");
                    setTimeout(function(){window.location.replace("login.html?event_id="+event_id)},500);
                }
                else
                {
                    show_toast("Details Updated successfully", "success", '', "top", "success");
                    setTimeout(function(){
                        localStorage.setItem("user_id", $("#register input[name=user_id]").val());
                        localStorage.setItem("user_email", $("#register input[name=email]").val());
                        get_event_details(event_id)
                        //window.location.replace("dashboard.html?event_id="+event_id);
                    },500)
                
                }
            }
            else 
            {
                show_toast(html, "danger", '', "top", "danger");
            }
        },

    });
}
function get_user_details(user_id,id) 
{
    let searchParams = new URLSearchParams(window.location.search)
    event_id = searchParams.get('event_id')
	
    $.ajax({
        type: "GET",
        url: baseurl + 'User/get_user_data',
        data: 'id='+user_id,
        async:true,
        success: function(html) 
        {
            obj = JSON.parse(html);            
            for($i=0;$i<Object.keys(obj[0]).length;$i++)
            {
                if(obj[0][Object.keys(obj[0])[$i]]=='0000-00-00')
                {
                    $(id+' input[name='+Object.keys(obj[0])[$i]+']').val('');
                }
              	else if(obj[0][Object.keys(obj[0])[$i]]=='00-00-0000')
                {
                    $(id+' input[name='+Object.keys(obj[0])[$i]+']').val('');
                }
                
                else
                {
                    if($(id+' input[name=e'+Object.keys(obj[0])[$i]+']').attr('type')=='radio')
                    {
                        $(id+' input[name='+Object.keys(obj[0])[$i]+'][value='+obj[0][Object.keys(obj[0])[$i]]+']').prop('checked',true);
                    }
                    else
                    {
                        $(id+' input[name='+Object.keys(obj[0])[$i]+']').val(obj[0][Object.keys(obj[0])[$i]])            
                    }
                }
            }
        },

    });
}

function getuserdetail(email,name,image,fcm)
{	
    signupsocial(email,name,image,fcm)
}

function signupsocial(email,name,image,fcm='')
{
	let searchParams = new URLSearchParams(window.location.search)
    event_id = searchParams.get('event_id')
  	if(image!='')
    {
		image=image.replace(/&/g, 'amps')
    }
    data="email="+email+"&fullname="+name+"&logourl="+image+"&gcm="+fcm;
  
    $.ajax({
		type: "POST",
		url: baseurl+'User/addSocialUser',
		data:data,
		async:true,
        success: function (html)
		{
          	console.log(html)
          	obj=JSON.parse(html);
            if(obj[0]['success']==true)
            {
                if(obj[0]['message']=='User registered successfully')
                {
                  	if(filename=='login.html')
                    {
                        window.location.href="register.html?user_id="+obj[0]['user_id']+"&event_id="+event_id;
                    }
                    else
                    {
                        get_user_details(obj[0]['user_id'],'#register')
                    }                    
                }
              	else
                {
                  	show_toast("Details Updated successfully", "success", '', "top", "success");
                    setTimeout(function(){
                        localStorage.setItem("user_id", obj[0]['user_id']);
                        localStorage.setItem("user_email", obj[0]['email']);
                        get_event_details(event_id)
                        //window.location.replace("dashboard.html?event_id="+event_id);
                    },500)
                
                }
            }
          	else 
            {
              if(obj[0]['message']=='set_user')
              {
                	if(filename=='login.html')
                    {
                        window.location.href="register.html?user_id="+obj[0]['user_id']+"&event_id="+event_id;
                    }
                    else
                    {
                        get_user_details(obj[0]['user_id'],'#register')
                    }
              }
            }

		},
		error: function(jqXHR, text, error)
		{
			
		}
	});
}
function show_toast(message, type, not_type, pos = 'top', bg = 'inverse') {

    var random = Math.floor(Math.random() * 10);
    if (type == 'danger') {
        $text_type = 'name="close-circle-outline" class="text-danger"'
    } else {
        $text_type = 'name="checkmark-circle" class="text-success"';
    }
    if (not_type == 'big') {
        $('body').append('<div id="toast' + random + '" class="toast-box text-center toast-' + pos + ' show"><div class="in"><ion-icon ' + $text_type + '></ion-icon><div class="text">' + message + '</div></div></div>')
    } else {
        $('body').append('<div id="toast' + random + '" class="toast-box bg-' + bg + ' text-center toast-' + pos + ' show"><div class="in w-100 p-0"><div class="text">' + message + '</div></div></div>')
    }
    setTimeout(() => {
        $('#toast' + random).removeClass('show');
        $('#toast' + random).remove();
    }, 3000);
    setTimeout(() => {
        $('#toast' + random).remove();
    }, 3500);
}
function addEventPlayer() 
{
    let searchParams = new URLSearchParams(window.location.search)
    event_id = searchParams.get('event_id')
	var returnval;
    
    $.ajax({
        type: "POST",
        url: baseurl + 'Player/addEventPlayer',
        data: 'user_id='+get_userid()+"&event_id="+event_id,
        async:false,
        success: function(html) 
        {
            console.log(html)
            obj= JSON.parse(html)
            if(obj.success==false)
            {
                show_toast(obj.message, "danger", '', "top", "danger");    
            }
            else
            {
                localStorage.setItem("duration",obj.duration)              
                localStorage.setItem("end_time",obj.end_time)
            }
            returnval= obj.success;
        }
    });

    return returnval;
    
}


function get_event_details(event_id)
{
    var returnval;
    $.ajax({
        type: "POST",
        url: baseurl+'Game/get_event',
        data: 'event_id=' +event_id+"&return=no",
        async: false,
        success: function(html) 
        {
          	console.log(html)
            //obj= JSON.stringify(html)
          	obj=JSON.parse(html)
            if(obj[0]['GameName']=='basketball')
            {
                window.location.replace("dashboard.html?event_id="+event_id);
            }
            else
            {
                window.location.replace("trivia/?trivia_id="+obj[0]['TriviaId']);
            }
        }
    });

    return returnval;
}