book_id=$('#book_id').val(); 
user_id=$('#user_id').val(); 
baseurl=$('#baseurl').val(); 
imageurl=$('#imageurl').val(); 

(function(){
    var layoutStatus = localStorage.getItem('ma-layout-status');
    if (layoutStatus == 1) {
        $('body').addClass('sw-toggled');
        $('#tw-switch').prop('checked', true);
    }
   
    $('body').on('change', '#toggle-width input:checkbox', function(){
        if ($(this).is(':checked')) {
            setTimeout(function(){
                $('body').addClass('toggled sw-toggled');
                localStorage.setItem('ma-layout-status', 1);
            }, 250);
        }
        else {
            setTimeout(function(){
                $('body').removeClass('toggled sw-toggled');
                localStorage.setItem('ma-layout-status', 0);
                $('.main-menu > li').removeClass('animated');
            }, 250);
        }
    });
})();

    
/*
 * Detact Mobile Browser
 */
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   $('html').addClass('ismobile');
}
    
$(document).ready(function(){
    /*
     * Top Search
     */
	 
	 
    (function(){
        $('body').on('click', '#top-search > a', function(e){
            e.preventDefault();
            
            $('#header').addClass('search-toggled');
            $('#top-search-wrap input').focus();
        });
        
        $('body').on('click', '#top-search-close', function(e){
            e.preventDefault();
            
            $('#header').removeClass('search-toggled');
        });
    })();
    
    (function(){
        //Toggle
        $('body').on('click', '#menu-trigger, #chat-trigger', function(e){            
            e.preventDefault();
            var x = $(this).data('trigger');
        
            $(x).toggleClass('toggled');
            $(this).toggleClass('open');
            $('body').toggleClass('modal-open');
	    
    	    //Close opened sub-menus
    	    $('.sub-menu.toggled').not('.active').each(function(){
        		$(this).removeClass('toggled');
        		$(this).find('ul').hide();
    	    });
            
            

	    $('.book-menu .main-menu').hide();
            
            if (x == '#sidebar') {
                
                $elem = '#sidebar';
                $elem2 = '#menu-trigger';
                
                $('#chat-trigger').removeClass('open');
                
                if (!$('#chat').hasClass('toggled')) {
                    $('#header').toggleClass('sidebar-toggled');
                }
                else {
                    $('#chat').removeClass('toggled');
                }
            }
            
            if (x == '#chat') {
                $elem = '#chat';
                $elem2 = '#chat-trigger';
                
                $('#menu-trigger').removeClass('open');
                
                if (!$('#sidebar').hasClass('toggled')) {
                    $('#header').toggleClass('sidebar-toggled');
                }
                else {
                    $('#sidebar').removeClass('toggled');
                }
            }
            
            //When clicking outside
            if ($('#header').hasClass('sidebar-toggled')) {
                $(document).on('click', function (e) {
                    if (($(e.target).closest($elem).length === 0) && ($(e.target).closest($elem2).length === 0)) {
                        setTimeout(function(){
                            $('body').removeClass('modal-open');
                            $($elem).removeClass('toggled');
                            $('#header').removeClass('sidebar-toggled');
                            $($elem2).removeClass('open');
                        });
                    }
                });
            }
        })
        
        //Submenu
        $('body').on('click', '.sub-menu > a', function(e){
            e.preventDefault();
            $(this).next().slideToggle(200);
            $(this).parent().toggleClass('toggled');
        });
    })();
    
	/*
     * Clear Notification
     */
    $('body').on('click', '[data-clear="notification"]', function(e){
      e.preventDefault();
      var count=$('#ordercount').val();
      var x = $(this).closest('.listview');
      var y = x.find('.lv-item');
      var z = y.size();
      $(this).parent().fadeOut();
      
      x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
      x.find('.grid-loading').fadeIn(1500);
      
          
      var w = 0;
      y.each(function(){
          var z = $(this);
          setTimeout(function(){
          z.addClass('animated fadeOutRightBig').delay(1000).queue(function(){
              z.remove();
			  count = count-1;
			  $('#ordercounthtml').html(count);
			  $('#ordercount').val(count);
          });
          }, w+=150);
      })
	
	//Popup empty message
	setTimeout(function(){
	    $('#notifications').addClass('empty');
	}, (z*150)+200);
    });
    
    /*
     * Dropdown Menu
     */
    if($('.dropdown')[0]) {
	//Propagate
	$('body').on('click', '.dropdown.open .dropdown-menu', function(e){
	    e.stopPropagation();
	});
	
	$('.dropdown').on('shown.bs.dropdown', function (e) {
	    if($(this).attr('data-animation')) {
		$animArray = [];
		$animation = $(this).data('animation');
		$animArray = $animation.split(',');
		$animationIn = 'animated '+$animArray[0];
		$animationOut = 'animated '+ $animArray[1];
		$animationDuration = ''
		if(!$animArray[2]) {
		    $animationDuration = 500; //if duration is not defined, default is set to 500ms
		}
		else {
		    $animationDuration = $animArray[2];
		}
		
		$(this).find('.dropdown-menu').removeClass($animationOut)
		$(this).find('.dropdown-menu').addClass($animationIn);
	    }
	});
	
	$('.dropdown').on('hide.bs.dropdown', function (e) {
	    if($(this).attr('data-animation')) {
    		e.preventDefault();
    		$this = $(this);
    		$dropdownMenu = $this.find('.dropdown-menu');
    	
    		$dropdownMenu.addClass($animationOut);
    		setTimeout(function(){
    		    $this.removeClass('open')
    		    
    		}, $animationDuration);
    	    }
    	});
    }
    
    /*
     * Calendar Widget
     */
    if($('#calendar-widget')[0]) {
        (function(){
            $('#calendar-widget').fullCalendar({
		        contentHeight: 'auto',
		        theme: true,
                header: {
                    right: '',
                    center: 'prev, title, next',
                    left: ''
                },
                defaultDate: '2014-06-12',
                editable: true,
                events: [
                    {
                        title: 'All Day',
                        start: '2014-06-01',
                        className: 'bgm-cyan'
                    },
                    {
                        title: 'Long Event',
                        start: '2014-06-07',
                        end: '2014-06-10',
                        className: 'bgm-orange'
                    },
                    {
                        id: 999,
                        title: 'Repeat',
                        start: '2014-06-09',
                        className: 'bgm-lightgreen'
                    },
                    {
                        id: 999,
                        title: 'Repeat',
                        start: '2014-06-16',
                        className: 'bgm-lightblue'
                    },
                    {
                        title: 'Meet',
                        start: '2014-06-12',
                        end: '2014-06-12',
                        className: 'bgm-green'
                    },
                    {
                        title: 'Lunch',
                        start: '2014-06-12',
                        className: 'bgm-cyan'
                    },
                    {
                        title: 'Birthday',
                        start: '2014-06-13',
                        className: 'bgm-amber'
                    },
                    {
                        title: 'Google',
                        url: 'http://google.com/',
                        start: '2014-06-28',
                        className: 'bgm-amber'
                    }
                ]
            });
        })();
    }
    
    /*
     * Weather Widget
     */
    if ($('#weather-widget')[0]) {
        $.simpleWeather({
            location: 'Austin, TX',
            woeid: '',
            unit: 'f',
            success: function(weather) {
                html = '<div class="weather-status">'+weather.temp+'&deg;'+weather.units.temp+'</div>';
                html += '<ul class="weather-info"><li>'+weather.city+', '+weather.region+'</li>';
                html += '<li class="currently">'+weather.currently+'</li></ul>';
                html += '<div class="weather-icon wi-'+weather.code+'"></div>';
                html += '<div class="dash-widget-footer"><div class="weather-list tomorrow">';
                html += '<span class="weather-list-icon wi-'+weather.forecast[2].code+'"></span><span>'+weather.forecast[1].high+'/'+weather.forecast[1].low+'</span><span>'+weather.forecast[1].text+'</span>';
                html += '</div>';
                html += '<div class="weather-list after-tomorrow">';
                html += '<span class="weather-list-icon wi-'+weather.forecast[2].code+'"></span><span>'+weather.forecast[2].high+'/'+weather.forecast[2].low+'</span><span>'+weather.forecast[2].text+'</span>';
                html += '</div></div>';
                $("#weather-widget").html(html);
            },
            error: function(error) {
                $("#weather-widget").html('<p>'+error+'</p>');
            }
        });
    }
    
    /*
     * Todo Add new item
     */
    
    /*
     * Auto Hight Textarea
     */
    
    /*
    * Profile Menu
    */
    
    /*
     * Text Feild
     */
    
    //Add blue animated border and remove with condition when focus and blur
    
    /*
     * Audio and Video
     */
    if($('audio, video')[0]) {
        $('video,audio').mediaelementplayer();
    }
    
    /*
     * Tag Select
     */
    
    /*
     * Input Slider
     */ 
    //Basic
    if($('.input-slider')[0]) {
        $('.input-slider').each(function(){
            var isStart = $(this).data('is-start');
            
            $(this).noUiSlider({
                start: isStart,
                range: {
                    'min': 0,
                    'max': 100,
                }
            });
        });
    }
	
    //Range slider
    if($('.input-slider-range')[0]) {
	$('.input-slider-range').noUiSlider({
	    start: [30, 60],
	    range: {
		    'min': 0,
		    'max': 100
	    },
	    connect: true,
		auto: true
	});
    }
    
    //Range slider with value
    if($('.input-slider-values')[0]) {
	$('.input-slider-values').noUiSlider({
	    start: [ 45, 80 ],
	    connect: true,
	    direction: 'rtl',
	    behaviour: 'tap-drag',
	    range: {
		    'min': 0,
		    'max': 100
	    }
	});

	$('.input-slider-values').Link('lower').to($('#value-lower'));
        $('.input-slider-values').Link('upper').to($('#value-upper'), 'html');
    }
    
    /*
     * Input Mask
     */
    if ($('input-mask')[0]) {
        $('.input-mask').mask();
    }
    
    /*
     * Color Picker
     */
    
    /*
     * HTML Editor
     */
    if ($('.html-editor')[0]) {
	   $('.html-editor').summernote({
            height: 150
        });
    }
    
    if($('.html-editor-click')[0]) {
	//Edit
	$('body').on('click', '.hec-button', function(){
	    $('.html-editor-click').summernote({
            focus: true
	    });
	    $('.hec-save').show();
	})
	
	//Save
	$('body').on('click', '.hec-save', function(){
	    $('.html-editor-click').code();
            $('.html-editor-click').destroy();
            $('.hec-save').hide();
            notify('Content Saved Successfully!', 'success');
        });
    }
    
    //Air Mode
    if($('.html-editor-airmod')[0]) {
        $('.html-editor-airmod').summernote({
            airMode: true
        });
    }
    
    /*
     * Date Time Picker
     */
    
    //Date Time Picker
    if ($('.date-time-picker')[0]) {
	   $('.date-time-picker').datetimepicker();
    }
    
    //Time
    if ($('.time-picker')[0]) {
    	$('.time-picker').datetimepicker({
    	    format: 'HH:mm'
    	});
    }
    
    //Date
    if ($('.date-picker')[0]) {
    	$('.date-picker').datetimepicker({
    	    format: 'YYYY/MM/DD'
    	});
    }

    /*
     * Form Wizard
     */
    
    if ($('.form-wizard-basic')[0]) {
    	$('.form-wizard-basic').bootstrapWizard({
    	    tabClass: 'fw-nav',
            'nextSelector': '.next', 
            'previousSelector': '.previous'
    	});
    }
    
    /*
     * Bootstrap Growl - Notifications popups
     */ 
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
                align: 'right'
            },
            delay: 5000,
            animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
            },
            offset: {
                x: 20,
                y: 85
            }
        });
    };

    /*
     * Waves Animation
     */
    (function(){
         Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
         Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
        Waves.init();
    })();
    
    /*
     * Lightbox
     */
    /*if ($('.lightbox')[0]) {
        $('.lightbox').lightGallery({
            enableTouch: true
        }); 
    }*/
   if ($('#showimage')[0]) {
        $('#showimage').lightGallery({
            enableTouch: true
        }); 
    }
    /*
     * Link prevent
     */
    $('body').on('click', '.a-prevent', function(e){
        e.preventDefault();
    });
    
    /*
     * Collaspe Fix
     */
    
    /*
     * Tooltips
     */
    
    /*
     * Message
     */

    //Actions
    if ($('.on-select')[0]) {
        var checkboxes = '.lv-avatar-content input:checkbox';
        var actions = $('.on-select').closest('.lv-actions');
    
        $('body').on('click', checkboxes, function() {
            if ($(checkboxes+':checked')[0]) {
                actions.addClass('toggled');
            }
            else {
                actions.removeClass('toggled');
            }
        });
    }

    if($('#ms-menu-trigger')[0]) {
        $('body').on('click', '#ms-menu-trigger', function(e){            
            e.preventDefault();
            $(this).toggleClass('open');
            $('.ms-menu').toggleClass('toggled');
        });
    }
    
    /*
     * Login
     */
    if ($('.login-content')[0]) {
        //Add class to HTML. This is used to center align the logn box
        $('html').addClass('login-content');
        
        $('body').on('click', '.login-navigation > li', function(){
            var z = $(this).data('block');
            var t = $(this).closest('.lc-block');
            
            t.removeClass('toggled');
            
            setTimeout(function(){
                $(z).addClass('toggled');
            });
            
        })
    }
    
    /*
     * Fullscreen Browsing
     */
    if ($('[data-action="fullscreen"]')[0]) {
	var fs = $("[data-action='fullscreen']");
	fs.on('click', function(e) {
	    e.preventDefault();
	    	    
	    //Launch
	    function launchIntoFullscreen(element) {
		
		if(element.requestFullscreen) {
		    element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
		    element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
		    element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
		    element.msRequestFullscreen();
		}
	    }
	    
	    //Exit
	    function exitFullscreen() {
		
		if(document.exitFullscreen) {
		    document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
		    document.webkitExitFullscreen();
		}
	    }
	    
	    launchIntoFullscreen(document.documentElement);
	    fs.closest('.dropdown').removeClass('open');
	});
    }
    
    /*
     * Clear Local Storage
     */
    if ($('[data-action="clear-localstorage"]')[0]) {
        var cls = $('[data-action="clear-localstorage"]');
        
        cls.on('click', function(e) {
            e.preventDefault();
            
            swal({   
                title: "Are you sure?",   
                text: "All your saved localStorage values will be removed",   
                type: "warning",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Yes, delete it!",   
                closeOnConfirm: false 
            }, function(){
                localStorage.clear();
                swal("Done!", "localStorage is cleared", "success"); 
            });
        });
    }
    
    /*
     * Profile Edit Toggle
     */
    if ($('[data-pmb-action]')[0]) {
        $('body').on('click', '[data-pmb-action]', function(e){
            e.preventDefault();
            var d = $(this).data('pmb-action');
            
            if (d === "edit") {
                $(this).closest('.pmb-block').toggleClass('toggled');
            }
            
            if (d === "reset") {
                $(this).closest('.pmb-block').removeClass('toggled');
            }
            
            
        });
    }
    
    /*
     * IE 9 Placeholder
     */
    
    
    
    /*
     * Listview Search
     */ 
    if ($('.lvh-search-trigger')[0]) {
         
        
        $('body').on('click', '.lvh-search-trigger', function(e){
            e.preventDefault();
            x = $(this).closest('.lv-header-alt').find('.lvh-search');
            
            x.fadeIn(300);
            x.find('.lvhs-input').focus();
        });
        
        //Close Search
        $('body').on('click', '.lvh-search-close', function(){
            x.fadeOut(300);
            setTimeout(function(){
                x.find('.lvhs-input').val('');
            }, 350);
        })
    }
    
    
    /*
     * Print
     */
    if ($('[data-action="print"]')[0]) {
        $('body').on('click', '[data-action="print"]', function(e){
            e.preventDefault();
            
            window.print();
        })
    }
    
    /*
     * Typeahead Auto Complete
     */
     if($('.typeahead')[0]) {
          
          var statesArray = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
            'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
            'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
            'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
          ];
        var states = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: statesArray
        });  
        
        $('.typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
          name: 'states',
          source: states
        });
    }
     
     
    /*
     * Wall
     */
     
});
window.URL    = window.URL || window.webkitURL;
useBlob   = false && window.URL; // set to `true` to use Blob instead of Data-URL

function readURL(input,cls,error) 
{
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    var image  = new Image();
    
    image.addEventListener("load", function () 
	{
		if(image.width=='415' && image.height=='560')
		{
			$(cls).attr('src',this.src);
			$(error).addClass('hide').html("");
			var form_data = new FormData(); 
			variable=$(input).attr('name');
			req=$(input).attr('data-req');
			var file_data = $(input).prop('files')[0];
			form_data.append('file', file_data);
			form_data.append('name', variable);  
			form_data.append('book_id', book_id);   
			form_data.append('req', req);  

			$.ajax({
				url : baseurl+'new_ajax/book.php',
				dataType: 'text',  // what to expect back from the PHP script, if anything
				contentType: false,
				processData: false,
				data: form_data,                         
				type: 'post',
				success: function(html)
				{
					$(error).addClass('hide').removeClass('green-text').addClass('text-danger').html("");
				}
			});
		}
		else
		{
			$(error).removeClass('hide').removeClass('green-text').addClass('text-danger').html("File dimension should be 415 * 560");
			//$('#sub').attr('disabled',true);
		}

      // Show image and info
      
      if (useBlob) {
        // Free some memory
        window.URL.revokeObjectURL(image.src);
      }
    });
    image.src = useBlob ? window.URL.createObjectURL(input) : reader.result;
  });

  reader.readAsDataURL(input.files[0]);  

}
function compress(source_img_obj, quality, maxWidth, output_format){
    var mime_type = "image/jpeg";
    if(typeof output_format !== "undefined" && output_format=="png"){
        mime_type = "image/png";
    }

    maxWidth = maxWidth || 1000;
    var natW = source_img_obj.naturalWidth;
    var natH = source_img_obj.naturalHeight;
    var ratio = natH / natW;
    if (natW > maxWidth) {
        natW = maxWidth;
        natH = ratio * maxWidth;
    }

    var cvs = document.createElement('canvas');
    cvs.width = natW;
    cvs.height = natH;

    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, natW, natH);
    var newImageData = cvs.toDataURL(mime_type, quality/100);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
    return result_image_obj;
}
function readURL1(input) 
{
	imgsize=parseInt(input.files[0].size / 1024);
	if(parseInt(imgsize/1024)<=5)
	{

		var reader = new FileReader();
	
		reader.addEventListener("load", function () {
		var image  = new Image();
		
		image.addEventListener("load", function () 
		{
			
			var form_data = new FormData();
			form_data.append('book_id', $('#book_id').val());
			form_data.append('image', this.src);
			form_data.append('req', '15'); 
			form_data.append('visual_image', 'image'); 
			
			$.ajax({
				type: "POST",
				dataType: 'text',  // what to expect back from the PHP script, if anything
				cache: false,
				contentType: false,
				processData: false,
				url : baseurl+"new_ajax/book.php",
				data : form_data,
				xhr: function () {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);
							console.log(percentComplete + '%');
							$('#uploadvisualimages').html('Please wait... ('+percentComplete + '%)');
						}
					}, false);
					return xhr;
				},
				success: function(html)
				{
					if(html.trim()==0)
					{
						readURL1(input)
					}
					else
					{
						html=html.split(',,$')
						$( "#visuals" ).val(html[0] )
						$('#visualcount').val(html[1])
						setvisual()
						$('#uploadvisualimages').html('<span class="col-lg-2 p-0 line-height30"><img src="'+baseurl+'img/usefull/upload-button1.png"></span><span class="col-lg-10 p-0 p-l-5 text-center" style="line-height:1">Upload <br>Image</span>').attr('disabled',false);
					}
				}
			});
			if (useBlob) {
				window.URL.revokeObjectURL(image.src);
			}
		});
		image.src = useBlob ? window.URL.createObjectURL(input) : reader.result;
	  });

	  reader.readAsDataURL(input.files[0]);  
		$('.visualerror').html("Image size should be less than 5 MB").addClass('hidden');
	}
	else
	{
		$('.visualerror').html("Image size should be less than 5 MB").removeClass('hidden');
	}
}

readmore();
function readmore() 
{
	var showChar = 150;
	var ellipsestext = "...";
	var moretext = "<i class='zmdi zmdi-plus'></i> More";
	var lesstext = "<i class='zmdi zmdi-minus'></i> Less";
	$('.more').each(function() {
		var content = $(this).html();

		if(content.length > showChar) {

			var c = content.substr(0, showChar);
			var h = content.substr(showChar-1, content.length - showChar);

			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

			$(this).html(html);
		}

	});

	$(".morelink").click(function(){
		if($(this).hasClass("less")) {
			$(this).removeClass("less");
			$(this).html(moretext);
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
		$(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});
}
function scrolto(div,inner) 
{
	// var elem = document.getElementById(div);
	// var topPos = elem.offsetTop
  	// scrollTo(document.getElementById(inner), topPos-100, 600);   
}
    
function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
function changetext(id,div)
{
	val=$(id).val();
	$(id).on('blur',function()
	{
		if(val!='')
		{
			if(id='#pagetext' && val<=0)
			{
				//$(id).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
			else
			{
				$(id).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
		//		$(div).addClass('hidden');
			}
		}
	});
	
	var patt1 = /(.dbauth)/g;
	html=$(div+' div').html();
	
	
	hebrew();
	if(div=='#series')
	{
		seriestext=$('#seriestext').val();
		seriesnum1text=$('#seriesnum1text').val();
		seriesnum2text=$('#seriesnum2text').val();
		vals=seriesnum1text;
		if(seriesnum2text!='')
		{
			vals=vals+' of '+seriesnum2text;
		}
		
		var position = seriestext.search(/[\u0590-\u05FF]/);
		if(position >= 0)
		{
			vals=$('#seriesnum1text').val()+" מ "+$('#seriesnum2text').val()+" "+$('#seriestext').val();
			$(this).addClass('rtl');
		}
		else
		{
			vals=vals+' '+seriestext;
		}
		
		$(div+' span').html(vals);
	}
	else if(div.match(patt1)!==null)
	{
		vals='';
		
		vals=$('#authorfirtnametext').val()
		if($('#authormiddelnametext').val()!='')
		{
			vals+=' '+ $('#authormiddelnametext').val()
		}
		vals+=' '+ $('#authorlastnametext').val()
		if($('#saffixtext').val()!='')
		{		
			vals+=' , '+ $('#saffixtext').val();
		}
		$(div).html(vals);
	}
	else
	{
		$(div+' div').html(val);
	}
	
}

function addauthor(space = 'no')
{
	avals=$('#authourcount').val();
	$('.autherror').addClass('hidden');
	var i=0;
	if(space=='yes')
	{
		$('input.auth1').each(function()
		{
			valid=$(this).val();
			if(valid.trim()=='')
			{
				$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
				i++
			}
			else
			{
				$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
		});
	}
	else
	{
		$('input.auth1,textarea.auth1').each(function()
		{
			valid=$(this).val();
			if(valid.trim()=='')
			{
				$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
				i++
			}
			else
			{
				$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
		});
	}
	$('select.auth1').each(function()
	{
		valid=$(this).find("option:selected").val();
		if(valid=='')
		{
			$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
			i++
		}
		else
		{
			$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
		}
	});
	for(var k=1;k<=4;k++)
	{
		if($('#text'+k).val()!='' || $('#select'+k).val()!='')
		{
			keys=$('#text'+k).attr('onkeypress')
			keys=keys.replace("return validate(","");
			keys=keys.replace(")","");
			keys=keys.replace(/'/g,'');
			keys=keys.split(',');
			if($('#text'+k).val()=='')
			{
				i++;
				$('#text'+k).closest(".valid").find('.error').removeClass('hidden').html("Please Fill");
			}
			else if($('#select'+k).val()=='')
			{
				i++;
				$('#text'+k).closest(".valid").find('.error').removeClass('hidden').html("Select Type");	
			}
			else
			{
				fun= validate(event,keys[1],keys[2]);
				if(typeof fun!='undefined' && fun!='ok')
				{
					i++;
					$('#text'+k).closest(".valid").find('.error').removeClass('hidden').html(fun);	
				}				
			}			
		}
		else
		{
			$('#text'+k).closest(".valid").find('.error').addClass('hidden').html("Insert Link");	
		}
	}
	
	
	if(i==0)
	{
		$(".preloader").fadeIn("slow");
		$('.error').addClass('hidden');
		val=$('#authourcount').val();
		vals=$('#authourcount').val(parseInt(val)+1);
		authlist=0;
		var form_data = new FormData(); 
		form_data.append('coauthcount',$('.list_coauthor').length);
		$('.list_coauthor').each(function()
		{
				form_data.append('first_name'+authlist,$(this).find('.first_name').html());
				if($(this).find('.middle_name').html()!==undefined)
				{
					form_data.append('middle_name'+authlist,$(this).find('.middle_name').html());
				}
				form_data.append('last_name'+authlist,$(this).find('.last_name').html());
				if($(this).find('.suffix').html()!==undefined)
				{
					form_data.append('suffix'+authlist,$(this).find('.suffix').html());
				}
				authlist++
		})
							
		form_data.append('first_name',$('#authorfirtnametext').val());
		form_data.append('middle_name', $('#authormiddelnametext').val());
		form_data.append('last_name',$('#authorlastnametext').val());
		form_data.append('safix',$('#saffixtext').val());
		form_data.append('authimg',$('#authimg').val());

		form_data.append('text1', $('#text1').val());
		form_data.append('text2',$('#text2').val());
		form_data.append('text3', $('#text3').val());
		form_data.append('text4',$('#text4').val());

		form_data.append('select1', $('#select1').val());
		form_data.append('select2',$('#select2').val());
		form_data.append('select3', $('#select3').val());
		form_data.append('select4',$('#select4').val());
	
		form_data.append('fbgroup',$('#facebook').val());
		form_data.append('grgroup', $('#goodreads').val());
		form_data.append('tipical',$('#tipical').val());
		form_data.append('space',space);
		form_data.append('why_listen_to_you',$('#why_listen_to_you').val())

		authbookimg=1;
		form_data.append('authbookimg',$('.new').length);
		
		$('.newbook').each(function()
		{
				form_data.append('image'+authbookimg,$(this).find('img').attr('src'));
				form_data.append('book'+authbookimg,$(this).find('.bookname').text());
				
				authbookimg++
		})	
		
		
		//data='';
		$('.auths').each(function(){
			form_data.append($(this).attr('id'), $(this).val());  
			//data+='&'+$(this).attr('id')+'='+$(this).val();
		});

		form_data.append('book_id', book_id);   
		author_id=$('#book_channel').val()
		form_data.append('author_id', author_id);   
		form_data.append('req', "3");  
		$('.showtitle').removeClass('hidden').html('Saving...');
		
		$.ajax({
			url: baseurl+'new_ajax/book.php',
			dataType: 'text',  // what to expect back from the PHP script, if anything
			contentType: false,
			processData: false,
			data: form_data,                         
			type: 'post',
			success: function (html) 
			{	
				console.log(html)
				show_author_details();
				$(".preloader").fadeOut("slow");
				html=html.split(',,$');
				saveauthor(html[3],space);
				$('.showtitle').removeClass('hidden').html('Author Saved');
				$('#reviewtab').trigger('click')
				if($('#congrats').val()=='')
				{
					if(html[2].trim()=='yes')
					{
						showcong();
						$('#currentbook').html('Published').css('color','#4caf50');
					}
					else
					{
						$('#currentbook').html('Not Published').css('color','#f44336');
					}
				}
				setTimeout(function(){$('.showtitle').addClass('hidden').html('Author Saved');},1000);
				$('.valid .error').addClass('hidden');
				hebrew();
			},
			error: function(jqXHR, text, error){
				alert(error);          
			}
		});

	}
}
function editauthor(author_id,position)
{
	$('.error').addClass('hidden');
	$('.showtitle').removeClass('hidden').html('Fetching Data...');
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"author_id="+author_id+"&req=5",
		success: function (html) 
		{	
			$('.showtitle').removeClass('hidden').html('Data Fatched');
			data=html.split(',,$');
			$('input.coauthor,textarea.coauthor,input.coauthor,textarea.coauthor').each(function()
			{
				$(this).parent().addClass('fg-toggled');
			});
			
			$('#cofirst_name').val(data[0]);
			$('#colast_name').val(data[1]);
			if(data[2]!='')
			{
				$('input[type="checkbox"][value="comiddle_name"]').prop('checked', true);
				showhidediv('.co-authmiddle')
			}
			if(data[3]!='')
			{
				$('input[type="checkbox"][value="cosuffix"]').prop('checked', true);
				showhidediv('.co-authsuffix')
			}
			$('#comiddle_name').val(data[2]);
			$('#cosuffix').val(data[3]);

			hebrew();
			
			$('.savecoauth').html('Update author').attr('onClick','savecoauthor('+author_id+')');
			setTimeout(function(){$('.showtitle').addClass('hidden').html('Author Saved');},1000);
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});

}
function editauthorbooks(author_id,position)
{
	$('.showtitle').removeClass('hidden').html('Fetching Data...');
	$('#authtab').click();
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"author_id="+author_id+"&req=11",
		success: function (html) 
		{	
			$('#authbook').html(html);
			hebrew();
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});

}
function saveauthor(author_id="",space='no')
{
	var i=0;
	author_id=$('#book_channel').val()
	if(space=='yes')
	{
		$('input.auth1').each(function()
		{
			valid=$(this).val();
			if(valid.trim()=='')
			{
				$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
				i++
			}
			else
			{
				$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
		});
	}
	else
	{
		$('input.auth1,textarea.auth1').each(function()
		{
			valid=$(this).val();
			if(valid.trim()=='')
			{
				$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
				i++
			}
			else
			{
				$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
		});
	}
	$('select.auth1').each(function()
	{
		valid=$(this).find("option:selected").val();
		if(valid=='')
		{
			$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
			i++
		}
		else
		{
			$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
		}
	});
	for(var k=1;k<=4;k++)
	{
		if($('#text'+k).val()!='' || $('#select'+k).val()!='')
		{
			keys=$('#text'+k).attr('onkeypress')
			keys=keys.replace("return validate(","");
			keys=keys.replace(")","");
			keys=keys.replace(/'/g,'');
			keys=keys.split(',');
			if($('#text'+k).val()=='')
			{
				i++;
				$('#text'+k).closest(".valid").find('.error').removeClass('hidden').html("Please Fill");
			}
			else if($('#select'+k).val()=='')
			{
				i++;
				$('#text'+k).closest(".valid").find('.error').removeClass('hidden').html("Select Type");	
			}
			else
			{
				fun= validate(event,keys[1],keys[2]);
				if(typeof fun!='undefined' && fun!='ok')
				{
					i++;
					$('#text'+k).closest(".valid").find('.error').removeClass('hidden').html(fun);	
				}				
			}			
		}
		else
		{
			$('#text'+k).closest(".valid").find('.error').addClass('hidden').html("Insert Link");	
		}
	}
		
	if(i==0)
	{
		$(".preloader").fadeIn("slow");
		$('.error').addClass('hidden');
		authlist=0;
		var form_data = new FormData(); 
		form_data.append('coauthcount',$('.list_coauthor').length);
		$('.list_coauthor').each(function()
		{
				form_data.append('first_name'+authlist,$(this).find('.first_name').html());
				if($(this).find('.middle_name').html()!==undefined)
				{
					form_data.append('middle_name'+authlist,$(this).find('.middle_name').html());
				}
				form_data.append('last_name'+authlist,$(this).find('.last_name').html());
				if($(this).find('.suffix').html()!==undefined)
				{
					form_data.append('suffix'+authlist,$(this).find('.suffix').html());
				}
				authlist++
		})	
		form_data.append('first_name',$('#authorfirtnametext').val());
		form_data.append('middle_name', $('#authormiddelnametext').val());
		form_data.append('last_name',$('#authorlastnametext').val());
		form_data.append('safix',$('#saffixtext').val());
		form_data.append('authimg',$('#authimg').val());
		form_data.append('setimg',$('#authsetimg').val());

		form_data.append('text1', $('#text1').val());
		form_data.append('text2',$('#text2').val());
		form_data.append('text3', $('#text3').val());
		form_data.append('text4',$('#text4').val());

		form_data.append('select1', $('#select1').val());
		form_data.append('select2',$('#select2').val());
		form_data.append('select3', $('#select3').val());
		form_data.append('select4',$('#select4').val());
		authbookimg=1;
		form_data.append('authbookimg',$('.newbook').length);
		
		$('.newbook').each(function()
		{
				form_data.append('image'+authbookimg,$(this).find('img').attr('src'));
				form_data.append('book'+authbookimg,$(this).find('.bookname').text());
				
				authbookimg++
		})	
		
		
		//data='';
		$('.auths').each(function(){
			form_data.append($(this).attr('id'), $(this).val());  
			//data+='&'+$(this).attr('id')+'='+$(this).val();
		});

		form_data.append('book_id', book_id);   
		form_data.append('author_id', author_id);   
		form_data.append('req', "19");  
		form_data.append('why_listen_to_you',$('#why_listen_to_you').val())

		$('.showtitle').removeClass('hidden').html('Updating...');
		$.ajax({
			url: baseurl+'new_ajax/book.php',
			dataType: 'text',  // what to expect back from the PHP script, if anything
			contentType: false,
			processData: false,
			data: form_data,                         
			type: 'post',
			success: function (html) 
			{	
				console.log(html)
				show_author_details();
				$('.autherror').html(html)
				$(".preloader").fadeOut("slow");
				html=html.split(',,$');
 				$('.showtitle').removeClass('hidden').html('Author Updated');
				if($('#congrats').val()=='')
				{
					if(html[1].trim()=='yes')
					{
						showcong();					
					}	
				}
				if(html[1].trim()=='yes')
				{
					$('#currentbook').html('Published').css('color','#4caf50');						
				}
				else
				{
					$('#currentbook').html('Not Published').css('color','#f44336');
				}
				$('.valid .error').addClass('hidden');
				continuetoreview();
				
				hebrew();
				setTimeout(function(){$('.showtitle').addClass('hidden').html('Author Updated');},1000);
				get_auth_list()
			},
			error: function(jqXHR, text, error){
				alert(error);          
			}
		});

	}
	else
	{
		if(space!='yes')
		{
			notify('Please fill all compulsory fields signed with *', 'danger')
		}
	}
}

function savecoauthor(author_id)
{
	var i=0;
	if(i==0)
	{
		$(".preloader").fadeIn("slow");
		$('.error').addClass('hidden');
		authlist=0;
		var form_data = new FormData(); 
		form_data.append('coauthcount',$('.list_coauthor').length);
		$('.list_coauthor').each(function()
		{
				form_data.append('first_name'+authlist,$(this).find('.first_name').html());
				if($(this).find('.middle_name').html()!==undefined)
				{
					form_data.append('middle_name'+authlist,$(this).find('.middle_name').html());
				}
				form_data.append('last_name'+authlist,$(this).find('.last_name').html());
				if($(this).find('.suffix').html()!==undefined)
				{
					form_data.append('suffix'+authlist,$(this).find('.suffix').html());
				}
				authlist++
		})	
		form_data.append('first_name',$('#cofirst_name').val());
		form_data.append('middle_name', $('#comiddle_name').val());
		form_data.append('last_name',$('#colast_name').val());
		form_data.append('suffix',$('#cosuffix').val());

		form_data.append('book_id', book_id);   
		form_data.append('author_id', author_id);   
		form_data.append('req', "6");  
		

		$('.showtitle').removeClass('hidden').html('Updating...');
		$.ajax({
			url: baseurl+'new_ajax/book.php',
			dataType: 'text',  // what to expect back from the PHP script, if anything
			contentType: false,
			processData: false,
			data: form_data,                         
			type: 'post',
			success: function (html) 
			{	
				$('.autherror').html(html)
				$(".preloader").fadeOut("slow");
 				$('.showtitle').removeClass('hidden').html('Author Updated');
				
				$('.list_of_coauthor').html(html)
				$('.coauthcheck input[type="checkbox"]:checked').trigger('click')
				$('.coauthor').val('')
				hebrew();
				$('.savecoauth').html('Add Co-Authors').attr('onClick','addcoauthor()');
				setTimeout(function(){$('.showtitle').addClass('hidden').html('Co-Author Updated');},1000);
			},
			error: function(jqXHR, text, error){
				alert(error);          
			}
		});

	}
}
function deleteauthor(author_id,position)
{
	$('#deleteauthorbutton').click();
	$('#yesdeleteauthor').attr('onClick',"yesdeleteauth('"+author_id+"')")
}
function yesdeleteauth(author_id)
{
	$('.showtitle').removeClass('hidden').html('Deleting...');
	$('#nodeleteauthor').click();
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"req=7&author_id="+author_id+"&book_id="+book_id,
		success: function (html) 
		{	
			val=$('#authourcount').val();
			vals=$('#authourcount').val(parseInt(val)-1);
			$('.showtitle').removeClass('hidden').html('Author Deleted');
			authcount=$('#authourcount').val();
			$('.list_of_coauthor').html(html)
			
			hebrew();
			$('.error').addClass('hidden');
			$('#yesdeleteauthor').attr('onClick','')
			setTimeout(function(){$('.showtitle').addClass('hidden').html('Author Deleted');},1000);
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});

}
function addreview()
{
	rvals=$('#reviewnumber').val();
	if(rvals<=4)
	{
		i=0;
		$('input.review,textarea.review').each(function()
		{
			valid=$(this).val();
			if(valid.trim()=='')
			{
				$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
				i++
			}
			else
			{
				$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
		});
		$('select.review').each(function()
		{
			valid=$(this).find("option:selected").val();
			if(valid=='')
			{
				$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
				i++
			}
			else
			{
				$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
			}
		});
		if(i==0)
		{
			$(".preloader").fadeIn("slow");
			$('.error').addClass('hidden');
			val=$('#reviewnumber').val();
			vals=$('#reviewnumber').val(parseInt(val)+1);
			var reviewcontent=$('#reviewcontent').val();
			var reviewlocation=$('#publishplacetext').val();
			var reviewername=$('#reviewernametext').val();
			$.ajax({
				type: "POST",
				url: baseurl+'new_ajax/book.php',
				data:"name="+reviewername+"&location="+reviewlocation+"&review="+reviewcontent+"&req=2&book_id="+book_id,
				success: function (html) 
				{	
					$(".preloader").fadeOut("slow");
					html=html.split(',,$');
					$('.showtitle').removeClass('hidden').html('Review Saved');
					if($('#reviewnumber').val()>0)
					{
						img='<img src="img/usefull/success.png">'
					}
					else
					{
						img='<img src="img/usefull/edit.png">'
					}
					$('.revcount').html(img);
					$('#reviewitem').html(html[0]);
					$('.allreview').html(html[1]);
					if($('#congrats').val()=='')
					{
						if(html[2].trim()=='yes')
						{
							showcong();
							$('#currentbook').html('Published').css('color','#4caf50');
						}
						else
						{
							$('#currentbook').html('Not Published').css('color','#f44336');
						}
					}
					if(rvals<4)
					{
						$('.item,#reviewindicator li').removeClass('active');
						$('#reviewindicator').append('<li data-target="#review" data-slide-to="'+$('#reviewnumber').val()+'" class="active m-r-4"></li>');
						$('#reviewitem').append('<div class="item active show_content reviews'+$('#reviewnumber').val()+'"><div class="col-xs-12"><div class="card text-left p-10 width100 pull-left"><span class="reviewcontent m-b-10 pull-left width100"><div class="hebrewright hebrew">Review Content.</div></span><span class="m-b-0 bold hebrew"><i class="zmdi zmdi-account pull-left"><div class="reviewhebrew hebrew"></div></i> <span class="reviewname pull-left hebrew"><div class="reviewhebrew">User name</div></span><span class=" pull-left m-l-0 m-r-5 "><div class="reviewhebrew hebrew">,</div> </span><span class="reviewlocation pull-left hebrew"><div class="reviewhebrew"> User Location</div></span></span></div></div></div>');
					}
					hebrew();
					setTimeout(function(){$('.showtitle').addClass('hidden').html('Review Saved');},1000);
				},
				error: function(jqXHR, text, error){
					alert(error);          
				}
			});
			$('#tab-3 input,#tab-3 textarea').each(function()
			{
				$(this).val('');
				$(this).closest(".valid").find('.error').addClass('hidden').html('');
			});
			
			$('select.review').each(function()
			{
				$(this).val('').trigger("chosen:updated");
				$(this).closest(".valid").find('.error').addClass('hidden').html('');
			});
		}
		$('.reverror').addClass('hidden');
	}
	else
	{
		notify("5 Reviews are already added","danger")
		$('#tab-3 input,#tab-3 textarea').each(function()
		{
			$(this).val('');
			$(this).closest(".valid").find('.error').addClass('hidden').html('');
		});
		
		$('select.review').each(function()
		{
			$(this).val('').trigger("chosen:updated");
			$(this).closest(".valid").find('.error').addClass('hidden').html('');
		});
		
	}
}
function editreview(review_id,position)
{
	$('.showtitle').removeClass('hidden').html('Fetching Data...');
	$('#reviewtab').click();
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"review_id="+review_id+"&req=8",
		success: function (html) 
		{	
			$('html, body').animate({
				  scrollTop: 100
				}, 500);
		
			$('.showtitle').removeClass('hidden').html('Data Fatched');
			$('#tab-3 input,#tab-3 textarea').each(function()
			{
				$(this).parent().addClass('fg-toggled');
			});
			data=html.split(',,$');
			$('#reviewernametext').val(data[0]).attr('onKeyup',"changetext('#reviewernametext','.reviews"+position+" .reviewname')");
			$('#publishplacetext').val(data[1]).attr('onKeyup',"changetext('#publishplacetext','.reviews"+position+" .reviewlocation')");
			$('#reviewcontent').val(data[2]).attr('onKeyup',"changetext('#reviewcontent','.reviews"+position+" .reviewcontent'),countcharacter(document.getElementById('reviewcontent'),'350','#reviewcount')");
			var len = document.getElementById('reviewcontent').value.length;
			 if (len > 350) {
					  document.getElementById('reviewcontent').value = document.getElementById('reviewcontent').value.substring(0, 350);
			 } else {
					  $('#reviewcount').html(len+'/'+350);
			 }
			$('.savereview').html('Update review').attr('onClick','savereview('+review_id+')');
			hebrew();
			$('.error').addClass('hidden');
			setTimeout(function(){$('.showtitle').addClass('hidden').html('Author Saved');},1000);
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});

}
function savereview(review_id)
{
	var i=0;
	$('input.review,textarea.review').each(function()
	{
		valid=$(this).val();
		if(valid.trim()=='')
		{
			$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
			i++
		}
		else
		{
			$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
		}
	});
	if(i==0)
	{
		$(".preloader").fadeIn("slow");
		$('.error').addClass('hidden');
		var reviewcontent=$('#reviewcontent').val();
		var reviewlocation=$('#publishplacetext').val();
		var reviewername=$('#reviewernametext').val();
		$('.showtitle').removeClass('hidden').html('Updating...');
		$.ajax({
			type: "POST",
			url: baseurl+'new_ajax/book.php',
			data:"name="+reviewername+"&location="+reviewlocation+"&review="+reviewcontent+"&req=9&book_id="+book_id+"&review_id="+review_id,
			success: function (html) 
			{	
				$(".preloader").fadeOut("slow");
				html=html.split(',,$');
				$('.showtitle').removeClass('hidden').html('Review Updated');
				if($('#reviewnumber').val()<=0)
				{
					reviewss='<img src="img/usefull/edit.png">';
				}
				else
				{
					reviewss='<img src="img/usefull/success.png">';
				}
				$('.revcount').html(reviewss);
				$('#reviewitem').html(html[0]);
				$('.allreview').html(html[1]);
				if($('#congrats').val()=='')
				{
					if(html[2].trim()=='yes')
					{
						showcong();
						$('#currentbook').html('Published').css('color','#4caf50');
					}
					else
					{
						$('#currentbook').html('Not Published').css('color','#f44336');
					}
				}
				$('#reviewernametext').val('').attr('onKeyup',"");
				$('#publishplacetext').val('').attr('onKeyup',"");
				$('#reviewcontent').val('').attr('onKeyup',"");
				$('#reviewcount').html('0/350');
				$('.savereview').html('Save Review').attr('onClick','addreview()');
				rvals=$('#reviewnumber').val();	
				if(rvals<4)
				{
					$('#reviewernametext').val('').attr('onKeyup',"changetext('#reviewernametext','.item.show_content .reviewname')");
					$('#publishplacetext').val('').attr('onKeyup',"changetext('#publishplacetext','.item.show_content .reviewlocation')");
					$('#reviewcontent').val('').attr('onKeyup',"changetext('#reviewcontent','.item.show_content .reviewcontent'),countcharacter(document.getElementById('reviewcontent'),'350','#reviewcount')");
					$('#reviewcount').html('0/350');
					
					$('.item,#reviewindicator li').removeClass('active');
					indi='';
					for(ind=0;ind<rvals;ind++)
					{
						indi=indi+'<li data-target="#review" data-slide-to="'+ind+'" class="m-r-4"></li>';
					}
					$('.error').addClass('hidden');
					$('#reviewindicator').html(indi);
					$('#reviewindicator').append('<li data-target="#review" data-slide-to="'+$('#reviewnumber').val()+'" class="active m-r-4"></li>');
						$('#reviewitem').append('<div class="item active show_content reviews'+$('#reviewnumber').val()+'"><div class="col-xs-12"><div class="card text-left p-10 width100 pull-left"><span class="reviewcontent m-b-10 pull-left width100"><div class="hebrewright hebrew">Review Content.</div></span><span class="m-b-0 bold hebrew"><i class="zmdi zmdi-account pull-left"><div class="reviewhebrew hebrew"></div></i> <span class="reviewname pull-left hebrew"><div class="reviewhebrew">User name</div></span><span class=" pull-left m-l-0 m-r-5 "><div class="reviewhebrew hebrew">,</div> </span><span class="reviewlocation pull-left hebrew"><div class="reviewhebrew"> User Location</div></span></span></div></div></div>');
				}
				hebrew();
				setTimeout(function(){$('.showtitle').addClass('hidden').html('Review Saved');},1000);
			},
			error: function(jqXHR, text, error){
				alert(error);          
			}
		});
		rvals=$('#reviewnumber').val();	
		$('#tab-3 input,#tab-3 textarea').each(function()
		{
			$(this).val('');
			
			$(this).closest(".valid").find('.error').addClass('hidden').html('');
		});
		
		$('select.review').each(function()
		{
			$(this).val('').trigger("chosen:updated");
			$(this).closest(".valid").find('.error').addClass('hidden').html('');
		});
	}
	$('.reverror').addClass('hidden');
}
function deletereview(review_id,position)
{
	$('#deletereviewbutton').click();
	$('#yesdeletereview').attr('onClick','yesdeletereview('+review_id+','+position+')')
}
function yesdeletereview(review_id,position)
{
	$('.showtitle').removeClass('hidden').html('Deleting...');
	$('#nodeletereview').click();
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"req=10&review_id="+review_id+"&book_id="+book_id,
		success: function (html) 
		{	
			html=html.split(',,$');
			val=$('#reviewnumber').val();
			vals=$('#reviewnumber').val(parseInt(val)-1);
			$('.showtitle').removeClass('hidden').html('Review Deleted');
			reviewcount=$('#reviewnumber').val();
			if(reviewcount<=0)
			{
				reviewss='<img src="img/usefull/edit.png">';
			}
			else
			{
				reviewss='<img src="img/usefull/success.png">';
			}
			$('.revcount').html(reviewss);

			$('#reviewitem').html(html[0]);
			$('.allreview').html(html[1]);
			if($('#congrats').val()=='')
			{
				if(html[2].trim()=='yes')
				{
					showcong();
					$('#currentbook').html('Published').css('color','#4caf50');
				}
				else
				{
					$('#currentbook').html('Not Published').css('color','#f44336');
				}
			}
			
			$('#reviewindicator .active').remove();
			indi='';
			for(ind=0;ind<reviewcount;ind++)
			{
				indi=indi+'<li data-target="#review" data-slide-to="'+ind+'" class="m-r-4"></li>';
			}
			$('.error,.reverror').addClass('hidden');
			$('#reviewindicator').html(indi);
			if(reviewcount<=4)
			{
				$('#reviewindicator').append('<li data-target="#review" data-slide-to="'+$('#reviewnumber').val()+'" class="active m-r-4"></li>');
				$('#reviewitem').append('<div class="item active show_content reviews'+$('#reviewnumber').val()+'"><div class="col-xs-12"><div class="card text-left p-10 width100 pull-left"><span class="reviewcontent m-b-10 pull-left width100"><div class="hebrewright">Review Content.</div></span><span class="m-b-0 bold "><i class="zmdi zmdi-account pull-left"><div class="reviewhebrew"></div></i> <span class="reviewname pull-left"><div class="reviewhebrew">User name</div></span><span class=" pull-left m-l-0 m-r-5"><div class="reviewhebrew">,</div> </span><span class="reviewlocation pull-left"><div class="reviewhebrew"> User Location</div></span></span></div></div></div>');
			}
			$('#tab-3 input,#tab-3 textarea').each(function()
			{
				$(this).val('')
				$(this).closest(".valid").find('.error').addClass('hidden').html('');
			});
			hebrew();
			$('#yesdeleteauthor').attr('onClick','')
			setTimeout(function(){$('.showtitle').addClass('hidden').html('Author Deleted');},1000);
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});

}
function deletebonus(bonus_id,position)
{
	$('#deletereview').modal('show');
	$('#yesdeletereview').attr('onClick','yesdeletebonus('+bonus_id+','+position+')')
}
function yesdeletebonus(bonus_id,position)
{
	$('.showtitle').removeClass('hidden').html('Deleting...');
	$('#nodeletereview').click();
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"req=33&bonus_id="+bonus_id+"&book_id="+book_id,
		success: function (html) 
		{	
			if(html.trim()=='ok')
			{
				get_bonus()
			}
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});

}
function editbonus(bonus_id,position)
{
	$('.showtitle').removeClass('hidden').html('Fetching Data...');
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"bonus_id="+bonus_id+"&req=35",
		success: function (html) 
		{	
			$('.showtitle').addClass('hidden');
			html=html.split(',,$');
			$('#bonus input[name="title"]').val(html[0])
			$('#bonus textarea[name="description"]').html(html[1])
			$('#bonus textarea[name="description"]').val(html[1])
			$('#bonus input[name="bonus_id"]').val(bonus_id)
			$('#bonus button').html('Update Bonus')
		}
	});
}

function get_bonus()
{
	$.ajax({
		type: "POST",
		url: baseurl+'new_ajax/book.php',
		data:"req=34&book_id="+book_id,
		success: function (html) 
		{	
			$('.allbonus').html(html);
		},
		error: function(jqXHR, text, error){
			alert(error);          
		}
	});
}


$('#tab-3 input,#tab-3 textarea').keyup(function()
{
	$(this).closest(".valid").find('.error').addClass('hidden').html('');
});

function showSelected(id,div)
{
  var selObj = document.getElementById(id);
  var selected = [];
  var ids = [];
    for(var i=0, l=selObj.options.length; i < l; i++){
        if(selObj.options[i].selected){
            selected.push(selObj.options[i].textContent);
            ids.push(selObj.options[i].getAttribute('data-id'));
        }
    } 
	vals=$('#maingenerstext').val();
    $(div+' div').html($('#maingenerstext option:selected').html());
	$('.showtitle').removeClass('hidden').html('Saving...');
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url : baseurl+'new_ajax/book.php',
		data : "book_id="+book_id+'&req=4&field=gener_id&value='+vals,
		success: function(html)
		{
			html=html.split(',,$');
			if($('#congrats').val()=='')
			{
				if(html[1].trim()=='yes')
				{
					showcong();
					$('#currentbook').html('Published').css('color','#4caf50');
				}
				else
				{
					$('#currentbook').html('Not Published').css('color','#f44336');
				}
			}
			if(html[1].trim()=='allsaved')
			{
				$('#authtab').attr('href',"#tab-2").attr('aria-controls','tab-2').attr('onClick',"scrolto('authors','mobile')").attr('role',"tab").attr('data-toggle',"tab")
				$('#reviewtab').attr('href',"#tab-3").attr('aria-controls','tab-3').attr('onClick',"scrolto('review','mobile')").attr('role',"tab").attr('data-toggle',"tab")
			}
			else
			{
				$('#authtab').attr('href',"").attr('aria-controls','').attr('onClick',"").attr('role',"").attr('data-toggle',"")
				$('#reviewtab').attr('href',"").attr('aria-controls','').attr('onClick',"").attr('role',"").attr('data-toggle',"")
			}
			$('#savedbasic').val(html[1])
			$('.showtitle').removeClass('hidden').html('Saved');
			setTimeout(function(){$('.showtitle').addClass('hidden').html('Saved');},1000);
		}
	});
}
function changecheck(id,div)
{
	val=$(id).val();
	html=$(div+' span').html();
	$(div+' span').html(val);
}
function showdiv(div,id)
{
	if($(div).hasClass('hidden'))
	{
		$(div).removeClass('hidden');
	}
	else
	{
		$(div).addClass('hidden');
	}
}
function showdivoncheck(div,id)
{
	if($(id+":checked").length>0)
	{
		$(div).removeClass('hidden');
	}
	else
	{
		$(div).addClass('hidden');
	}
}
function check_radio(name,value,type)
{
	$('input[type='+type+'][name='+name+'][value='+value+']').prop('checked',true)
}
function validate(evt,type,div) 
{
	val=$(div).val().trim();
	$(div).on('blur',function()
	{
		if($(div).val()=='')
		{
			$(div).closest(".valid").find('.error').addClass('hidden').html('');
			return "ok";
		}
	});
	if(val=='')
	{
		$(div).closest(".valid").find('.error').addClass('hidden').html('');
		return "ok";
	}
	else
	{
		if(type=='number')
		{
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				$(div).closest(".valid").find('.error').removeClass('hidden').html('Enter only digits');
				return false;
				
			}
			else{$(div).closest(".valid").find('.error').addClass('hidden').html('');return "ok";}
			
		}
		if(type=="link")
		{
			val=val.replace('http://','');
			val=val.replace('https://','');
			val=val.replace('www.','');
			expr=/((http[s]?):\/\/)?([www]+)\.([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*/
			if(expr.test("http://www."+val))
			{
				$(div).closest(".valid").find('.error').addClass('hidden').html('Please paste the full link including "http://"');
				return "ok";
			}
			else
			{
				$(div).closest(".valid").find('.error').removeClass('hidden').html('Please paste the full link including "http://"');
				return 'Please paste the full link including "http://"';
			}
		}
		if(type=='connectlink')
		{
			val=val.replace('http://','');
			val=val.replace('https://','');
			val=val.replace('www.','');
			expr=/((http[s]?):\/\/)?([www]+)\.([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*/
			if(expr.test("http://www."+val))
			{
				$(div).closest(".valid").find('.error').addClass('hidden').html('Invalid Link');
				return "ok";
			}
			else
			{
				$(div).closest(".valid").find('.error').removeClass('hidden').html('Invalid Link');
				return 'Invalid Link';
			}
		}
		if(type=='email')
		{
			var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
			if(expr.test(val))
			{
				$(div).closest(".valid").find('.error').addClass('hidden').html('Invalid Email');
				return "ok";
			}
			else
			{
				$(div).closest(".valid").find('.error').removeClass('hidden').html('Invalid Email');
				return 'Invalid Email';
			}
		}
	}
}
function countcharacter(val,count,div)
{
	var len = val.value.length;
	 if (len > count) {
              val.value = val.value.substring(0, count);
     } else {
              $(div).text(len+'/'+count);
     }
}

/*$("#review").swiperight(function() 
{  
	$("#review").carousel('prev');  
});  
$("#review").swipeleft(function() 
{  
  $("#review").carousel('next'); 
}); 
*/

function setheight()
{
	topheader=$('.topheader').outerHeight();
	quoteheight=$('.quoteheight').height();
	buttonheight=45;
	tabbottom=35;
	mobileheight=490;
	topbottom=topheader+quoteheight+buttonheight+tabbottom;
	middleheight=mobileheight-topbottom;
	
	microheight=mobileheight-topbottom-10;
	chath=topheader+buttonheight+tabbottom;
	chatheight=mobileheight-chath;

	connectheight=mobileheight-(topheader+tabbottom);
	linktop=(quoteheight);
	$('#link').css({'margin-top':linktop+'px','max-height': middleheight+'px'}).addClass('scrollbar');
	$('#micro').css({'top':quoteheight+'px','max-height':microheight+'px','max-height': middleheight+'px'}).addClass('scrollbar');
	$('#chats').css({'top':'15px','max-height':chatheight+'px'});	
	$('#conn').css({'max-height':connectheight+'px'});
	
	minus=35+39+43+37;
	chat=35+43+37;
	height=490-(minus)-35;
	chatheight=490-(chat);
	
	content=height-$('#link').height();
	giftheight=$('#gift').height();
	gifttop=(490-(giftheight+37))/2;
	$('#gift').css({'top':gifttop+'px'});	
	
}
setheight();

var btn = document.querySelector('.add');
var remove = document.querySelector('.draggable');

function dragStart(e) {
  this.style.opacity = '1';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  
};

function dragEnter(e) {
  this.classList.add('over');
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function dragDrop(e) {
	
  if (dragSrcEl != this) 
  {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  if($('#post_id').length>0)
  {
  	seteventvisualstory();
  }
  else if($('#companion').length>0)
  {
	  set_experience_position()
  }
  else
  {
  	setvisualstory();
  }
  return false;
}

function dragEnd(e) {
  var listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  this.style.opacity = '1';
}

function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}

var listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
  addEventsDragAndDrop(item);
});
function set_experience_position()
{
}
function setvisualstory()
{
	visualcount=$('#visualcount').val();

	var d=1;
	var form_data = new FormData(); 
	$('.vis li>div>img').each(function(){
		dataitem=$(this).attr('data-item');
		form_data.append('data'+d, dataitem+'//'+d);
		d++;				
	});
	form_data.append('book_id', book_id);  
	form_data.append('visualcount', visualcount);  
	form_data.append('req', 31);  
	$.ajax({
		url : baseurl+'new_ajax/cardscreator.php',
		dataType: 'text',  // what to expect back from the PHP script, if anything
		contentType: false,
		processData: false,
		data: form_data,                         
		type: 'post',
		success: function(html)
		{
			
			$('#visuals').val(html);
			setvisual();
		}
	});
}
function addNewItem() {
  var newItem = document.querySelector('.input').value;
  if (newItem != '') {
    document.querySelector('.input').value = '';
    var li = document.createElement('li');
    var attr = document.createAttribute('draggable');
    var ul = document.querySelector('ul');
    li.className = 'draggable';
    attr.value = 'true';
    li.setAttributeNode(attr);
    li.appendChild(document.createTextNode(newItem));
    ul.appendChild(li);
    addEventsDragAndDrop(li);
  }
}

//btn.addEventListener('click', addNewItem);
function get_chat()
{
	$.ajax({
		type: "POST",
		cache: false,
		url : baseurl+"new_ajax/c_experience.php",
		data : $('.chat_content').find('select, textarea, input').serialize()+'&req=11&book_id='+book_id,
		success: function(html)
		{
			$('#chatlist').html(html);
			hebrew()
		}
	});
}
function addmessage()
{
	
	$.ajax({
		type: "POST",
		cache: false,
		url : baseurl+"new_ajax/c_experience.php",
		data : $('.chat_content').find('select, textarea, input').serialize()+'&req=10&book_id='+book_id,
		xhr: function () 
		{
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener("progress", function (evt) {
				if (evt.lengthComputable) {
					var percentComplete = evt.loaded / evt.total;
					percentComplete = parseInt(percentComplete * 100);
					console.log(percentComplete + '%');
					$('.savemessage').html('Please wait... ('+percentComplete + '%)');
				}
			}, false);
			return xhr;
		},		
		success: function(html)
		{
			$('.savemessage').html('Add to chat')
			console.log(html)
			if(html.trim()=='ok')
			{
				$('#reload').val('unsaved');
				$('.chat_content').find('textarea, input[type="text"]').each(function()
				{
					$(this).val('');
				});
				get_chat()
				hebrew()
			}
		}
	});
}

function setsession(id,book_name)
{
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url : baseurl+'new_ajax/createchannel.php',
		data : "book_id="+id+'&req=3',
		success: function(html)
		{
			window.location.href=baseurl+book_name+"/Sales";
			localStorage.setItem('book_id',id);
			localStorage.setItem('book_name',book_name);
		}
	});
}
function save_cupon_data()
{
	// if($('#coupon').val()=='')
	// {
	// 	$('#coupon').parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">This field is required</li></ul></div>')
	// 	$('#coupon').parent().parent().addClass('has-error')
			
	// }
	type=$('input[name=coupon_type]:checked').val()
	console.log($('.hide_coupon').find('select, textarea, input').serialize()+'&type='+type+'&req=45&book_id='+book_id)
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url : baseurl+'new_ajax/book.php',
		data : $('.hide_coupon').find('select, textarea, input').serialize()+'&type='+type+'&req=45&book_id='+book_id,
		success: function(html)
		{
			console.log(html)
		}
	});
}
function savedata(input,field)
{
	var $i=0;
	vals=$(input).val();
	if(field=='pages_number' && vals!='')
	{
		if($(input).val()<=0)
		{
			$(input).closest(".valid").find('.error').removeClass('hidden').html("Page Number Can't be Zero");
			$i++;
		}
		else
		{
			$(input).closest(".valid").find('.error').addClass('hidden').html('Enter only digits');
			vals=$(input).val();
		}
	}
	else if(field=='series' && vals!='')
	
	{
		seriestext=$('#seriestext').val();
		seriesnum1text=$('#seriesnum1text').val();
		seriesnum2text=$('#seriesnum2text').val();
		vals=seriesnum1text;
		if(seriesnum2text!='')
		{
			vals=vals+' of '+seriesnum2text;
		}
		vals=vals+' '+seriestext;
	}
	else if(field=='pre_order_date')
	{
		pre_order_month=$('#pre_order_month').val();
		pre_order_year=$('#pre_order_year').val();
		if(pre_order_year!='')
		{
			vals=pre_order_year+'-'+pre_order_month+'-01';
		}
		
	}
	else if(field=='trailer_link' && vals!='')
	{
		vals=vals.replace('www.','');
		vals=vals.split('://');
		vals=vals[0]+'://www.'+vals[1];

		expr=/((http[s]?):\/\/)?([www]+)\.([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*/
		if(expr.test(vals))
		{
			$(input).closest(".valid").find('.error').addClass('hidden').html('');
			vals=$(input).val();
		}
		else
		{
			$(input).closest(".valid").find('.error').removeClass('hidden').html('Please paste the full link including "http://"');
			$i++;
		}
	}
	else if(field=='purchase_type' && vals!='')
	{
		var searchIDs = $("input:checkbox[name='purchase_type']:checked").map(function(){
		  return $(this).val();
		}).get();
		vals=searchIDs;
	}
	else if(field=='type_of_sale' && vals!='')
	{
		var type_of_sale = $("input:radio[name='type_of_sale']:checked").val();
		vals=type_of_sale;
	}
	else if(field=='discount' && vals!='')
	{
		if(parseFloat($('#book_price').val())<parseFloat(vals))
		{
			$(input).closest(".valid").find('.error').removeClass('hidden').html('Discount cannot greater than '+$('#book_price').val());
			$i++;
		}
	}
	else
	{
		var attr = $(input).attr('onKeypress');
		id=$(input).attr('id');
		data_type=$(input).attr('data-type');
		if (typeof attr !== typeof undefined && attr !== false) 
		{
			if(data_type=='number')
			{
				val=$(input).val();
				if(val!='')
				{
					expr=/^\d+$/;
					if(expr.test(val))
					{
						$(input).closest(".valid").find('.error').addClass('hidden').html('');
						vals=$(input).val();
					}
					else
					{
						$(input).closest(".valid").find('.error').removeClass('hidden').html('Enter only digits');
						$i++;
					}
				}	
			}
			else if(data_type=="link")
			{
				val=$(input).val();
				if(val='')
				{
					expr=/((http[s]?):\/\/)?([www]+)\.([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*/
					if(expr.test(val))
					{
						$(input).closest(".valid").find('.error').addClass('hidden').html('Please paste the full link including "http://"');
						vals=$(input).val();
					}
					else
					{
						$(input).closest(".valid").find('.error').removeClass('hidden').html('Please paste the full link including "http://"');
						$i++
					}
				}
				else
				{
					$(input).closest(".valid").find('.error').removeClass('hidden').html('Please paste the full link including "http://"');
				}
			}
			else if(data_type=='email')
			{
				val=$(input).val();
				var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
				if(expr.test(val))
				{
					$(input).closest(".valid").find('.error').addClass('hidden').html('Invalid Email');
					vals=$(input).val();
				}
				else
				{
					$(input).closest(".valid").find('.error').removeClass('hidden').html('Invalid Email');
					$i++;
				}
			}
			else
			{
				vals=$(input).val();
			}
			
		}
		else
		{
			vals=$(input).val();
		}
	}
	
	if($i==0)
	{
		$('.showtitle').removeClass('hidden').html('Saving...');
		if(field!='purchase_type')
		{
			vals=vals.replace('&','amps');
		}
		if(field=='purchase')
		{
			vals=vals.replace(/\+/g,'aaapluse');
		}
		$.ajax({
			type: "POST",
			async: false,
			cache: false,
			url : baseurl+'new_ajax/book.php',
			data : "book_id="+book_id+'&req=4&field='+field+'&value='+vals,
			success: function(html)
			{
				console.log(html)
				html=html.split(',,$');
				if($('#content_rating').length>0)
				{
					$('#content_rating').click();
				}
				if($('#filter_id').val()!='')
				{
					if($('#search_congrats').val()=='' && ($('#filter_id').val()=='2')|| $('#filter_id').val()=='4')
					{
						if(html[3].trim()=='0')
						{
							showcong();
						}
					}
				}
				if($('#congrats').val()=='')
				{
					if(html[2].trim()=='yes')
					{
						showcong();
						$('#currentbook').html('Published').css('color','#4caf50');
					}
					else
					{
						$('#currentbook').html('Not Published').css('color','#f44336');
					}
				}
				if(html[1].trim()=='allsaved')
				{
					$('#authtab').attr('href',"#tab-2").attr('aria-controls','tab-2').attr('onClick',"scrolto('authors','mobile')").attr('role',"tab").attr('data-toggle',"tab")
					$('#reviewtab').attr('href',"#tab-3").attr('aria-controls','tab-3').attr('onClick',"scrolto('review','mobile')").attr('role',"tab").attr('data-toggle',"tab")
				}
				else
				{
					$('#authtab').attr('href',"").attr('aria-controls','').attr('onClick',"").attr('role',"").attr('data-toggle',"")
					$('#reviewtab').attr('href',"").attr('aria-controls','').attr('onClick',"").attr('role',"").attr('data-toggle',"")
				}				
				$(input).closest(".valid").find('.error').addClass('hidden').html('');
				$('#savedbasic').val(html[1])

				$('.showtitle').removeClass('hidden').html('Saved');
				setTimeout(function(){$('.showtitle').addClass('hidden').html('Saved');},1000);
			}
		});
	}
	
}
mobilewidth=$('.mobile').parent('.col-lg-5').width();
mobileleft=(mobilewidth-$('.mobile').width())/2;
$('.mobile').css('margin-left',mobileleft+'px');

window.onresize = function(event) {
	mobilewidth=$('.mobile').parent('.col-lg-5').width();
	mobileleft=(mobilewidth-$('.mobile').width())/2;
	$('.mobile').css('margin-left',mobileleft+'px');
};
$(window).scroll(function()
{
	if($(window).width()>'1200')
	{
		if ($(window).scrollTop() >= 190) {
		   $('.mobile').addClass('fixed').css({'top':'0','width': '313px'});
		}
		else {
		   $('.mobile').removeClass('fixed');
		}
	}
});
if($(window).width()>'1200')
{
	if ($(window).scrollTop() >= 190) {
		   $('.mobile').addClass('fixed').css({'top':'0','width': '313px'});
		}
		else {
		   $('.mobile').removeClass('fixed');
	}
	$('.mobdiv').removeAttr('style');	
}
else
{
	$('.mobdiv').css({
    "right": -344+"px",
    "width": 344+"px",
    "top": 50+"px",
    "position": "fixed"});
}
function showphone()
{
	if($('.smart').hasClass('active'))
	{
		$('.smart').removeClass('active');
		$('.smart').animate({"right": 0+"px"},500);
		$('.mobdiv').animate({
		"right": -344+"px",
		"width": 344+"px",
		top: 0+"px",
		position: "fixed"},500);
		$('.mobdiv').removeClass('card');
	}
	else
	{
		$('.smart').addClass('active');
		$('.smart').animate({"right": 344+"px"},500);
		$('.mobdiv').animate({
		"right": 0+"px",
		"width": 344+"px",
		top: 0+"px",
		position: "fixed"},500);
		$('.mobdiv').addClass('card');
	}
}
function  createimg(div)
{
	html2canvas($(div), {
		allowTaint: true,
        logging:true,
        useCORS: true,
		backgroundColor:'#ffffff',
		onrendered: function (canvas) 
		{
//			alert(canvas.toDataURL("image/png"))
			//$('#imgg').attr('src',canvas.toDataURL("image/png"));
			$('#image').val(canvas.toDataURL("image/png"));
			return canvas.toDataURL("image/png");
		}
	});
}
function  createpdf(div)
{
	html2canvas($(div), {
		allowTaint: true,
        logging:true,
        useCORS: true,
		backgroundColor:'#ffffff',
		onrendered: function (canvas) 
		{
			var imgData = canvas.toDataURL('image/png');
		  	var doc = new jsPDF('p', 'mm');
		  	doc.addImage(imgData, 'PNG', 0, 0, 211, 100);
		  	doc.save('sample-file.pdf');
		}	
	});
}
function printDiv(divName) {
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

function editchatpop(id)
{
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url : baseurl+'new_ajax/cardscreator.php',
		data : "chat_id="+id+'&req=20',
		success: function(html)
		{
			html=html.split(',,$');
			$('#chnametext').val(html[0]).parent().addClass('fg-toggled');
			$('#chtimetext').val(html[1]).parent().addClass('fg-toggled');
			$('#chmessagetext').val(html[2]).parent().addClass('fg-toggled');
			$('input[name="side"]').val([html[3]]).parent().addClass('fg-toggled');
			$('.savemessage').html('Update Message').attr('onClick',"savechatpop('"+id+"')");
			
		}
	});
}
function savechatpop(id)
{
	chnametext=$('#chnametext').val();
	chtimetext=$('#chtimetext').val();
	chmessagetext=$('#chmessagetext').val();
	item_id=$('#item_id').val();
	side=$('input[name="side"]:checked').val();
	var i=0;
	$('input.authss,textarea.authss').each(function()
	{
		valid=$(this).val();
		if(valid.trim()=='')
		{
			$(this).closest(".valid").find('.error').removeClass('hidden').html('Please Fill');
			i++
		}
		else
		{
			$(this).closest(".valid").find('.error').addClass('hidden').html('Please Fill');
		}
	});	
	if(i==0)
	{
		chtimetext=chtimetext.split(' ');
		
		$.ajax({
			type: "POST",
			async: false,
			cache: false,
			url : baseurl+'new_ajax/cardscreator.php',
			data : 'req=21&chname='+chnametext+'&chmessage='+chmessagetext+'&side='+side+'&item_id='+item_id+'&chtime='+chtimetext+'&chat_id='+id,
			success: function(html)
			{
				$('#chatlist').html(html);
				$('#reload').val('unsaved');
				$('.auth').each(function()
				{
					$(this).val('');
				});
				get_chat()
				$('.savemessage').html('Add Message').attr('onClick',"validates('.chat_content','addmessage')");
			}
		});
		
	}
}
function deletechatpop(events,id)
{
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url : baseurl+'new_ajax/cardscreator.php',
		data : "chat_id="+id+'&req=22',
		success: function(html)
		{
			if(html.trim()=='ok')
			{
				$(events).remove();
			}
		}
	});
}
function show_after()
{
	check=$('input[name="show_after_book_finished"]:checked').length;
	checkval=$('input[name="show_after_book_finished"]:checked').val();
	/*if(checkval=='yes')
	{
		$('.timen').removeClass('hidden');
		$('.pagetn').addClass('hidden');
		
	}
	else
	{
		$('.pagen').removeClass('hidden');
		$('.timen').addClass('hidden');
	}*/
	return checkval;
}
checkselect('#select1',0)
function checkselect(div,add)
{
	var checked=[];
	var selectindex=[];
	$('.connect .selectpicker').each(function()
	{
		checked.push($(this).val());
		id=$(this).attr('id');
		if($(this).val()=='')
		{
			$(this).siblings('.col-lg-6').children("input[type='text']").val('');
		}
		else if($(this).val()=='email')
		{
			
			var sbid=$(this).siblings('.col-lg-7').children("input[type='text']").attr('id');
			$(this).siblings('.col-lg-7').children("input[type='text']").attr('onkeypress',"return validate(event,'email','#"+sbid+"')");
			$(this).siblings('.col-lg-7').children("input[type='text']").attr('onkeydown',"return validate(event,'email','#"+sbid+"')");
			$(this).siblings('.col-lg-7').children("input[type='text']").attr('data-type',"email");
		}
		else
		{
			var sbid=$(this).siblings('.col-lg-7').children("input[type='text']").attr('id');
			$(this).siblings('.col-lg-7').children("input[type='text']").attr('onkeypress',"return validate(event,'connectlink','#"+sbid+"')");
			$(this).siblings('.col-lg-7').children("input[type='text']").attr('onkeydown',"return validate(event,'connectlink','#"+sbid+"')");
			$(this).siblings('.col-lg-7').children("input[type='text']").attr('data-type',"connectlink");
		}
		selectindex.push($("#"+id+" option:selected").index()+add);
	});
	$('.inner li').removeClass('disabled');
	for(i=0;i<checked.length;i++)
	{
		$('.connect .selectpicker').each(function()
		{
			$('.connect .inner li[data-original-index='+selectindex[i]+']').addClass('disabled');
			$('.connect .inner li[data-original-index="1"]').removeClass('disabled');
		});
	}
	
}
setTimeout(function(){
for($cc=1;$cc<=4;$cc++)
{
	checkselect('#select'+$cc,0);
}
},500);
hebrew();
function hebrew()
{
	$("input,textarea").each(function()
	{
		var str = $(this).val();
		var position = str.search(/[\u0590-\u05FF]/);
		if(position >= 0)
		{
			$(this).addClass('rtl');
			id=$(this).attr('id');
			if(id=='seriestext')
			{
				data=$('#seriesnum1text').val()+" מ "+$('#seriesnum2text').val()+" "+$('#seriestext').val();
				$('#series div').html(data);
			}
		}
		else
		{
			id=$(this).attr('id');
			if(id=='seriestext')
			{
				data=$('#seriesnum1text').val()+" of "+$('#seriesnum2text').val()+" "+$('#seriestext').val();
				$('#series div').html(data);
			}
			$(this).removeClass('rtl');
		}
	});
	$("body .profile-info div,.hebrew,#samples div,.allreview .width100 div,.lv-item .media-body .ms-item").each(function()
	{
		var str = $(this).html();
		var position = str.search(/[\u0590-\u05FF]/);
		if(position >= 0)
		{
		  	$(this).addClass('rtl');
			
			
			if($(this).hasClass('reviewhebrew') && $(this).hasClass('rtl'))
			{
				$(this).parent().parent().addClass('rtl');
				$('.col-xs-12 span.rtl .pull-left,.item span.rtl .pull-left').removeClass('pull-left').addClass('pull-right');
				$('.col-xs-12 span.rtl,.item span.rtl').siblings().children('.reviewhebrewleft').parent().removeClass('pull-right').addClass('pull-left');
			}
			else
			{
				if($(this).hasClass('ms-item'))
				{
					$(this).children('.ms-date').removeClass('pull-right').addClass('pull-left m-l-0 m-r-10');
				}
				else
				{
					$(this).parent().parent().removeClass('rtl');
					$('.item>span.rtl .pull-right').removeClass('pull-right').addClass('pull-left');
					$('.item span.rtl').siblings().children('.reviewhebrewleft').parent().removeClass('pull-left').addClass('pull-right');
				}
			}
		}
		else
		{
			$(this).removeClass('rtl');
		}
	});
	$('.mainauthors').removeClass('rtl');
	$('.mainauthors li span').each(function(){
		var str = $(this).html();
		var position = str.search(/[\u0590-\u05FF]/);
		if(position >= 0){
		  $(this).addClass('rtl');
		}
		else
		{
			$(this).removeClass('rtl');
		}
	});
	
}
$("input,textarea").on('keyup',function()
{
	var str = $(this).val();
	var position = str.search(/[\u0590-\u05FF]/);
	if(position >= 0){
	  $(this).addClass('rtl');
	}
	else
	{
		$(this).removeClass('rtl');
	}
});

function addnewline(id)
{
  
}

function getmetadata(id,div)
{

	linktext=$(id).val();
	spage=$('#spage').val();
	if($(id).attr('data-type')=='visual')
	{
	}
	if(id=='#insertlink')
	{
		$('#savevisual').html('Please Wait...').attr('disabled',true)
	}
	if(linktext.trim()!='')
	{
		linktext=linktext.trim().replace('www.','');
		linktext=linktext.split('://');
		linktext=linktext[0]+'://www.'+linktext[1];
		expr=/((http[s]?):\/\/)?([www]+)\.([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*/
		if(expr.test(linktext))
		{
			$(id).closest(".valid").find('.error').addClass('hidden').html('Please paste the full link including "http://"');
			if((spage=='micro' && $('#bbimm').val()!='') || (spage=='merch' && $('#bbimm').val()!=''))
			{
				$('.linkfield').removeClass('hidden');
				$(div).addClass('hidden');
				changetext('#linktext','.linkfield');
			}
			else
			{
				if(spage=='micro')
				{
					$(div).removeClass('hidden');
					$('.linkfield').addClass('hidden');
				}
				var patt1 = /(www.youtube.com)/g;
				var patt2 = /(youtu.be)/g;
				if(linktext.match(patt1)!==null || linktext.match(patt2)!==null )
				{
					$(div+' img').attr('src',imageurl+'loading.gif');
					$('.playicon').addClass('hidden');
					changelink(id,div,'yes');
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
								img=imageurl+$('input[name="subtype"]:checked').val()+'.png';
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
		}
		else
		{
			$(id).closest(".valid").find('.error').removeClass('hidden').html('Please paste the full link including "http://"');
			
		}
	}
	else
	{
		img=imageurl+'defaultimage.png';
		$('#myimage').attr('src',img);
		$('.title').html('Title');
		$('.description').html('Description');
							
		if(spage=='micro')
		{
			$(div).addClass('hidden');
		}
		if(spage=='micro' && $('#backgroundimg').val()!=='')
		{
			$('.linkfield').addClass('hidden');
			changetext('#linktext','.linkfield');
		}
		
	 	$(id).closest(".valid").find('.error').addClass('hidden').html('Please paste the full link including "http://"');

	}
}


function ValidateEmail(email,type) 
{
	if(type=='email')
	{
		var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	}
	if(type=='link')
	{
		var expr=/(http|https):\/\/www.[A-Za-z0-9].[A-Za-z]{0,3}i/;
		$(this).closest(".valid").find('.error').addClass('hidden').html('Link invalid');
	}
    return expr.test(email);
};

function closepop()
{
	$('.imgpop').fadeOut(500);
	$('.modal-backdrop').addClass('hidden').removeClass('fade in');
}

function setloader(links)
{
	window.location.href=links;
}
function click_items()
{
}

function addsubscribtion()
{
	$.ajax({
		url : baseurl+"new_ajax/signup.php",
		cache: false,
		data : "req=16",
		success : function (data) 
		{
			$('.subs').addClass('hidden');
		}
	});
}
function showdraft() 
{
	$('#draft').trigger('click')
}
function showmarketdraft() 
{
	$('#marketdraft').trigger('click')
}
function showlinkpopup() 
{
	$('#linkpopup').trigger('click')
}

function checkpaypal(div,links) 
{
	links= $('#'+links).val()
	var patt2 = /(paypal.me)/g;
	if(linktext.match(patt2)!==null )
	{
		$(div).closest(".valid").find('.error').addClass('hidden').html('Please paste the full link including "http://"');	
	}
	else
	{
		links=links.split('/')
		linkslength=links.length
		
	}
}
/*function savetopublish(draftid)
{
	if($('#draftid').length>0)
	{
		draftid=$('#draftid').val()
	}
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
	else
	{
		if($('input[id="check'+draftid+'"]:checked').length>0)
		{
			publish='yes'		
		}
		else
		{
			publish='no'
		}
	}	
	$.ajax({
		type: "POST",
		url : baseurl+"new_ajax/cardscreator.php",
		data : 'item_id='+draftid+'&req=34&publish='+publish+'&book_id='+book_id,
		success: function(html)
		{
			html=html.split(',,$')
			if(html[1]=='4story')
			{
				$('.markettext').html('You have allowed to add marketing card for every four story telling cards, so for now this card is in draft mode on BooxFlow.')
				if($('#check'+draftid).length>0)
				{
					$('#check'+draftid).attr('checked',false)
				}
				showmarketdraft() 
			}
			else if(html[1]=='2seqence')
			{
				$('.markettext').html('You have already published 2 marketing cards on Sequence, please add it to Automation or update the existing ones.')
				showmarketdraft() 
				if($('#check'+draftid).length>0)
				{
					$('#check'+draftid).attr('checked',false)
				}
			}
			else
			{
				
				if($('input[id="check'+draftid+'"]').length>0)
				{
					if(html[0]=='yes')
					{
						$('input[id="check'+draftid+'"]').parent().siblings('p').html('published')
					}
					else
					{
						$('input[id="check'+draftid+'"]').parent().siblings('p').html('Draft')
					}
				}
				if(html[0]=='yes')
				{
					notify('Exterience is published','success')
				}
				else
				{
					notify('Exterience is Draft','danger')
				}
			}
		}
	});
}
*/function showend_of_book()
{
	$('#endofbooks').click()	
}
function wordco()
{
	$('#wordcounts').click()	
}
function save_word() 
{
	$.ajax(
	{
		type: "POST",
		url : baseurl+"new_ajax/book.php",
		data : $('#wordcount').find('select, textarea, input').serialize()+'&req=39&book_id='+book_id,
		success: function(html)
		{
			$('#booxflow_cancel').click();	
		}
	});
}
$('#pagenumbertext').focus(function()
{
	$('input[name="show_after_book_finished"][value="no"]').prop('checked',true);
})
$('#time').focus(function()
{
	$('input[name="show_after_book_finished"][value="yes"]').prop('checked',true);
})


function show_author_details()
{
	author_id=$('#book_channel').val()
	$.ajax({
		type: "POST",
		url : baseurl+"new_ajax/book.php",
		data : 'req=23&author_id='+author_id,
		success: function(html)
		{
			$('#authordetail').html(html)
		}
	})
}


function add_retailer_link(id)
{
	for($i=1;$i<=5;$i++)
	{
		$e=0;
		$(id+' .name'+$i).siblings('.help-block').remove()
		$(id+' .link'+$i).siblings('.help-block').remove()
		if($(id+' .name'+$i).val()=='' && $(id+' .link'+$i).val()=='')
		{
			$.ajax({
				type: "POST",
				url : baseurl+"new_ajax/book.php",
				data : 'req=43&book_id='+book_id+'&i='+$i+'&name='+$(id+' .name'+$i).val()+'&link='+$(id+' .link'+$i).val()+"&book_type="+$(id+' input[name=format]').val(),
				success: function(html)
				{
				}
			})
		}
		else if($(id+' .name'+$i).val()!='' || $(id+' .link'+$i).val()!='')
		{
			if($(id+' .name'+$i).val()=='')
			{
				$(id+' .name'+$i).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">This field is required</li></ul></div>')
				$(id+' .name'+$i).parent().parent().addClass('has-error')
				$e++;
			}
			else if($(id+' .link'+$i).val()=='')
			{
				$(id+' .link'+$i).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">This field is required</li></ul></div>')
				$(id+' .link'+$i).parent().parent().addClass('has-error')
				$e++;
			}
		}
		else if($(id+' .name'+$i).val()=='' || $(id+' .link'+$i).val()=='')
		{
			$e++;
		}
		
		if($e==0)
		{
			if($(id+' .name'+$i).val()!='' &&  $(id+' .link'+$i).val()!='')
			{
				$(id+' .retailer_link'+$i+' .absolute').removeClass('hidden')
			}
			$.ajax({
				type: "POST",
				url : baseurl+"new_ajax/book.php",
				data : 'req=30&book_id='+book_id+'&i='+$i+'&name='+$(id+' .name'+$i).val()+'&link='+$(id+' .link'+$i).val()+"&book_type="+$(id+' input[name=format]').val(),
				success: function(html)
				{
					
				}
			})
		}
	}
}
function showcong()
{

	$('#congrpop').trigger('click')
}
function save_publisher_title(id)
{
	id=id.split(',')
	vals=$(id[0]).val()
	field=id[1];
	$.ajax({
		type: "POST",
		async: false,
		cache: false,
		url : baseurl+'new_ajax/book.php',
		data : "book_id="+book_id+'&req=4&field='+field+'&value='+vals,
		success: function(html)
		{
			window.location.reload();
		}
	});
}
function save_store_link(input,sale_type_id)
{
	type=$('input[name='+input+']:checked').val()
	$save='';
	$links_count=0;	
	if($('input[name='+input+']:checked').length>0)
	{				
		if(type=='link_sale')
		{
			for($i=1;$i<=5;$i++)
			{
				$('#collapse'+input+' .name'+$i).siblings('.help-block').remove()
				$('#collapse'+input+' .link'+$i).siblings('.help-block').remove()
				if($('#collapse'+input+' .name'+$i).val()=='' && $('#collapse'+input+' .link'+$i).val()=='')
				{
					$.ajax({
						type: "POST",
						url : baseurl+"new_ajax/book.php",
						data : 'req=43&book_id='+book_id+'&i='+$i+'&name='+$('#collapse'+input+' .name'+$i).val()+'&link='+$('#collapse'+input+' .link'+$i).val()+"&book_type="+$('#collapse'+input+' input[name=book_type]').val(),
						success: function(html)
						{
						}
					})
					$links_count++;
				}
				else if($('#collapse'+input+' .name'+$i).val()!='' || $('#collapse'+input+' .link'+$i).val()!='')
				{
					if($('#collapse'+input+' .name'+$i).val()=='')
					{
						$('#collapse'+input+' .name'+$i).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">This field is required</li></ul></div>')
						$('#collapse'+input+' .name'+$i).parent().parent().addClass('has-error')
						$save='';					
					}
					else if($('#collapse'+input+' .link'+$i).val()=='')
					{
						$('#collapse'+input+' .link'+$i).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">This field is required</li></ul></div>')
						$('#collapse'+input+' .link'+$i).parent().parent().addClass('has-error')
						$save='';
					}
					else
					{
						expr=/http[s]?:\/\/w{0,3}\w*?\.(\w*?\.)?\w{2,3}\S*|[A-Za-z]\.(\w*?\.)?\w*?\.\w{2,3}\S*|(\w*?\.)?\w*?\.\w{2,3}[\/\?]\S*/
						if(expr.test($('#collapse'+input+' .link'+$i).val()))
						{
							$save='save';	
						}
						else
						{
							$('#collapse'+input+' .link'+$i).parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">Invalid link</li></ul></div>')
							$('#collapse'+input+' .link'+$i).parent().parent().addClass('has-error')
							$save='';	
						}
						
					}				
				}
				else if($('#collapse'+input+' .name'+$i).val()=='' || $('#collapse'+input+' .link'+$i).val()=='')
				{
					$save='';
				}
			}
			if($links_count==5)
			{
				$('.retailer_link').attr('style','border: 2px solid #f00;');
				$('.retailer_link_error').removeClass('hidden')
			}		
			else
			{
				$('.retailer_link').removeAttr('style');
				$('.retailer_link_error').addClass('hidden')
			}
		}
		else if(type=='sell_direct_grateboox')
		{
			$error='show';
			$('.sale_through_files').each(function(){
				if($(this).val()!='')
				{
					$save='save';					
					$error='';
				}
			});
			if($('input[name=type_of_sale]:checked').val()=='sale')
			{
				if($('#book_price').val()=='')
				{
					$save='';
					$('.book_price_error').removeClass('hidden').html("Add Price")
				}
				else if($('#book_price').val()<=0)
				{
					$save='';
					$('.book_price_error').removeClass('hidden').html("Amount Can't be Zero")
				}
				else if(parseFloat($('#book_price').val())<parseFloat($('.sale_price input[name=discount]').val()))
				{
					$('.sale_price input[name=discount]').closest(".valid").find('.error').removeClass('hidden').html('Discount cannot greater than '+$('#book_price').val());
					$save='';
				}
			}
			if($('#book_price').val()<=0)
			{
				$save='';
				$('.book_price_error').removeClass('hidden').html("Amount Can't be Zero")
			}
			if($('#partofcoupon:checked').length>0)
			{
				if($('#coupon').val()=='')
				{
					$('#coupon').parent().append('<div class="help-block text-danger"><ul role="alert"><li class="text-danger">This filed required</li></ul></div>')
					$('#coupon').parent().parent().addClass('has-error')			
					$save='';
				}

			}
			if($error=='show')
			{
				$('.ebook_file').attr('style','border: 2px solid #f00;');
				$('.ebook_file_error').removeClass('hidden')
			}

		}
		else
		{
			$save='save';	
		}
		if($save=='save')
		{
			$('.book_price_error').addClass('hidden')
			$.ajax({
				type: "POST",
				async: false,
				cache: false,
				url : baseurl+'new_ajax/book.php',
				data : "book_id="+book_id+'&req=44&type='+type+'&sale_type_id='+sale_type_id,
				success: function(html)
				{
					if(html.trim()=='show')
					{
						$('#checkbuy').attr('checked',false)
						$('#draftbuy').modal('show');
						input=input.replace('sell_through','');
						$('.sale_type').html(capitalize(input));
						$('#checkbuy').val(sale_type_id)
						$('.status'+sale_type_id).removeClass('hidden');
					}
					notify('Saved','success')
				}
			});
		}
	}
	else
	{
		notify('Please select selling option','danger')
	}
}
function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}
function remove_text(classs,fun,para)
{
	$(classs+' input[type=text]').val('');
	$(classs+' .absolute').addClass('hidden')
	validates(classs,fun,para)
}
$('.link_name,.link_link').focus(function(){$('.retailer_link').removeAttr('style');$('.retailer_link_error').addClass('hidden')})

function check_book_title_exist(event, req, form) 
{
    id = $(form+' .id').val()
    var returnval;
    $.ajax({
        type: "POST",
        url: baseurl + 'new_ajax/createchannel.php',
        data: $(form).find('select, textarea, input').serialize() + '&req=' + req + '&id=' + id,
        async: false,
        success: function(html) 
        {
            if (html.trim() == 'ok') {
                $(event).parent().parent().removeClass('has-error')
            } else {
                $(this).parent().parent().parent().find('.error').html('')
                $(this).parent().parent().append('<div class="input-danger">' + html + '</div>')
                $(this).parent().parent().addClass('text-danger')
            }
            returnval = html.trim();
        }
    });
    return returnval;
}
