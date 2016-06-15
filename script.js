// https://developers.google.com/youtube/iframe_api_reference

// global variable for the player
var player;
var playing = false;
var totalSeconds = 0;
var duration = 0;
var counter;
var progress;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  
  //var playButton = document.getElementById("playButton");
  var play = document.getElementById("play");
  //var play = $("#play");
  duration = player.getDuration();
  var minute = Math.floor(duration / 60);
  var sekunde = Math.floor(duration % 60);
  $('#fulltime').html(minute + ":" + sekunde);
  $('#time').html("0:00");

  //var counter = setInterval(setTime, 1000);

  play.addEventListener("click", function() {
  	if(playing){
  		clearInterval(counter);
  		clearInterval(progress);
  		var time = convertSeconds();
  		$("#play").toggleClass('active');
  		//play.toggleClass('active');
  		player.pauseVideo();
  		playing = false;
  		$('#time').html(time[0] + ":" + time[1]);
  	}
  	else{
  		player.playVideo();
  		$("#play").toggleClass('active');
  		//play.toggleClass('active');
  		totalSeconds = Math.round(player.getCurrentTime());
      console.log(totalSeconds);
  		counter = setInterval(setTime, 1000);
  		progress = setInterval(updateProgress, 1000);
  		playing = true;
  	}
  });

  var volumeDrag = false;

	$('.volume').on('mousedown', function (e) {
	    volumeDrag = true;
	    //audio.muted = false;
	    $('.sound').removeClass('muted');
	    updateVolume(e.pageX);
	});

	$('.volume').on('mouseup', function (e) {
	    if (volumeDrag) {
	        volumeDrag = false;
	        updateVolume(e.pageX);
	    }
	});

	$('.volume').on('mousemove', function (e) {
	    if (volumeDrag) {
	        updateVolume(e.pageX);
	    }
	});

	var progressDrag = false;

	$('.progress').on('mousedown', function (e) {
	    progressDrag = true;
	    seekProgress(e.pageX);
	});

	$('.progress').on('mouseup', function (e) {
	    if (progressDrag) {
	        progressDrag = false;
	        seekProgress(e.pageX);
	    }
	});

	$('.progress').on('mousemove', function (e) {
	    if (progressDrag) {
	        seekProgress(e.pageX);
	    }
	});

	//player.seekTo(seconds:Number, allowSeekAhead:Boolean);
}

/*var setTime = function(){
    //++totalSeconds;
    var currentTime = Math.round(player.getCurrentTime());
  	var minutes = Math.floor(currentTime / 60);
  	var seconds = (currentTime % 60);
    //$('#time').html(minutes + ":" + seconds);
    $('#time').html(currentTime);
};*/

function setTime(){
	if(totalSeconds == duration){
		$("#play").toggleClass('active');
		clearInterval(counter);
    clearInterval(progress);
		playing = false;
		totalSeconds = -1;
    player.pauseVideo();
    player.seekTo(0, true);
	}
	++totalSeconds;
	var time = convertSeconds();
	$('#time').html(time[0] + ":" + time[1]);
}

var convertSeconds = function(){
	var minutes = Math.floor(totalSeconds / 60);
  	var seconds = (totalSeconds % 60);
  	if(seconds < 10){
  		seconds = "0" + seconds;
  	}
  	return [minutes, seconds];
};

var updateVolume = function (x, vol){
    var volume = $('.volume');
    var percentage;
    //if only volume have specificed
    //then direct update volume
    if (vol) {
        percentage = vol * 100;
    } else {
        var position = x - volume.offset().left;
        percentage = 100 * position / volume.width();
    }

    if (percentage > 100) {
        percentage = 100;
    }
    if (percentage < 0) {
        percentage = 0;
    }

    //update volume bar and video volume
    $('.volumeBar').css('width', percentage + '%');
    player.setVolume(percentage);
    //change sound icon based on volume
};

var updateProgress = function(){
	var progPercentage = (totalSeconds / duration) * 100;
	$('.progressBar').css('width', progPercentage + '%');
};

var seekProgress = function(pageX){
	var progress = $('.progress');
    var percentage;
   	var position = pageX - progress.offset().left;
    percentage = position / progress.width();

    $('.progressBar').css('width', percentage + '%');
    var seekTo = Math.round(percentage * duration);
    totalSeconds = seekTo;
    player.seekTo(seekTo, true);
};

/*player.seekTo(seconds:Number, allowSeekAhead:Boolean)
player.getCurrentTime()
player.getDuration()*/