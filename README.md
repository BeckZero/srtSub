# srtSub: HTML5 Video with single/dual SRT Subtitles.

(Sorry for my bad English).

## Features ##
  * Single/Dual subtitles.
  * Working Alone or with Videojs, etc. 
  * Subtitle selector button.
  * Filter and remplace.
  * Work on fullscreen.
  *	Responsive.
  * No outside dependencies.

## Examples ##

### simple(without configuration) ###

	<!DOCTYPE html>
	<html>
	<head> 
		<link rel="stylesheet" type="text/css" href="srtsub.css">
		<script type="text/javascript" src="srtsub.js"></script> 
	</head>
	<body>  
		<video id="myVideo"  controls preload="auto" width="850" height="364">
			<source src="video.mp4" type='video/mp4'>  
			<track src="english.srt" kind="subtitle" label="English" />
		</video>  
		<script type="text/javascript">  
	  		srtSub.config(); 
		</script> 
	</body>
	</html> 

### simple ###
 
	<video id="myVideo"  controls preload="auto" width="850" height="364">
		<source src="video.mp4" type='video/mp4'>   
	</video>  
	<script type="text/javascript">  
		var configuration = {
			videoID : 'myVideo', 
			subtitles:[
						{
							url:'english.srt', 
							label:'English',
							default:true
						},
						{
							url:'france.srt', 
							label:'France'
						},
						{
							url:'spanish.srt', 
							label:'Spanish'
						}

					]
		}
	  	srtSub.config(configuration);
	</script>  

## Full configuration ##

	<video id="myVideo"  controls preload="auto" width="850" height="364">
		<source src="video.mp4" type='video/mp4'>  
	</video>  
	<script type="text/javascript"> 
		var configuration = {
			videoID : 'myVideo', 
			fontSize : 16, // minimus size.
			filter : ['pokemon','fuc* ***','chubaca'], // filter and...
			replaceF : 'gol', // replace. 
			subtitles:[
						{
							url:'english.srt', 
							label:'English',
							default:true // dual subtitles
						},
						{
							url:'france.srt', 
							label:'France'
							default:true // dual subtitles
						},
						{
							url:'spanish.srt', 
							label:'Spanish'
						}

					]
		}
	  	srtSub.config(configuration); 
  	</script> 

## srtSub + Videjs ## 
	var configuration = { 
						/* OptionsSrtSub */ 
						/* Or... noting */
						}	
	videojs('really-cool-video', { /* OptionsVideojs */ }, function() {
		srtSub.config(configuration);
	});
 