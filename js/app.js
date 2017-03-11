var audio = new Audio("4d.wav"); //metronom sound
  var timer;  //Timer used to loop metronom sound
  var hitsleft; // global variable to remember and display hits left with the current speed
  var currentSpeed; //global variable to rembember current speed of metronom
  var mode; // (Acceleration || Slow down || Cycle) used to remember users choice and initialize Metronom object later
  var Metronom; //Object used to remember users preferences
  var raising; //flag used for playing cycle, true means it speed's up
  $("#OPTIONPANEL").hide(); //Hiding option panel until user choose mode
  $("#BUTTONPANEL").hide();//Hiding button panel until user chooses mode
  function displayOption(mod){ //displays options after users choose mode
    mode = mod;
    $("#OPTIONPANEL").show();
    switch(mod){
      case "acc":
        $("#modedescr").text("Tryb:przyspieszenie");
        $("#tempo1").text("Ustaw tempo początkowe:");
        $("#tempo2").text("Ustaw górną granice:");
        break;
      case "slow":
        $("#modedescr").text("Tryb:spowolnienie");
        $("#tempo1").text("Ustaw tempo początkowe:");
        $("#tempo2").text("Ustaw dolną granicę:");
        break;
      case "cycle":
        $("#modedescr").text("Tryb:cykl");
        $("#tempo1").text("Ustaw granicę dolną:");
        $("#tempo2").text("Ustaw granicę górną:");
        break;
    }
    $("#BUTTONPANEL").show();
  };
  function play(){
    Metronom = getInput();
    if(checkInput(Metronom)==true){
      hitsleft = Metronom.introLength;
      currentSpeed = Metronom.startSpeed;
      $("#START").hide();
      timer = window.setInterval(playIntro,bmpToMs(currentSpeed));
      $("#STOP").show();
    }
  };
  function playIntro(){//plays intro and starts proper mode when finished
    if(hitsleft<=1){
      if(hitsleft==1){
        document.getElementById("CURRENTTEMPO").innerHTML = currentSpeed;
        document.getElementById("HITSLEFT").innerHTML = hitsleft;
        audio.pause();//stopping previous play
        audio.src = "";
        audio.src = "4d.wav";
        audio.play();
      }
      hitsleft = Metronom.hitsPerSpeed;
      window.clearInterval(timer);
      switch(Metronom.mode){
      case "acc":
        timer = window.setInterval(playAcc,bmpToMs(currentSpeed));
        break;
      case "slow":
        timer = window.setInterval(playSlow,bmpToMs(currentSpeed));
        break;
      case "cycle":
        raising = true;
        timer = window.setInterval(playCycle,bmpToMs(currentSpeed));
        break;
      }
    }
    else{
      document.getElementById("CURRENTTEMPO").innerHTML = currentSpeed;
      document.getElementById("HITSLEFT").innerHTML = hitsleft;
      audio.pause();//stopping previous play
      audio.src = "";
      audio.src = "4d.wav";
      audio.play();
      hitsleft--;
    }
  };
  function playAcc(){
    document.getElementById("CURRENTTEMPO").innerHTML = currentSpeed;
    document.getElementById("HITSLEFT").innerHTML = hitsleft;
    audio.pause();//stopping previous play
    audio.src = "";
    audio.src = "4d.wav";
    audio.play();
    if(hitsleft==1){
      hitsleft = Metronom.hitsPerSpeed;
      if(currentSpeed+Metronom.jump <= Metronom.endSpeed){
        currentSpeed += Metronom.jump;
      }
      window.clearInterval(timer);
      timer = window.setInterval(playAcc,bmpToMs(currentSpeed));
    }
    else{
      hitsleft--;
    }
  }
  function playSlow(){
    document.getElementById("CURRENTTEMPO").innerHTML = currentSpeed;
    document.getElementById("HITSLEFT").innerHTML = hitsleft;
    audio.pause();//stopping previous play
    audio.src = "";
    audio.src = "4d.wav";
    audio.play();
    if(hitsleft==1){
      hitsleft = Metronom.hitsPerSpeed;
      if(currentSpeed-Metronom.jump >= Metronom.endSpeed){
        currentSpeed -= Metronom.jump;
      }
      window.clearInterval(timer);
      timer = window.setInterval(playSlow,bmpToMs(currentSpeed));
    }
    else{
      hitsleft--;
    }
  };
  function playCycle(){
    document.getElementById("CURRENTTEMPO").innerHTML = currentSpeed;
    document.getElementById("HITSLEFT").innerHTML = hitsleft;
    audio.pause();//stopping previous play
    audio.src = "";
    audio.src = "4d.wav";
    audio.play();
    if(hitsleft==1){
      hitsleft = Metronom.hitsPerSpeed;
      if(raising==true){
        if(currentSpeed+Metronom.jump <= Metronom.endSpeed){
          currentSpeed += Metronom.jump;
        }
        else if(currentSpeed-Metronom.jump >= Metronom.startSpeed){
          raising=false;
          currentSpeed -=Metronom.jump;
        }
      }
      else{
        if(currentSpeed-Metronom.jump >= Metronom.startSpeed){
          currentSpeed -= Metronom.jump;
        }
        else if(currentSpeed+Metronom.jump <= Metronom.endSpeed){
          raising=true;
          currentSpeed +=Metronom.jump;
        }
      }
      window.clearInterval(timer);
      timer = window.setInterval(playCycle,bmpToMs(currentSpeed));
    }
    else{
      hitsleft--;
    }
  };
  function bmpToMs(bpm){
    return 60000/bpm;
  }
  function stop(){
    window.clearInterval(timer);
    $("#START").show();
  }
  function getInput(){
    var Metronom = {
      mode:mode,
      startSpeed:Number(getStartSpeed()),
      jump:Number(getJump()),
      endSpeed:Number(getEndSpeed()),
      hitsPerSpeed:Number(getHitsPerSpeed()),
      introLength:Number(getIntroLength()),
    };
    return Metronom;
  };
  function getStartSpeed(){
    return document.getElementById("startspeed").value;
  }
  function getJump(){
    return document.getElementById("jump").value;
  }
  function getEndSpeed(){
    return document.getElementById("endspeed").value;
  }
  function getHitsPerSpeed(){
    return document.getElementById("hitsperspeed").value;
  }
  function getIntroLength(){
    return document.getElementById("introlength").value;
  }
  function checkInput(Metronom){
    if(Metronom.startSpeed < 20 || Metronom.startSpeed > 210){
      return false;
    }
    if(Metronom.jump <0 || Metronom.jump > 100){
      return false;
    }
    if(Metronom.endSpeed < 20 || Metronom.endSpeed > 210){
      return false;
    }
    if(Metronom.hitsPerSpeed < 1){
      return false;
    }
    if(Metronom.introLength < 0){
      return false;
    }
    if(Metronom.mode=="acc"){
      if(Metronom.startSpeed > Metronom.endSpeed){
        return false;
      }
    }
    if(Metronom.mode=="slow"){
      if(Metronom.startSpeed < Metronom.endSpeed){
        return false;
      }
    }
    if(Metronom.mode=="cycle"){
      if(Metronom.startSpeed > Metronom.endSpeed){
        return false;
      }
    }
    return true;
  };