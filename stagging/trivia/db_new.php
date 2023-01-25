<?php
$connect=mysqli_connect("localhost", 'dreamygo_zoomin', '8uDwH0YF9','dreamygo_zoomin');
$connect->set_charset("utf8");
error_reporting(0);
//@
if( ! ini_get('date.timezone') )
{
    date_default_timezone_set('GMT');
}
$datetime=date('Y-m-d H:i:s');
define('BASEURL','https://saviour.earth/ZoomIn/trivia/');
function is_image($webfile)
{
 $fp = @fopen($webfile, "r");
 if ($fp !== false)
  fclose($fp);

 return($fp);
}
function age($day, $month, $year){
 $year_diff  = date("Y") - $year;
 $month_diff = date("m") - $month;
 $day_diff   = date("d") - $day;
 if ($day_diff < 0 && $month_diff==0) $year_diff--;
 if ($day_diff < 0 && $month_diff < 0) $year_diff--;
 return $year_diff;
}
function dateDiff($time1, $time2, $precision = 6) {
    if (!is_int($time1)) {
      $time1 = strtotime($time1);
    }
    if (!is_int($time2)) {
      $time2 = strtotime($time2);
    }
    if ($time1 > $time2) {
      $ttime = $time1;
      $time1 = $time2;
      $time2 = $ttime;
    }

    $intervals = array('year','month','day','hour','minute','second');
    $diffs = array();

    foreach ($intervals as $interval) {
      $diffs[$interval] = 0;
      $ttime = strtotime("+1 " . $interval, $time1);
      while ($time2 >= $ttime) {
    $time1 = $ttime;
    $diffs[$interval]++;
    $ttime = strtotime("+1 " . $interval, $time1);
      }
    }

    $count = 0;
    $times = array();
    foreach ($diffs as $interval => $value) {
      if ($count >= $precision) {
    break;
      }
      if ($value > 0) {
    if ($value != 1) {
      $interval .= "s";
    }
    $times[] = $value . " " . $interval;
    $count++;
      }
    }
    return implode(", ", $times);
}

function convert_text($text) {

$t = $text;

$specChars = array(
    '!' => '!',    '"' => '',
    '#' => '',    '$' => '$',    '%' => '_',
    '&' => '',    '\'' => '',   '(' => '(',
    ')' => ')',    '*' => '',    '+' => '+',
    ',' => ',',    '-' => '-',    '.' => '.',
    '/' => '',    ':' => '',    ';' => ';',
    '<' => '',    '=' => '=',    '>' => '',
    '?' => '_',    '@' => '@',    '[' => '[',
    '\\' => '',   ']' => ']',    '^' => '',
    '_' => '_',    '`' => '',    '{' => '',
    '|' => '_',    '}' => '',    '~' => '~',
    ',' => ',',  ' ' => '_'
);

foreach ($specChars as $k => $v) {
    $t = str_replace($k, $v, $t);
}

return $t;
}
function upload_image($image,$name,$count,$ext='png')
{
	$filterData=substr($image, strpos($image, ",")+1); //Get the base-64 string from data
	$decodeData=base64_decode($filterData); //Decode the string
	
	
	$output_dir = "uploads/";
	$ImageExt    = "png";
	$NewImageName = $name.$count.'.'.$ext;

	unlink(BASEURL.$output_dir.$NewImageName);

	if(file_put_contents('../uploads/'.$NewImageName, $decodeData))
	return $image=BASEURL.$output_dir. $NewImageName;
	
}
function upload_video($image,$name,$count)
{
	$target_dir = 'uploads'; // add the specific path to save the file
	$filterData=substr($image, strpos($image, ",")+1); //Get the base-64 string from data
    $decoded_file = base64_decode($filterData); // decode the file
    $mime_type = finfo_buffer(finfo_open(), $decoded_file, FILEINFO_MIME_TYPE); // extract mime type
    $extension = mime2ext($mime_type); // extract extension from mime type
    $file = uniqid() .'.'. $extension; // rename file as a unique name
    $NewImageName = uniqid() .'.'. $extension;
    try {
        file_put_contents('../uploads/'.$NewImageName, $decoded_file); // save
        
		header('Content-Type: application/json');
        echo json_encode("File Uploaded Successfully");
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode($e->getMessage());
    }
	
}
function mime2ext($mime){
    $all_mimes = '{"png":["image\/png","image\/x-png"],"bmp":["image\/bmp","image\/x-bmp",
    "image\/x-bitmap","image\/x-xbitmap","image\/x-win-bitmap","image\/x-windows-bmp",
    "image\/ms-bmp","image\/x-ms-bmp","application\/bmp","application\/x-bmp",
    "application\/x-win-bitmap"],"gif":["image\/gif"],"jpeg":["image\/jpeg",
    "image\/pjpeg"],"xspf":["application\/xspf+xml"],"vlc":["application\/videolan"],
    "wmv":["video\/x-ms-wmv","video\/x-ms-asf"],"au":["audio\/x-au"],
    "ac3":["audio\/ac3"],"flac":["audio\/x-flac"],"ogg":["audio\/ogg",
    "video\/ogg","application\/ogg"],"kmz":["application\/vnd.google-earth.kmz"],
    "kml":["application\/vnd.google-earth.kml+xml"],"rtx":["text\/richtext"],
    "rtf":["text\/rtf"],"jar":["application\/java-archive","application\/x-java-application",
    "application\/x-jar"],"zip":["application\/x-zip","application\/zip",
    "application\/x-zip-compressed","application\/s-compressed","multipart\/x-zip"],
    "7zip":["application\/x-compressed"],"xml":["application\/xml","text\/xml"],
    "svg":["image\/svg+xml"],"3g2":["video\/3gpp2"],"3gp":["video\/3gp","video\/3gpp"],
    "mp4":["video\/mp4"],"m4a":["audio\/x-m4a"],"f4v":["video\/x-f4v"],"flv":["video\/x-flv"],
    "webm":["video\/webm"],"aac":["audio\/x-acc"],"m4u":["application\/vnd.mpegurl"],
    "pdf":["application\/pdf","application\/octet-stream"],
    "pptx":["application\/vnd.openxmlformats-officedocument.presentationml.presentation"],
    "ppt":["application\/powerpoint","application\/vnd.ms-powerpoint","application\/vnd.ms-office",
    "application\/msword"],"docx":["application\/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    "xlsx":["application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application\/vnd.ms-excel"],
    "xl":["application\/excel"],"xls":["application\/msexcel","application\/x-msexcel","application\/x-ms-excel",
    "application\/x-excel","application\/x-dos_ms_excel","application\/xls","application\/x-xls"],
    "xsl":["text\/xsl"],"mpeg":["video\/mpeg"],"mov":["video\/quicktime"],"avi":["video\/x-msvideo",
    "video\/msvideo","video\/avi","application\/x-troff-msvideo"],"movie":["video\/x-sgi-movie"],
    "log":["text\/x-log"],"txt":["text\/plain"],"css":["text\/css"],"html":["text\/html"],
    "wav":["audio\/x-wav","audio\/wave","audio\/wav"],"xhtml":["application\/xhtml+xml"],
    "tar":["application\/x-tar"],"tgz":["application\/x-gzip-compressed"],"psd":["application\/x-photoshop",
    "image\/vnd.adobe.photoshop"],"exe":["application\/x-msdownload"],"js":["application\/x-javascript"],
    "mp3":["audio\/mpeg","audio\/mpg","audio\/mpeg3","audio\/mp3"],"rar":["application\/x-rar","application\/rar",
    "application\/x-rar-compressed"],"gzip":["application\/x-gzip"],"hqx":["application\/mac-binhex40",
    "application\/mac-binhex","application\/x-binhex40","application\/x-mac-binhex40"],
    "cpt":["application\/mac-compactpro"],"bin":["application\/macbinary","application\/mac-binary",
    "application\/x-binary","application\/x-macbinary"],"oda":["application\/oda"],
    "ai":["application\/postscript"],"smil":["application\/smil"],"mif":["application\/vnd.mif"],
    "wbxml":["application\/wbxml"],"wmlc":["application\/wmlc"],"dcr":["application\/x-director"],
    "dvi":["application\/x-dvi"],"gtar":["application\/x-gtar"],"php":["application\/x-httpd-php",
    "application\/php","application\/x-php","text\/php","text\/x-php","application\/x-httpd-php-source"],
    "swf":["application\/x-shockwave-flash"],"sit":["application\/x-stuffit"],"z":["application\/x-compress"],
    "mid":["audio\/midi"],"aif":["audio\/x-aiff","audio\/aiff"],"ram":["audio\/x-pn-realaudio"],
    "rpm":["audio\/x-pn-realaudio-plugin"],"ra":["audio\/x-realaudio"],"rv":["video\/vnd.rn-realvideo"],
    "jp2":["image\/jp2","video\/mj2","image\/jpx","image\/jpm"],"tiff":["image\/tiff"],
    "eml":["message\/rfc822"],"pem":["application\/x-x509-user-cert","application\/x-pem-file"],
    "p10":["application\/x-pkcs10","application\/pkcs10"],"p12":["application\/x-pkcs12"],
    "p7a":["application\/x-pkcs7-signature"],"p7c":["application\/pkcs7-mime","application\/x-pkcs7-mime"],"p7r":["application\/x-pkcs7-certreqresp"],"p7s":["application\/pkcs7-signature"],"crt":["application\/x-x509-ca-cert","application\/pkix-cert"],"crl":["application\/pkix-crl","application\/pkcs-crl"],"pgp":["application\/pgp"],"gpg":["application\/gpg-keys"],"rsa":["application\/x-pkcs7"],"ics":["text\/calendar"],"zsh":["text\/x-scriptzsh"],"cdr":["application\/cdr","application\/coreldraw","application\/x-cdr","application\/x-coreldraw","image\/cdr","image\/x-cdr","zz-application\/zz-winassoc-cdr"],"wma":["audio\/x-ms-wma"],"vcf":["text\/x-vcard"],"srt":["text\/srt"],"vtt":["text\/vtt"],"ico":["image\/x-icon","image\/x-ico","image\/vnd.microsoft.icon"],"csv":["text\/x-comma-separated-values","text\/comma-separated-values","application\/vnd.msexcel"],"json":["application\/json","text\/json"]}';
    $all_mimes = json_decode($all_mimes,true);
    foreach ($all_mimes as $key => $value) {
        if(array_search($mime,$value) !== false) return $key;
    }
    return false;
}
	function wrap_email($message)
	{
		
		$message="
		<html>
		<head>
			<title>GreatBoox</title>
        	<link rel='shortcut icon' href='".BASEURL."img/usefull/booklogo.png'>
		</head>
		<body  style='padding:0px; margin:0px; background:#f7f8f9;'>
			<table width='100%' border='0' style='padding:0px; margin:0px;'>
    			<tr>
        			<td width='100%'>
                		<table width='100%' style='padding:0px; font-family:verdana, arial; font-size:12px; color:#444;' border='0' cellpadding='0' cellspacing='0' bgcolor='#f7f8f9' align='center'>
							<tr style='background:#f7f8f9'>
								<td style='padding:10px 80px; font-size:16px; text-align:left'>
									<p style='text-align:center; font-size:10px;'>If you can't see this email <a href='".BASEURL."' style='color:#3776ea'>click here.</a></p>
									<a href='".BASEURL."' style='color:#fff;'><img src=".IMAGEURL."mplogo.png style='width:200px' /></a>
								</td>
							</tr>
							".$message."	
						</table>
	                </td>
            	</tr>
        	</table>
		</body>
		</html>
		";
			
		return $message;
		
	}
	
	function email_alert($from,$to, $subject, $message)
	{
$message="
<html>
		<head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
			<title>GreatBoox</title>
        	<link rel='shortcut icon' href='".BASEURL."img/usefull/booklogo.png'>
		</head>
		<body  style='padding:0px; margin:0px; background:#f7f8f9;'>
			<table width='100%' border='0' style='padding:0px; margin:0px;'>
    			<tr>
        			<td width='100%'>
                		<table width='100%' style='padding:0px; font-family:verdana, arial; font-size:12px; color:#444;' border='0' cellpadding='0' cellspacing='0' bgcolor='#f7f8f9' align='center'>
							<tr style='background:#f7f8f9'>
								<td style='padding:10px 80px; font-size:16px; text-align:left'>
									<p style='text-align:center; font-size:10px;'>If you can't see this email <a href='".BASEURL."' style='color:#3776ea'>click here.</a></p>
									<a href='".BASEURL."' style='color:#fff;'><img src=".IMAGEURL."mplogo.png style='width:200px' /></a>
								</td>
							</tr>
							".$message."	
							
							<tr>
								<td colspan='2' style='padding:20px 10px; text-align:center'>
									<div style='padding:30px 0; float:left; text-align:center; width:100%;'>
										<h2 style='color:#3776ea; font-weight:bold; text-align:center; width:100%'>Stay up tp date and socialize with us</h2>
										<img src='".EMAILURL."social.png' />
										<p style='text-align:center'>
										Please do not reply to this email<br /> 
										If you wish to unsubscribe <a style='color:#3776ea; text-decoration:none;'>click here</a>. <br />
										51 Ben Gurion st. Hod Hasharon, Israel<br />
										GreatBoox ltd. <br />
										<a style='color:#3776ea; text-decoration:none;' href='https://www.greatboox.com'>www.greatboox.com</a><br />
										View our <a style='color:#3776ea; text-decoration:none;' href='#'>privacy policy</a>.
										</p>
									</div>
								</td>
							</tr>
						</table>
	                </td>
            	</tr>
        	</table>
		</body>
		</html>
		";
		require 'phpmailer/PHPMailerAutoload.php';
 
		$mail = new PHPMailer;
		 
		$mail->isSMTP();    
		$mail->SMTPOptions = array(
			'ssl' => array(
				'verify_peer' => false,
				'verify_peer_name' => false,
				'allow_self_signed' => true
			)
		);                                  // Set mailer to use SMTP
		$mail->Host = 'Localhost';                       // Specify main and backup server
		$mail->SMTPAuth = true;                               // Enable SMTP authentication
		$mail->Username = $from.'@greatboox.com';                   // SMTP username
		$mail->Password = 'greatboox@123';               // SMTP password
		$mail->setFrom($from.'@greatboox.com', 'GreatBoox');     //Set who the message is to be sent from
		$mail->addReplyTo($from.'@greatboox.com', 'GreatBoox');  //Set an alternative reply-to address
		$mail->addAddress($to);               // Name is optional
		$mail->isHTML(true);                                  // Set email format to HTML
		 
		$mail->Subject = $subject;
		$mail->Body    = $message;
		$mail->AltBody = $message;
		 
		if(!$mail->send()) {
		   echo 'Message could not be sent.';
		   echo 'Mailer Error: ' . $mail->ErrorInfo;
		   exit;
		}
		return "Please Check Your Email";
	}
function replacequote($str)
{
	return str_replace("'", "\'",$str);
}
function hebrew($string)
{
	$str=preg_match("/\p{Hebrew}/u", $string);
	if($str=0)
	{
		return $string;
	}
	else
	{
	}
}
function makeLinks($str) {
	$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
	$reg_exUrl1 = "/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
	$urls = array();
	$urlsToReplace = array();
	if(preg_match_all($reg_exUrl, $str, $urls)) {
		$numOfMatches = count($urls[0]);
		$numOfUrlsToReplace = 0;
		for($i=0; $i<$numOfMatches; $i++) {
			$alreadyAdded = false;
			$numOfUrlsToReplace = count($urlsToReplace);
			for($j=0; $j<$numOfUrlsToReplace; $j++) {
				if($urlsToReplace[$j] == $urls[0][$i]) {
					$alreadyAdded = true;
				}
			}
			if(!$alreadyAdded) {
				array_push($urlsToReplace, $urls[0][$i]);
			}
		}
		$numOfUrlsToReplace = count($urlsToReplace);
		for($i=0; $i<$numOfUrlsToReplace; $i++) {
			$str = str_replace($urlsToReplace[$i], '<a target="_new" onclick="setloader(\''.$urlsToReplace[$i].'\')" href="javascript:void(0)">'.$urlsToReplace[$i].'</a> ', $str);
		}
		return $str;
	} 
	else if(preg_match_all($reg_exUrl1, $str, $urls)) {
		$numOfMatches = count($urls[0]);
		$numOfUrlsToReplace = 0;
		for($i=0; $i<$numOfMatches; $i++) {
			$alreadyAdded = false;
			$numOfUrlsToReplace = count($urlsToReplace);
			for($j=0; $j<$numOfUrlsToReplace; $j++) {
				if($urlsToReplace[$j] == $urls[0][$i]) {
					$alreadyAdded = true;
				}
			}
			if(!$alreadyAdded) {
				array_push($urlsToReplace, $urls[0][$i]);
			}
		}
		$numOfUrlsToReplace = count($urlsToReplace);
		for($i=0; $i<$numOfUrlsToReplace; $i++) {
			$str = str_replace($urlsToReplace[$i], '<a target="_new" onclick="setloader(\''.$urlsToReplace[$i].'\')" href="javascript:void(0)">'.$urlsToReplace[$i].'</a> ', $str);
		}
		return $str;
	} 
	else {
		return $str;
	}
	
}

function copy_file($source,$destination)
{
	$page_extra_character=str_replace('../','',$destination);
	if (file_exists($destination)) 
	{
	} 
	else
	{
		if( !copy($source, $destination) ) { 
			//echo "Not coppied ".$source.' '. $destination."<br>"; 
			return false;
		} 
		else { 
			return $destination;
		} 
	}
	
}

function get_image_base64($img)
{
	$img = file_get_contents($img);
	return $data = 'data:image/png;base64,'.base64_encode($img);
}
class MetaData implements Iterator {
	private $_values = array();
	static public function fetch($URI) {
		$curl = curl_init($URI);
		curl_setopt($curl, CURLOPT_FAILONERROR, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 15);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        $response = curl_exec($curl);
        curl_close($curl);
		if(!empty($response)) {
			return self::_parse($response);
		}
		else {
			return false;
        }
	}
	/**
	* Parses HTML and extracts meta tags
	*
	* @param $HTML    HTML to parse
	* @return MetaData
	*/
	static private function _parse($HTML) {
		$page = new self();
		$rawTags = array();
		preg_match_all("|<meta[^>]+=\"([^\"]*)\"[^>]" . "+content=\"([^\"]*)\"[^>]+>|i", $HTML, $rawTags, PREG_PATTERN_ORDER);
		if(!empty($rawTags)) {
			$multiValueTags = array_unique(array_diff_assoc($rawTags[1], array_unique($rawTags[1])));
			for($i=0; $i < sizeof($rawTags[1]); $i++) {
				$hasMultiValues = false;
				$tag = $rawTags[1][$i];
				foreach($multiValueTags as $mTag) {
					if($tag == $mTag)
						$hasMultiValues = true;
				}
				
				if($hasMultiValues) {
					$page->_values[$tag][] = $rawTags[2][$i];
				}
				else {
					$page->_values[$tag] = $rawTags[2][$i];
				}
			}
		}
		if (empty($page->_values)) { return false; }
		return $page;
	}
	/**
	* Helper method to access attribute array directly
	*/
	public function tags() {
		return $this->_values;
	}
	/**
	* Helper method to access attributes directly
	* Example:
	* $metaData->title
	*
	* @param $key    Key to fetch from the lookup
	*/
	public function __get($key) {
		if (array_key_exists($key, $this->_values)) {
			return $this->_values[$key];
		}
	}
	/**
	* Return all the keys found on the page
	*
	* @return array
	*/
	public function keys() {
		return array_keys($this->_values);
	}
	/**
	* Helper method to check an attribute exists
	*
	* @param $key
	*/
	public function __isset($key) {
		return array_key_exists($key, $this->_values);
	}
	/**
	* Iterator code
	*/
	private $_position = 0;
	public function rewind() { reset($this->_values); $this->_position = 0; }
	public function current() { return current($this->_values); }
	public function key() { return key($this->_values); }
	public function next() { next($this->_values); ++$this->_position; }
	public function valid() { return $this->_position < sizeof($this->_values); }
}
function getmetadata($link)
{
	preg_match_all("|www.youtube.com|i", $link, $pattern, PREG_PATTERN_ORDER);
	preg_match_all("|youtu.be|i", $link, $pattern1, PREG_PATTERN_ORDER);
	preg_match_all("|youtube.com|i", $link, $pattern2, PREG_PATTERN_ORDER);
	preg_match_all("|www.youtu.be|i", $link, $pattern3, PREG_PATTERN_ORDER);
	if(count($pattern[0])>0 || count($pattern1[0])>0 || count($pattern2[0])>0 || count($pattern3[0])>0)
	{
		$youtubelinks=explode('/',$link);
		$yl=explode('=',$youtubelinks[3]);
		if(count(@$yl[1])>0)
		{
			$yl1=explode('&',$yl[1]);
			if(count(@$yl1[0])>0)
			{
				
				$youtlink=@$yl1[0];
			}
			else
			{
				$youtlink=@$yl[1];
			}
			
		}
		else
		{
			$youtlink=@$youtubelinks[3];
		}

		$curl1 = curl_init("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=".$youtlink."&fields=items%2Fsnippet%2Ftitle%2Citems%2Fsnippet%2Fdescription&key=AIzaSyCO5lIc_Jlrey0aroqf1cHXVF1MUXLNuR0");
		curl_setopt($curl1, CURLOPT_FAILONERROR, true);
        curl_setopt($curl1, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl1, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl1, CURLOPT_TIMEOUT, 15);
        curl_setopt($curl1, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl1, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl1, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        
		$response1 = curl_exec($curl1);
		$err = curl_error($curl1);
		
		curl_close($curl1);
		
		if ($err) {
			$image='http://img.youtube.com/vi/'.$youtlink.'/hqdefault.jpg';
			$title='';
			$description='';
			
		} 
		else 
		{
		  	$result=json_decode($response1,true);
		  
			$title=$result['items'][0]['snippet']['title'];
			$description=$result['items'][0]['snippet']['description'];
			$image='http://img.youtube.com/vi/'.$youtlink.'/hqdefault.jpg';
		}
	}
	else
	{
		$meta=MetaData::fetch($link);
		$metadata=array();
		foreach($meta as $key=>$value)
		{
			$metadata[$key]=$value;
		}
		$title=$description=$image=$fbid='';
		$metatag = get_meta_tags($link);
		foreach($metatag as $key=>$value)
		{
			$metadata[$key]=$value;
		}
		if($metadata!='')
		{	
			foreach ($metadata as $key => $value) 
			{
				//echo "$key=>$value<br>";
				if($key=='description')
				{
					if($description=='')
					{
						if(is_array($value))
						{
							$description=$value[0];
						}
						else
						{
							$description=$value;
						}
					}
				}
				else if($key=='Description')
				{
					if($description=='')
					{
						if(is_array($value))
						{
							$description=$value[0];
						}
						else
						{
							$description=$value;
						}
					}
				}
				else if($key=='og:description')
				{
					if($description=='')
					{
						if(is_array($value))
						{
							$description=$value[0];
						}
						else
						{
							$description=$value;
						}
					}
				}
				else if($key=='twitter:description')
				{
					if($description=='')
					{
						if(is_array($value))
						{
							$description=$value[0];
						}
						else
						{
							$description=$value;
						}
					}
				}
				if($key=='image')
				{
					if($image=='')
					{
						if(is_array($value))
						{
							$image=$value[0];
						}
						else
						{
							$image=$value;
						}
					}
				}
				else if($key=='image primaryImageOfPage')
				{
					if($image=='')
					{
						if(is_array($value))
						{
							$image=$value[0];
						}
						else
						{
							$image=$value;
						}
					}
				}
				else if($key=='og:image')
				{
					if($image=='')
					{
						if(is_array($value))
						{
							$image=$value[0];
						}
						else
						{
							$image=$value;
						}
					}
				}
				else if($key=='twitter:image')
				{
					if($image=='')
					{
						if(is_array($value))
						{
							$image=$value[0];
						}
						else
						{
							$image=$value;
						}
					}
				}
				
				if($key=='title name')
				{
					if($title=='')
					{
						if(is_array($value))
						{
							$title=$value[0];
						}
						else
						{
							$title=$value;
						}
					}
				}
				else if($key=='title')
				{
						if(is_array($value))
						{
							$title=$value[0];
						}
						else
						{
							$title=$value;
						}
				}
				else if($key=='twitter:title')
				{
					if($title=='')
					{
						if(is_array($value))
						{
							$title=$value[0];
						}
						else
						{
							$title=$value;
						}
					}
				}
				else if($key=='og:title' )
				{
					if($title=='')
					{
						if(is_array($value))
						{
							$title=$value[0];
						}
						else
						{
							$title=$value;
						}
					}
				}
				if($key=='al:android:url')
				{
					if($fbid=='')
					{
						if(is_array($value))
						{
							$value=str_replace('fb://profile/','',$value[0]);
							$fbid=$value;
						}
						else
						{
							$value=str_replace('fb://profile/','',$value);
							$fbid=$value;
						}
					}
				}
				else if($key=='al:ios:url')
				{
					if($fbid=='')
					{
						if(is_array($value))
						{
							$value=str_replace('fb://profile/','',$value[0]);
							$fbid=$value;
						}
						else
						{
							$value=str_replace('fb://profile/','',$value);
							$fbid=$value;
						}
					}
				}
			}
		}
	}
	if($title=='')
	{
		$title="Title not Available";
	}
	if($description=='')
	{
		$description="Description Not Available";
	}
	/*$curl = curl_init($link);
	curl_setopt($curl, CURLOPT_FAILONERROR, true);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 15);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
	$response = curl_exec($curl);
	curl_close($curl);
	if(!empty($response)) {
		preg_match('/"entity_id":(.*?)}/',$response,$matches);
		$fbid=$matches[1];
	}
	if($image!='')
	{
		$img = get_headers($image, 1);
		if($img["Content-Length"]>0)
		{
			$image=$image;
		}
		else
		{
			$image='';
		}
	}	
	if($image=='')
	{
		$image='';
	}*/
	return $image.',,$'.$title.',,$'.$description.',,$'.$fbid;
}

function notification($token,$messages,$link,$os)
{
	if($os=='ios')
	{
    define( 'FIREBASE_API_KEY', 'AAAARXhAC38:APA91bHlPjcLHxOFpG2es3suQ3BDRzWBTLWK4aHc0yUVKbg7TVW5AQh7AFMqfnVvsPIurIAhDCvGwDKtFidLp_qyWN9RGnQ2D7fJjKGWuUmlYIP6RNoH_f-UolZ1okCo50gTKen0389w' );
	}
	else
	{
		define( 'FIREBASE_API_KEY', 'AAAAdGX_35U:APA91bEf2O7ZOK-HFpJJYhS1qYjXKSwbSMyTab--wN5WnmE3yNCKNw5d_rXWr75V-Ut3VRPfFEJGoTYQ4Cmws4NUdzOrIFugzloA1LqrzudBsRreQzev6CgAtpgf6FWSwNV5HO0r0rQ0' );
	}
	$msg = array (
       	'msg'     => $messages,
    	'weblink'   => $link,
    	'item_id' => "1",
		
										
    );
 
$fields = array (
    'to' => $token,
    'data' => array('message' => $msg)
);
 
$headers = array (
    'Authorization: key=' . FIREBASE_API_KEY,
    'Content-Type: application/json'
);
 
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
    curl_setopt( $ch,CURLOPT_POST, true );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $result = curl_exec($ch );
    curl_close( $ch );
    "Result: ". $result;
}
function random_strings($num) 
{ 
  
    $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
  
    return substr(str_shuffle($str_result),  0, $num); 
} 
?>
