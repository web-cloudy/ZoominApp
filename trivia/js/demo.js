book_id=$('#book_id').val(); 
user_id=$('#user_id').val(); 
baseurl='https://saviour.earth/ZoomIn/trivia/'; 
imageurl=$('#imageurl').val(); 
var select_id=''
if(Math.round(window.devicePixelRatio * 100)>=150)
{
    $('body').css('zoom','80%'); /* Webkit browsers */
  $('body').css('zoom','0.8'); /* Other non-webkit browsers */
  $('body').css('-moz-transform','scale(0.8, 0.8)'); /* Moz-browsers */
}

function notify(message, type){
	$.growl({
		message: message
	},{
		type: type,
		allow_dismiss: false,
		label: 'Cancel',
		className: 'btn-xs btn-inverse',
		placement: {
			from: 'top',
			align: 'center'
		},
		delay: 5000,
		animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeInUp'
		},
		offset: {
			x: 20,
			y: 85
		}
	});
}
$('#review').carousel({
    interval: false,
	wrap: false
});
$(window).load(function(){$(".preloader").delay(400).fadeOut("slow")});
$('.flot-overlay').css('top','100px !important');
$('body').on('click', '.book-menu > a', function(e){
	e.preventDefault();
	$(this).parent().toggleClass('toggled');
	$(this).next().slideToggle(200);
});

if($('.fg-line')[0]) {
        $('body').on('focus', '.form-control', function(){
            $(this).closest('.fg-line').addClass('fg-toggled');
        })

        $('body').on('blur', '.form-control', function(){
            var p = $(this).closest('.form-group');
            var i = p.find('.form-control').val();
            
            if (p.hasClass('fg-float')) {
                if (i.length == 0) {
                    $(this).closest('.fg-line').removeClass('fg-toggled');
                }
            }
            else {
                $(this).closest('.fg-line').removeClass('fg-toggled');
            }
        });
    }
    
    //Add blue border for pre-valued fg-flot text feilds
    if($('.fg-float')[0]) {
        $('.fg-float .form-control').each(function(){
            var i = $(this).val();
            
            if (!i.length == 0) {
                $(this).closest('.fg-line').addClass('fg-toggled');
            }
            
        });
    }
    if($('.tag-select')[0]) {
        $('.tag-select').chosen({
            width: '100%',
            allow_single_deselect: true
        });
    }
    
	if ($('.color-picker')[0]) {
	$('.color-picker').each(function(){
	    $('.color-picker').each(function(){
            var colorOutput = $(this).closest('.cp-container').find('.cp-value');
                $(this).farbtastic(function(colorOutput) {setbg(colorOutput);});
            });
        });
    }
    function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

function setbg(input,color)
{
	$("input[name='backgroundtype']").val(['color']);
	$('.chosebg').removeClass('active');
	$('.chosebgcolor').removeClass('active');
	$(input).addClass('active');
	$('#quotebg').val(color);
	$('.color_bgs').addClass(color).css('background',color);
}
if ($('.setcolor')[0]) {
	$('.setcolor').each(function(){
	    $('.setcolor').each(function(){
            var colorOutput = $(this).closest('.cp-container').find('.changetext');
                $(this).farbtastic(function(colorOutput) {setbg('',colorOutput);});
            });
        });
    }
function setbgimg(input,img,clas,vals)
{
	$("input[name='backgroundtype']").val(['cover_image']);
	$('.chosebg').removeClass('active');
	$('.chosebgcolor').removeClass('active');
	$(input).addClass('active');
	$('#quotebg').val(vals);
	if(clas=='blur')
	{
		$('.color_bgs').addClass('blur');
	}
	else if(clas=='blackblur')
	{
		$('.color_bgs').addClass('blur')
		$('.color_bgs').children('div').addClass('blackblur');
	}
	else if(clas=='black')
	{
		$('.color_bgs').children('div').addClass('blackblur');
		$('.color_bgs').removeClass('blur');
	}
	else
	{
		$('.color_bgs').removeClass('blur blackblur');
	}
	$('.color_bgs').css({'background':'url('+img+')','background-repeat': 'no-repeat','background-position': 'center','background-size': 'contain','z-index':'0'})
}
    
function setuploadbgimg(input,clas,vals)
{
	$("input[name='backgroundtype']").val(['upload_image']);
	$('.chosebg').removeClass('active');
	$('.chosebgcolor').removeClass('active');
	$(input).addClass('active');
	$('#quotebg').val(vals);
	if(clas=='blur')
	{
		$('.color_bgs').addClass('blur');
	}
	else if(clas=='blackblur')
	{
		$('.color_bgs').addClass('blur')
		$('.color_bgs').children('div').addClass('blackblur');
	}
	else if(clas=='black')
	{
		$('.color_bgs').children('div').addClass('blackblur');
		$('.color_bgs').removeClass('blur');
	}
	else
	{
		$('.color_bgs').removeClass('blur blackblur');
	}
	img=$('.uploadimgs img').attr('src')
	$('.color_bgs').css({'background':'url('+img+')','background-repeat': 'no-repeat','background-position': 'center','background-size': 'contain','z-index':'0'})
}
if ($('.collapse')[0]) {
        
        //Add active class for opened items
        $('.collapse').on('show.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });
   
        $('.collapse').on('hide.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').removeClass('active');
        });
        
        //Add active class for pre opened items
        $('.collapse.in').each(function(){
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });
    }
    if ($('[data-toggle="tooltip"]')[0]) {
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    /*
     * Popover
     */
    if ($('[data-toggle="popover"]')[0]) {
        $('[data-toggle="popover"]').popover();
    }
    
function validates(form_id,fun,parameter=false)
{
	var error=0
	var white_space= new RegExp("/^\s+$/");

	$(form_id +' .help-block').remove();
	$(form_id+' input:visible,'+form_id+' textarea:visible,'+form_id+' select:visible').each(function()
	{
		$(this).siblings('.help-block').remove()
		if($(this).attr("data-required")=='yes' && $(this).prop('checked')==false && $(this).attr('type')=='checkbox')
		{
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-required")=='yes' && $(this).val()==null)
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-required-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-required")=='yes' && $(this).val().trim()=='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-required-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-no-space")!== undefined && $(this).val().trim().indexOf(' ')>=0 && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">Space Not Allowed</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-pattern")!== undefined && !$(this).val().trim().match($(this).attr("data-pattern")) && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		} 
		else if($(this).attr("data-greater")!== undefined && parseInt($(this).val().trim())<parseInt($($(this).attr("data-greater")).val().trim()) && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-greater-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-match")!== undefined && $(this).val().trim()!=$('#'+$(this).attr("data-match")).val().trim() && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		} 
		else if($(this).attr('minlength')>$(this).val().length && $(this).val()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger"> Minimum length '+$(this).attr('minlength')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-unique-fun")!== undefined && $(this).val().trim()!='')
		{
			unique_fun=$(this).attr("data-unique-fun");
			request=$(this).attr("data-request");
			form=$(this).attr("data-form");
			var fun_error  = window[unique_fun]($(this),request,form,false);
			if(unique_fun=='checkunique')
			{
				if(fun_error=='ok')
				{
					$('.transmedia_category .error').html('').addClass('hidden')
					$(this).siblings('.help-block').remove()
					$('.transmedia_category .form-group').removeClass('has-error')
				}
				else
				{
					$('.transmedia_category .error').html(fun_error).removeClass('hidden')
					error++;
				}
			}
			else
			{
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
						$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+fun_error+'</li></ul></div>')
						$(this).parent().parent().addClass('has-error')
					}
					error++
				}
				else
				{
					$(this).siblings('.help-block').remove()
					$(this).parent().parent().removeClass('has-error')
				}
			}
		}
		
		else
		{
			$(this).siblings('.help-block').remove()
			$(this).parent().parent().removeClass('has-error')
		}
	})
	if(error>0)
	{
		notify('Something went wrong please check form again','danger');
	}
	if(error==0)
	{
		if(fun!='')
	    {
			if(parameter==false)
			{
				window[fun]()
			}
			else
			{
				window[fun](parameter)
			}
	    }
	}
}

validate_onupdate()
function validate_onupdate()
{
	var error=0;
	$('input[type=checkbox]').click(function()
	{
		$(this).siblings('.help-block').remove()
		if($(this).attr("data-required")=='yes' && $(this).prop('checked')==true)
		{
			$(this).parent().parent().removeClass('has-error')
		}
		
	});
	
	$('input,textarea').keyup(function()
	{
		$(this).siblings('.help-block').remove()
		$(this).parent().parent().removeClass('has-error')
		if($(this).attr("data-required")=='yes' && $(this).prop('checked')==false && $(this).attr('type')=='checkbox')
		{
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-event")=='notonkeyup' && $(this).attr("data-required")=='yes')
		{
			if($(this).val().trim()=='')
			{
				$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-required-message')+'</li></ul></div>')
				$(this).parent().parent().addClass('has-error')
				error++
			}
			if($(this).val().trim()=='')
			{
				$(this).siblings('.help-block').remove()
				$(this).parent().parent().removeClass('has-error')
			}
		}
		else if($(this).attr("data-required")=='yes' && $(this).val().trim()=='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-required-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-pattern")!== undefined && !$(this).val().trim().match($(this).attr("data-pattern")) && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		} 
		else if($(this).attr("data-greater")!== undefined && parseInt($(this).val().trim())<parseInt($($(this).attr("data-greater")).val().trim()) && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-greater-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		}
		else if($(this).attr("data-match")!== undefined && $(this).val().trim()!=$('#'+$(this).attr("data-match")).val().trim() && $(this).val().trim()!='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
			error++
		} 
		else if($(this).attr("data-unique-fun")!== undefined && $(this).val().trim()!='')
		{
			unique_fun=$(this).attr("data-unique-fun");
			request=$(this).attr("data-request");
			form=$(this).attr("data-form");
			var fun_error  = window[unique_fun]($(this),request,form,false);
			if(unique_fun=='checkunique')
			{
				if(fun_error=='ok')
				{
					$('.transmedia_category .error').html('').addClass('hidden')
					$(this).siblings('.help-block').remove()
					$('.transmedia_category .form-group').removeClass('has-error')
				}
				else
				{
					$('.transmedia_category .form-group').addClass('has-error')
					$('.transmedia_category .error').html(fun_error).removeClass('hidden')
				}
			}
			else
			{
				$('.transmedia_category .form-group').removeClass('has-error')
				$('.transmedia_category .error').html('').addClass('hidden')
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
						$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+fun_error+'</li></ul></div>')
						$(this).parent().parent().addClass('has-error')
					}
					error++
				}
				else
				{
					$(this).siblings('.help-block').remove()
					$(this).parent().parent().removeClass('has-error')
				}
			}
		}
		else
		{
			$(this).siblings('.help-block').remove()
			$(this).parent().parent().removeClass('has-error')
		}
	})
	$('select').change(function()
	{
		$(this).siblings('.help-block').remove()
		if($(this).attr("data-required")=='yes' && $(this).val()=='')
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-required-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
		}
		else if($(this).attr("data-pattern")!== undefined && !$(this).val().trim().match($(this).attr("data-pattern")))
		{
			$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+$(this).attr('data-validation-message')+'</li></ul></div>')
			$(this).parent().parent().addClass('has-error')
		} 
		else if($(this).attr("data-unique-fun")!== undefined && $(this).val().trim()!='')
		{
			unique_fun=$(this).attr("data-unique-fun");
			request=$(this).attr("data-request");
			form=$(this).attr("data-form");
			var fun_error  = window[unique_fun]($(this),request,form,false);
			if(unique_fun=='checkunique')
			{
				if(fun_error=='ok')
				{
					$('.transmedia_category .error').html('').addClass('hidden')
					$(this).siblings('.help-block').remove()
					$('.transmedia_category .form-group').removeClass('has-error')
				}
				else
				{
					$('.transmedia_category .form-group').addClass('has-error')
					$('.transmedia_category .error').html(fun_error).removeClass('hidden')
				}
			}
			else
			{
				$('.transmedia_category .form-group').removeClass('has-error')
				$('.transmedia_category .error').html('').addClass('hidden')
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
						$(this).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+fun_error+'</li></ul></div>')
						$(this).parent().parent().addClass('has-error')
					}
					error++
				}
				else
				{
					$(this).siblings('.help-block').remove()
					$(this).parent().parent().removeClass('has-error')
				}
			}
		}
		else
		{
			$(this).siblings('.help-block').remove()
			$(this).parent().parent().removeClass('has-error')
		}
	})
}
function save_companion_type()
{
	var companion_type=$('input[name=companion_type]:checked').map(function(){return $(this).val()}).get()
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'req=1&book_id='+book_id+'&companion_type='+companion_type,
		success: function(html)
		{
			$('#tab-1>span.collapses').addClass('hidden')
			$('#tab-1>div.collapse').addClass('hidden')
			$('input[name=companion_type]:checked').each(function()
			{
				$('#tab-1>span.collapse_'+$(this).val()).removeClass('hidden')
				$('#tab-1 #collapse_'+$(this).val()).removeClass('hidden')
						
			})
		}
	})
}
function savetopublish(item_id)
{
	if($('input[id="check'+item_id+'"]').length>0)
	{
		if($('input[id="check'+item_id+'"]:checked').length>0)
		{
			publish='yes'		
		}
		else
		{
			publish='no'
		}
	}
	else if($('#draftid').length>0)
	{
		item_id=$('#draftid').val()
		if($('#checkdraft').length>0)
		{
			if($('input[id="checkdraft"]:checked').length>0)
			{
				publish='yes'		
			}
			else
			{
				publish='no'
			}
		}
	}
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'item_id='+item_id+'&req=5&publish='+publish+'&book_id='+book_id,
		success: function(html)
		{
			if(publish=='yes')
			{
				notify('Item is published','success')
			}
			else
			{
				notify('Item is draft','danger')
			}
		}
	});
}
function countcharacter(val,count,div)
{
	var len = $(val).val().length;
	 if (len > count) {
		$(val).val($(val).val().substring(0, count))
     } else {
              $(div).text(len+'/'+count);
     }
}
function remove_ans_error()
{
	$i=$j=0;
	$('.answer_textbox').each(function()
	{
		if($(this).val()=='')
		{
			$i++;
		}
	})
	if($i>3)
	{
		$j++;
	}
	if($j<=0)
	{
		$('.error').addClass('hidden').html('Please add atleast one of the answer')
	}
}
function addcard() 
{
	show_in_booxflow=$('input[type=checkbox][name=show_in_booxflow]:checked').map(function(){
		return $(this).val()
	}).get()
	transmedia_subtype=backgroundtype=correct_answer=quotealign=add_signature=transmedia_subtitle_app='';
	if($('input[name="transmedia_subtype"][type=radio]').length>0)
	{
		transmedia_subtype=$('input[name="transmedia_subtype"]:checked').val()
		if(typeof $('input[name="transmedia_subtype"]:checked').attr('data-transmedia_subtitle')!== 'undefined'  && $('input[name="transmedia_subtype"]:checked').attr('data-transmedia_subtitle') !== false)
		{
		transmedia_subtitle_app=$('input[name="transmedia_subtype"]:checked').attr('data-transmedia_subtitle')
		}
	}
	if($('input[type=radio][name=backgroundtype]').length>0)
	{
		backgroundtype=$('input[type=radio][name=backgroundtype]:checked').val()
	}
	if($('input[name=correct_ans][type=radio]').length>0)
	{
		correct_answer=$('input[name=correct_ans][type=radio]:checked').val()
		
	}
	if($('input[name=quotealign][type=radio]').length>0)
	{
		quotealign=$('input[name=quotealign][type=radio]:checked').val()
	}
	if($('input[name=add_signature][type=checkbox]').length>0)
	{
		if($('input[name=add_signature][type=checkbox]:checked').length>0)
		{
			add_signature=$('input[name=add_signature][type=checkbox]:checked').val()
		}
	}
	$i=$j=0;
	if($('input[name=transmedia_type]').val()=='quiz')
	{
		$('.answer_textbox').each(function()
		{
			if($(this).val()=='')
			{
				$i++;
			}
		})
		if($i>3)
		{
			$j++;
		}
	}
	if($j>0)
	{
		if($('input[name=transmedia_type]').val()=='quiz')
		{
			$('.error').removeClass('hidden').html('Please add atleast one of the answer')
		}				
	}
	else
	{
		$('#save').attr('disabled',true)
		$.ajax({ 
			type: "POST",
			async: true,
			cache: false,
			url : baseurl+"new_ajax/c_experience.php",
			data : "transmedia_subtype="+transmedia_subtype+'&'+$('#text_form').find('select, textarea, input').serialize()+'&req=7&backgroundtype='+backgroundtype+'&correct_answer='+correct_answer+'&quotealign='+quotealign+'&add_signature='+add_signature+'&transmedia_subtitle_app='+transmedia_subtitle_app,
			xhr: function () 
			{
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);
						console.log(percentComplete + '%');
						$('#save').html('Please wait... ('+percentComplete + '%)');
					}
				}, false);
				return xhr;
			},		
			success: function(html)
			{
				console.log(html)
				$('#save').attr('disabled',false)
				html=html.split(',,$')
				if(html[0].trim()=='ok')
				{
					window.history.back();
				}
			}
		});
	}
}
function check_category(e,id='')
{
	$('.transmedia_category').addClass('hidden')
	$('.tab-content .'+$(e).val()).removeClass('hidden')
	set_category($(e).val(),'#add_section','')
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'category_type='+$(e).val()+'&req=8&book_id='+book_id+'&id='+id,
		success: function(html)
		{
			$('#transmedia_section_id').html(html).selectpicker('refresh')
		}
	});
	
}
function checkunique(event,req,form,ascy)
{
	var returnval;
	if($(form+' input[name=page_number]:visible').val()<=0)
	{
		return "Page No. can't be 0";
	}
	else
	{
		$.ajax({
			type: "POST",
			async: true,
			url : baseurl+'new_ajax/c_experience.php',
			data : $(form).find('select, textarea, input').serialize()+'&req='+req+"&book_id="+book_id+'&item_id='+$('input[name=item_id]').val(),
			async: ascy,
			success: function(html)
			{
				if(html.trim()=='ok')
				{
					$('.transmedia_category .error').html('').addClass('hidden')
				}
				else
				{
					$('.transmedia_category .form-group').addClass('has-error')
					$('.transmedia_category .error').html(html).removeClass('hidden')
				}
				
				returnval=html.trim();
			},
			error:function(e)
		  {
		   
		  }
		});
		return returnval;
	}
}

function getmetadata(e,div)
{
	linktext=$(div).val();
	var patt1 = /(www.youtube.com)/g;
	var patt2 = /(youtu.be)/g;
	var patt3 = /(youtube.com)/g;
	if($(e).val().match(patt1)!==null || $(e).val().match(patt2)!==null  || $(e).val().match(patt3)!==null )
	{
		$(div+' img').attr('src',imageurl+'loading.gif');
		$('.playicon').addClass('hidden');
		changelink(e,div,'yes');
	}
	else
	{
		$(div+' img').attr('src',imageurl+'loading.gif');
		$('.playicon').addClass('hidden');
		$.ajax({
			url : baseurl+"new_ajax/getmetadata.php",
			cache: false,
			data : "link="+linktext,
			success : function (data) 
			{
				data=data.split(',,$');
				if(data[0]=='' && ($('#spage').val()=='curation' || $('#spage').val()=='micro'))
				{
					img=imageurl+$('input[name="transmedia_subtype"]:checked').val()+'.png';
					$(div+' img').attr('src',img);
				}
				else if(data[0]=='')
				{
					img=imageurl+'defaultimage.png';
					$(div+' img').attr('src',img);
				}
				else
				{
					img=data[0];
					$(div+' img').attr('src',img);
					if($(id).attr('data-type')=='visual')
					{
						$(div+' img').attr('id','imageid')
					}
					else
					{
					//	saveyoutubeimage(book_id,'#myimage');
					}
				}

				$('.title').html(data[1]);
				$('.description').html(data[2]);
				hebrew();
				setheight();
				$('#youtubetemplink').val(book_id)
				if(id=='#insertlink')
				{
					$('#savevisual').html('Save').attr('disabled',false)
				}
			}
		});
	}
}
function changelink(e,div,content)
{
	vals=$(e).val().trim();
	if(vals=='')
	{
		$('.error').addClass('hidden');
		$(div).addClass('hidden');
	}
	else
	{
		$(div).removeClass('hidden');
		youtubelink=vals.split('/');
		if(youtubelink[0]=='http:' || youtubelink[0]=='https:' )
		{
			yl=youtubelink[3].match(/=/g);
			
			if(yl!=null)
			{
				yl=youtubelink[3].split('=');
				
				yl1=yl[1].match(/&/g);
				
				if(yl1!='null')
				{	
					yl1=yl[1].split('&');
					youtlink=yl1[0];
				}
				else
				{
					youtlink=yl[1];
				}
					
			}
			else
			{
				youtlink=youtubelink[3];
			}
			$.ajax(
			{
				type: "GET",
				crossDomain : true,
				url:"https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+youtlink+"&fields=items/snippet/title,items/snippet/description,items/snippet/thumbnails/default/url&key=AIzaSyCSVX2dujP9JkbFPXEe3b37NktkoF-J_1U",
				success:function(html)
				{
					title=html.items[0].snippet.title;
					disc=html.items[0].snippet.description;
					img="http://img.youtube.com/vi/"+youtlink+"/hqdefault.jpg";
					if(content=='yes')
					{
						$('.title').html(title);
						$('.description').html(disc);
					}
					$(div+' img').attr('src',img);
					divheight=$(div).height();
					imageheight=$(div+' img').height();
					setimg=(divheight-imageheight)/2;
					seticon=(imageheight-50)/2;
					$('.playicon').css({'height':imageheight+'px'});
					$('.playicon i').css({'margin-top':seticon+'px'});
					if($(e).attr('data-type')=='visual')
					{
						$('#preview img').attr('scr',img);
					}
					else
					{
					//	saveyoutubeimage(book_id,'#myimage');
					}
					$('#youtubetemplink').val(book_id);
					setheight();
					if(id=='#transmediatext')
					{
						if($(id).val()!='')
						{
							$('#tranyes div').html('yes');
						}
						else
						{
							$('#tranyes div').html('no');
						}
					}
					if(id=='#insertlink')
					{
						$('#savevisual').html('Save').attr('disabled',false)
					}

				}
			});
		}
		else
		{
//			$(id).closest(".valid").find('.error').removeClass('hidden').html('Invalid Link ');
		}
	}
}
function saveyoutubeimage(book_id,names)
{
	name=$(names).attr('src');
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+'new_ajax/cardscreator.php',
		data : 'req=33&link='+name+"&book_id="+book_id+'&cat='+names,
		success: function(html)
		{
			
		    if(html.trim()=='resend')
		    {
		        saveyoutubeimage(book_id,names);
		    }
		    else
		    {
				if(names=='#preview img')
				{
					setTimeout(function()
					{
						$('#preview img').attr('src',html);
						return true
					},3000);
				}
				else
				{
			    	$('#myimage').attr('src',html);
					return true
				}
		    }
		}
	});
}
function deleteyoutubeimage()
{
	image=$('#youtubetemplink').val();
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+'new_ajax/cardscreator.php',
		data : 'req=30&image='+image,
		success: function(html)
		{
		}
	});
}

function convertToBase64() 
{
	var selectedFile = document.getElementById("pdf").files;
	filename=document.getElementById("pdf").value.split("fakepath");
	filename=filename[1].replace(/\\/g,'')
	if (selectedFile.length > 0) {
		var fileToLoad = selectedFile[0];
		var fileReader = new FileReader();
		var base64;
		fileReader.onload = function(fileLoadedEvent) {
			base64 = fileLoadedEvent.target.result;
			console.log(base64);
			$('#pdftext').val(base64)
			$('#changepdf').val('yes')
			$('.pdf_edit_button').removeClass('hidden')
			$('#pdflabel').addClass('w-100 border p-5 b-radius-3 socialbg font14 font-normal').removeClass('btn btn-primary btn-block bold p-l-5 p-r-5 waves-effect p-10').html('<i class="zmdi zmdi-file-text font22 pull-left"></i> <span class="pull-left" style="line-height:22px">'+filename+'</span>')
		};
		fileReader.readAsDataURL(selectedFile[0]);
	}
}

function convertToBase64_new(e,type) 
{
	var selectedFile = document.getElementById(type).files;
	filename=document.getElementById(type).value.split("fakepath");
	filename=filename[1].replace(/\\/g,'')
	if (selectedFile.length > 0) {
		var fileToLoad = selectedFile[0];
		var fileReader = new FileReader();
		var base64;
		fileReader.onload = function(fileLoadedEvent) {
			base64 = fileLoadedEvent.target.result;
			$('#'+type+'text').val(base64)
			$('#changepdf').val('yes')
			$('.'+type+'_edit_button').removeClass('hidden')
			//$('#'+type+'label').html('<i class="zmdi zmdi-file-text font22 pull-left"></i> <span class="pull-left text-ellipsis text-left" style="line-height:22px;width:90%">'+filename+'</span>')
			var form_data = new FormData();
			$('.showtitle').removeClass('hidden');
			form_data.append('image', base64);
			form_data.append('name', type);
			form_data.append('book_id', book_id);
			form_data.append('req', 42);
			$('.ebook_file').attr('style','');
			$('.ebook_file_error').addClass('hidden')
			$.ajax({
				url: baseurl + 'new_ajax/book.php',
				dataType: 'text', // what to expect back from the PHP script, if anything
				contentType: false,
				processData: false,
				data: form_data,
				type: 'post',
				cache: false,
				success: function(html) {
					html=html.split(',,$')
					link=html[2].replace(baseurl,'');
					link=link.replace('uploads/','');
					$('#'+type+'label').html('<i class="zmdi zmdi-file-text font22 pull-left"></i> <span class="pull-left text-ellipsis text-left" style="line-height:22px;width:90%">'+link+'</span>')
					$('.showtitle').addClass('hidden');						
				}
			});			
		};
		fileReader.readAsDataURL(selectedFile[0]);
	}
}

function delete_pdf_new(type)
{
	$('#'+type+'text,#'+type).val('')
	$('#'+type+'deleted').val('yes');
	$('.'+type+'_edit_button').addClass('hidden')
	$('#'+type+'check').click()
	$('#'+type+'label').html('<img src="'+baseurl+'img/usefull/greyuploadicon.png" style="height:20px"> <span class="text-ellipsis" style="line-height:22px;width:90%">Upload '+type.toUpperCase()+'</span>')
	var form_data = new FormData();
	form_data.append('image', '');
	form_data.append('name', type);
	form_data.append('book_id', book_id);
	form_data.append('req', 42);
	$.ajax({
		url: baseurl + 'new_ajax/book.php',
		dataType: 'text', // what to expect back from the PHP script, if anything
		contentType: false,
		processData: false,
		data: form_data,
		type: 'post',
		cache: false,
		success: function(html) {
			console.log(html)
			$('.showtitle').addClass('hidden');						
		}
	});			
}


function deletetool(id)
{
	$('#deletereader input[type=hidden].id').val(id)
}
function yesdeletetool()
{
	id=$('#deletereader input[type=hidden].id').val()
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+'new_ajax/c_experience.php',
		data : "item_id="+id+'&req=9',
		success: function(html)
		{
			if(html.trim()=='ok')
			{
				window.history.back();
			}
		}
	});
}
function deletegroup(id)
{
	$('#deletereader input[type=hidden].id').val(id)
}
function yesdeletegroup()
{
	id=$('#deletereader input[type=hidden].id').val()
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+'new_ajax/addpost.php',
		data : "id="+id+'&req=2',
		success: function(html)
		{
			if(html.trim()=='ok')
			{
				window.history.back();
			}
		}
	});
}

function setquote()
{
	quotesignatureheight=$('.quotesignature').outerHeight();
	topheader=$('.topheader').outerHeight();
	quoteheight=$('.quoteheight').outerHeight();
	buttonheight=45;
	tabbottom=35;
	mobileheight=490;
	topbottom=topheader+buttonheight+tabbottom+quotesignatureheight+quoteheight;
	middleheight=mobileheight-topbottom;
	
	quotetext=$('#quote div').height();
	settop=(middleheight-quotetext)/2;
	$('#quote div').css('margin-top',settop-30+'px');

}
function changequote(id,div)
{
	val=$(id).val();
	$(id).on('blur',function()
	{
		if(val!='')
		{
			$(id).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
	//		$(div).addClass('hidden');
		}
	});
	
	var patt1 = /(.autho)/g;
	
	var position = val.search(/[\u0590-\u05FF]/);
	if(position >= 0)
	{
		$(id).addClass('rtl');
	  $(div +' div').addClass('rtl');
	}
	else
	{
		$(id).removeClass('rtl');
		$(div +' div').removeClass('rtl');
	}
	vals='<i class="zmdi zmdi-quote"></i> '+val+' <i class="zmdi zmdi-quote"></i>';
	$(div+' div').html(vals);
	setquote();
}




function changeselect(id,div)
{
	var patt1 = /(.author)/g;
	if(div.match(patt1))
	{
		val='';
		$('.auth').each(function()
		{
			val+=' '+ $(this).val();
		});
		$(div).html(val);
		
	}
	else
	{
		val=$(id).val();
		html=$(div+' div').html();
		$(div+' div').html(val);
	}
	
}

function copyToClipboard(element)
 {
//   var $temp = $("<input>");
//   $("body").append($temp);
//   $temp.val($(element).text()).select();
//   alert($temp.val())
//   if(document.execCommand("copy"))
//   {
// 	alert("copied")
//   }
//   //$temp.remove();
navigator.clipboard.writeText($(element).text())
  notify('Copied', 'success')
}
function changetransmediastatus(e,field,input='select')
{
	if(input=='checkbox')
	{

		if($('input[type=checkbox][name='+field+']:checked').length<=0)
		{
			type='private';
			color="danger";
		}
		else
		{
			type='publish';
			color="success";
		}
	}
	else if(input=='radio')
	{
		if($(e).val()=='private')
		{
			type='private';
			color="danger";
		}
		else
		{
			type='publish';
			color="success";
		}
	}
	else
	{
		if($(e).val()=='private')
		{
			color="danger";
		}
		else
		{
			color="success";
		}
		type=$(e).val()
	}
	$.ajax(
	{
		type: "POST",
		async: true,
		url : baseurl+'new_ajax/book.php',
		data:"type="+type+"&book_id="+book_id+"&req=21&field="+field,
		success: function(result)
		{
			if(result!='Expired')
			{
				if(field=='transmediastatus')
				{
					notify('Plan is '+type,color)
					$('#group_status').val(type).selectpicker('refresh')
					if(type=='private')
					{
						//$('input[type=radio][name=access]').attr('disabled',false);
						$('.access_code_text').addClass('hidden');
						$('input[type=radio][name=access][value=private]').prop('checked',true);
					}
					else
					{
						$('input[type=radio][name=access][value=publish]').attr('checked',true)
						//$('input[type=radio][name=access]').attr('disabled',true);
						$('.access_code_text').removeClass('hidden');
						$('#access_code').removeClass('in')
					}
					changetransmediastatus('input[name=access]:checked','access_status','radio')
					
				}
				else if(field=='access_status')
				{
					notify('Access code is '+type,color)
					get_campanion('welcome')
					get_campanion('active')
					get_campanion('after')

				}
				else
				{
					notify('Group is '+type,color)
				}
				if(result=='Not Active')
				{
					window.location.href=baseurl+"subscriptions.php";
				}
			}
			else
			{
				window.location.href=baseurl+"subscriptions.php";
			}
		}
	});
}
function enter(e,id)
{
	 var self = $(':focus')
	focusable = $(id).find('input,a,select,button,textarea').filter(':visible');
	var str=0;
	if (event.keyCode==13) {
      if ($.inArray(self, focusable) && (!self.is('a')) && (!self.is('button'))){
		$(id+' button[type="submit"]').click()
      }
	  focusable.eq(focusable.index(self) + (e.shiftKey ? -1 : 1)).focus();

      return false;
	}
}
function check_email_exist(event,req,form,ascy)
{
	var returnval;
	$.ajax({
		type: "POST",
		url : baseurl+'new_ajax/signup.php',
		data : $(form).find('select, textarea, input').serialize()+'&req='+req,
	 	async: ascy,
		success: function(html)
		{
			 if(html.trim()=='ok')
			{
				$(event).parent().parent().removeClass('has-error')
			}
			else
			{
				$(event).siblings('.help-block').remove()
				$(event).parent().parent().addClass('has-error')
				$(event).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">'+html+'</li></ul></div>')
			}
			returnval=html;
			//get_language()
			
		},
        error:function(e)
      {
          nointer();
      }
	});
	return returnval;
}
function save_store(field)
{
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/book.php",
		data : 'req=40&book_id='+book_id+'&field='+field,
		success: function(html)
		{
			field=field.replace('_pop','');
			$('#'+field).attr('onclick','');
		}
	})
}
function showmodal(id)
{
	$(id).modal('show')
}


function getChildren(elem) {
  	var parent = [];
  	$(elem).children('ul').children('li').each(function() 
  	{
		if($(this).data('id')) 
		{
		  	parent.push($(this).data('id'));
		}
		if($(this).children('ul').children('li').length) {
		  	parent.push(getChildren(this));
		}
  	});
	datas='';
	$i=1;
  	$(elem).children('ul').children('li').each(function() 
  	{
		if($(this).data('category')=='section')
		{
			category=$(this).data('category');
			id=$(this).data('id');
			if(datas=='')
			{
				datas='//'+category+'//'+id+'//'+$i+'//';
			}
			else
			{
				datas+=','+'//'+category+'//'+id+'//'+$i+'//';
			}
			$j=1;
			$(this).children('ul').children('li').each(function() 
			{
				if(datas=='')
				{
					datas=id+'//'+$(this).data('category')+'//'+$(this).data('item')+'//'+$j+'//'+$i;
				}
				else
				{
					datas+=','+id+'//'+$(this).data('category')+'//'+$(this).data('item')+'//'+$j+'//'+$i;
				}
				$j++;
			});
		}
		else
		{
			if(datas=='')
			{
				datas='////'+$(this).data('item')+'//'+$i+'//';
			}
			else
			{
				datas+=','+'////'+$(this).data('item')+'//'+$i+'//';
			}
		}
		$i++;
		
  	});
	console.log(datas)
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'req=13&data='+datas+'&book_id='+book_id,
		success: function(html)
		{
//			console.log(datas)
			console.log(html)
		}
	})
  	return parent;
}

$('.modal').each(function()
{
	$(this).css('visibility',"hidden");
	$(this).css('display',"block");
})
setTimeout(function(){
	$('.modal').modal('hide')
	$('.modal').each(function()
	{
		$(this).removeAttr('style');
	})
},200);
$(document).on("click","#emoji-picker",function(e){
	e.stopPropagation();
	 $('.intercom-composer-emoji-popover').toggleClass("active");
 });
 
 $(document).click(function (e) {
	 if ($(e.target).attr('class') != '.intercom-composer-emoji-popover' && $(e.target).parents(".intercom-composer-emoji-popover").length == 0) {
		 $(".intercom-composer-emoji-popover").removeClass("active");
	 }
 });
 
 $(document).on("click",".intercom-emoji-picker-emoji",function(e){
	 $(".test-emoji").append($(this).html());
 });
 
 $('.intercom-composer-popover-input').on('input', function() {
	 var query = this.value;
	 if(query != ""){
	   $(".intercom-emoji-picker-emoji:not([title*='"+query+"'])").hide();
	 }
	 else{
	   $(".intercom-emoji-picker-emoji").show();
	 }
 });
 function clickcollaps(name)
{
	if($('input[name='+name+']:checked').attr('type')=='checkbox')
	{
			$('input[name='+name+']:checked').parent().siblings('.collapses').trigger('click')
	}
	else
	{
		href=$('input[name='+name+']:checked').parent().siblings('.collapses').attr('href')
		if($(href).hasClass('in'))
		{
		}
		else
		{
			$('input[name='+name+']:checked').parent().siblings('.collapses').trigger('click')
		}
		$('input[name='+name+']:checked').parent().parent().siblings('.collapse').removeClass('in')
	}
}
function show_hide_div(show,hide)
{
	$(hide).addClass('hidden')
	$(show).removeClass('hidden')
}
function search_function(input,target,parents) 
{
	$(target).removeClass('hidden')
 	var input = document.getElementById(input);
  	var filter = input.value.toLowerCase();
  	if(filter.length>0)
  	{
		$(target).each(function()
		{
			if($(this).text().toLowerCase().indexOf(filter) != -1)
			{
				$(this).removeClass('not-matching');
			}
			else
			{
				$(this).addClass('not-matching');
			}
			setTimeout(function(){
				if($(parents).hasClass('.not-matching'))
				{
					$(parents).addClass('hidden')
				}
			},200)
		})
  	}
  	if(filter.length<=0)
  	{
	  	hello(target,parents)
  	}
}
function set_hidden_value(id,value)
{
	$(id).val(value)
}
function setloader(links)
{
	window.open(links, '_blank')
}
function open_popup(id)
{
	$(id).click()
}
function open_modal(id)
{
	$(id).modal('show')
}
function set_delete_id(id,val,section)
{
	$(id).val(val)
}


function add_default_section(book_id,child='')
{
	book_sub_type=$('#book_sub_type input[name=book_sub_type]:checked').val()
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'req=24&book_id='+book_id+'&child='+child+'&book_sub_type='+book_sub_type,
		success: function(html)
		{
            console.log(html);
			$('input[name=companion_type][value=welcome]').prop('checked',true)
			$('input[name=companion_type][value=after]').prop('checked',true)
			save_companion_type()
			get_campanion('welcome')
            get_campanion('active')
            get_campanion('after')
			get_group_posts()
			hebrew()
		}
	})
}

$(window).scroll(function(){
	if($('.mobile').length>0)
	{
		if ($(window).scrollTop() >= 100) {
		$('.mobile').addClass('fixed').css({'top':'70px','width': '313px'});
		}
		else {
		$('.mobile').removeClass('fixed');
		}
	}
});
if($('.mobile').length>0)
{
	if ($(window).scrollTop() >= 100) {
	$('.mobile').addClass('fixed').css({'top':'70px','width': '313px'});
	}
	else {
	$('.mobile').removeClass('fixed');
	}
}
function add_section()
{
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'req=2&book_id='+book_id+'&'+$("#add_section").find('select, textarea, input').serialize(),
		success: function(html)
		{
			html=html.split(',,$');
			if(html[0].trim()=="ok")
			{
				notify("Section Added Successfully","success")
				$('#add_section').modal('hide')
				$("#add_section input[type=text]").val('');
				if($("#add_section input[name=page]").val()=='companion')
				{
				get_campanion($('#add_section input[name=category]').val())
				}
				else
				{
					get_section(html[1],$("#add_section input[name=page]").val());
				}
				$('#add_section .error').html(html).addClass('hidden')
			}
			else
			{
				$('#add_section .error').html(html).removeClass('hidden')
			}
            hebrew()
		}
	})
}
function get_section(id,page)
{
	category=$('#transmedia_category').val()
	$.ajax({
		type: "POST",
		async: true,
		cache: false,
		url : baseurl+"new_ajax/c_experience.php",
		data : 'req=26&book_id='+book_id+'&category='+category+'&id='+id,
		success: function(html)
		{
			$('#transmedia_section_id').html(html).selectpicker('refresh');
			// if(page=='template')
			// {
			// 	validates('#text_form','addcard')
			// }			
		}
	})
}
function set_category(category,id,val)
{
	$(id+' input[name=id]').val(val)
	$(id+' input[name=category]').val(category)
	if(category=='active')
	{
		$(id+' .page_range').removeClass('hidden')
	}
	else
	{
		$(id+' .page_range').addClass('hidden')
	}
}
function show_section()
{
    if($('#transmedia_category').val()!='active')
    {
        if($('#transmedia_section_id').val()=='')
        {
            $('#add_section').modal('show')
        }
        else
        {
            validates('#text_form','addcard')
        }
    }
    else{
        validates('#text_form','addcard')
    }
}
window.mobileAndTabletCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
return check;
};
if(mobileAndTabletCheck()==true)
{
	$('body').prepend('<section class="fixed_screen"><section class="content"><div class="container"><div class="col-lg-6" style="margin-top:150px"><div class="col-lg-3"></div><div class="col-lg-7"><img src="'+baseurl+'img/usefull/log.png" class="w-100"></div></div><div class="col-lg-5 m-t-20 m-b-50"><h3 class="text-center blue m-b-20"><img src="'+baseurl+'img/usefull/mplogo.png" style="width:65%"><br></h3></div><span style="width:100%;text-align:center;font-size:20px;float: left;font-weight: bold;">Please login using your Laptop / Desktops</span></div></section></section>')
}


function refresh_select(id)
{
	$(id).val('').selectpicker('refresh');
}
function check_subsection(id)
{
	id=$(id).val()
	if(id=='')
	{
		$('#add_section').modal('show')
	}
}
function change_subject(e,explore_id,id,other='')
{
	gener_id=$(e).val()
	if(gener_id!='')
	{
		$(id).parent().parent().parent().removeClass('hidden')
		// if($(e).find('option:selected').attr('data-next')=='yes')
		// {
		// 	$(id).parent().parent().parent().removeClass('hidden')
		// }
		// else
		// {
		// 	$(id).parent().parent().parent().addClass('hidden')
		// }
		$.ajax({
			type: "POST",
			async: true,
			url : baseurl+"new_ajax/book.php",
			data : 'req=31&gener_id='+gener_id+'&explore_id='+explore_id+'&book_id='+book_id+'&id='+id,
			success: function(html)
			{
				console.log(html)
				if(id!='')
				{
					$(id).html(html)
					if(id=='#subject')
					{
						$('#tags').html('')
						$('#tags').selectpicker('refresh')				
					}
					$(id).selectpicker('refresh')
				}
			}
		})
	}
	else
	{
	    $(id).parent().parent().parent().addClass('hidden')
	}
	
}
function set_main_category_id(id,value)
{
	$(id).val(value)
}
function add_other_option(e,explore_id,val,tag,mainid,changeid='')
{
	$('#other_tag .other_filter_id').val(val)
	$('#other_tag .other_tag').val(tag)
	$('#other_tag .mainid').val(mainid)
	$('#other_tag .changeid').val(changeid)
	$('#other_tag .explore_id').val(explore_id)	
	if($(e).val()=='other_option')
	{
		$('#other_tag').modal('show')
	}
	else
	{
		search_catergory(explore_id,val,tag,mainid,changeid)
	}
}
function save_new_tag()
{
	other_filter_id=$('#other_tag .other_filter_id').val()
	tag=$('#other_tag .other_tag').val()
	mainid=$('#other_tag .mainid').val()
	changeid=$('#other_tag .changeid').val()
	explore_id=$('#other_tag .explore_id').val()
	
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/book.php",
		data : 'other_filter_id='+other_filter_id+'&req=54&book_id='+book_id+'&'+$('#other_tag').find('select, textarea, input').serialize(),
		success: function(html)
		{
			$('#other_tag').modal('hide')
			$('#other_tag input[type=text]').val('')
			notify('<span class="text-center font14 pull-left bold">Thank you!<br>Your Suggestion was sent to review by our Data Base Team</span>','success');
			if(changeid=='')
			{
				$('#subject').html('<option value="">None</option><option value="other_option">Other</option>')
				$('#tags').html('<option value="">None</option><option value="other_option">Other</option>')
				$('#subject').selectpicker('refresh')
				$('#tags').selectpicker('refresh')
				$('#subject').attr('onChange',"change_subject(this,'"+html.trim()+"','#tags'),add_other_option('#subject','"+explore_id+"','"+html.trim()+"','sub_genre','"+mainid+"','#subject')")
			}
			else if(changeid=='#subject')
			{
				$('#subject').html('<option value="">None</option><option selected value="other_option">Other</option>')
				$('#tags').html('<option value="">None</option><option value="other_option">Other</option>')
				$('#subject').selectpicker('refresh')
				$('#tags').selectpicker('refresh')				
				$('#tags').attr('onChange',"add_other_option('#tags','"+explore_id+"','"+html.trim()+"','tab_genre','#subject','#tags')")
			}
			else
			{
				$('#tags').html('<option value="">None</option><option selected value="other_option">Other</option>')
				$('#tags').selectpicker('refresh')				
			}
		}
	})	
}
function search_catergory(explore_id,val,tag,mainid,changeid='')
{
	filter_id=$("#tab-1 input[name='filter_id'],#tab-1 select[name='filter_id']").map(function(){return $(this).val();}).get();
	imaginary_location=''
	if($('input[name=imaginary_location]').length>0)
	{
		imaginary_location=$('input[name=imaginary_location]').val()
	}
	$.ajax({
		type: "POST",
			async: true,
		url : baseurl+"new_ajax/book.php",
		data : 'filter_id='+filter_id+'&req=36&book_id='+book_id+'&explore_id='+explore_id+'&imaginary_location='+imaginary_location,
		success: function(html)
		{
			html=html.split(',,$');
			if(changeid=='')
			{
				mainid_val=$(mainid).val()
				$('#subject').attr('onChange',"change_subject(this,'"+mainid_val+"','#tags'),add_other_option('#subject','"+explore_id+"','"+mainid_val+"','sub_genre','"+mainid+"','#subject')")
			}
			else if(changeid=='#subject')
			{
				mainid_val=$(changeid).val()
				$('#tags').attr('onChange',"add_other_option('#tags','"+explore_id+"','"+mainid_val+"','tab_genre','#subject','#tags')")
			}
			else
			{
				mainid_val=$(changeid).val()
				$('#tags').attr('onChange',"add_other_option('#tags','"+explore_id+"','"+mainid_val+"','tab_genre','#subject','#tags')")
			}
			// if(html[0].trim()=='ok')
			// {
			// 	$('#content_rating').click()
			// }
		}
	})
	
}
function disable_option(e,id)
{
	val=$(e).val();
	val=$(e).find('option:selected').text();
	if(val!='')
	{
		$(id+' option').prop('disabled',false);
		$(id+' option[data-value="'+val+'"]').prop('disabled',true);
		$(id).selectpicker('refresh');
	}
}
