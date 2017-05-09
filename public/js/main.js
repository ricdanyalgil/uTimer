let timer = new Timer();
let timerLap = new Timer();
let preTimer = new Timer();

var units = ['minutes', 'seconds'];
var separator = ':';
var leftZeroPadding = 2;

let lapCounter = 0;
let tempoTotal = 0;
let tempoVoltas = 0;

var countdownSound = new Audio('assets/tink.wav');
var startSound = new Audio ('assets/beep.wav');
var audioFimContador = new Audio ('assets/end.wav');
var lapSound = new Audio ('assets/lap.mp3');

let isEtapaFinal = false;
let isCountdown;
let isLivre;
let isTabata;
let tempoDescansoTabata = false;
let isEscuro = true;

let campoTempoVoltas = $('#campoTempoVoltas');
let campoTempoTotal = $('#campoTempoTotal');

let pauseButton = document.getElementById('btn-pause');
let resumeButton = document.getElementById('btn-play');
let radioLivre = document.getElementById('radioLivre');
let radioCountdown = document.getElementById('radioCountdown');
let radioCronometro = document.getElementById('radioCronometro');
let radioTabata = document.getElementById('radioTabata');
let switchTema = document.getElementById('switchTema');

let backgroundUrl = document.getElementById('backgroundUrl');
backgroundUrl.addEventListener ('blur', alterarBackgroundPorUrl);

$('#back-img').click(function(e) {
  $('#modalBackgroundContent').modal('open');
});

function alterarBackgroundPorSelect(imgSrc) {
  $('#back-img').val($('#selectImage option:selected').html());
  localStorage.setItem("valorCampoImagemBackground", $('#back-img').val());

  $('body').css('background-image', "url("+imgSrc+")");
  if (suportaLocalStorage()) {
    localStorage.setItem("backgroundImgUrl", imgSrc);
    console.log('Imagem salva no local storage')
  }else {
    console.log('Não suporta localStorages');
  }
}

function alterarBackgroundPorUrl() {
let imgUrl = $('#backgroundUrl').val();

$('#back-img').val($('#backgroundUrl').val());
localStorage.setItem("valorCampoImagemBackground", $('#back-img').val());

  $('body').css('background-image', "url("+imgUrl+")");

  if (suportaLocalStorage()) {
    localStorage.setItem("backgroundImgUrl", imgUrl);
    console.log('Imagem de background salva!');
  } else {
    console.log('Não suporta localStorage')
  }
}

function suportaLocalStorage () {
  console.log('Suporta local storage');
  return (typeof(Storage) !== "undefined");
}


function limparBackground (){
    $('body').css('background-image', '');
    localStorage.setItem("backgroundImgUrl", backgroundUrl.value);
    console.log('Sem imagem de background!')
}


//Listeners dos botões
radioTabata.addEventListener('click', esconderOpcoesTempo);
radioCronometro.addEventListener('click', showSelecaoTempo);
radioCountdown.addEventListener('click', showSelecaoTempo);
radioLivre.addEventListener('click', esconderSelecaoTempoVoltas);
pauseButton.addEventListener('click', pauseButtonClick);
resumeButton.addEventListener('click', resumeButtonClick);
switchTema.addEventListener('click', alterarTema);

function esconderOpcoesTempo () {
  campoTempoVoltas.hide();
  campoTempoTotal.hide();
}

function showSelecaoTempo () {
  campoTempoVoltas.show();
  campoTempoTotal.show();
}

function esconderSelecaoTempoVoltas () {
  campoTempoVoltas.hide();
}

function alterarTema () {
  var currentColor = $('body').css('color'); //Pega a cor atual do

  if (isEscuro) { //Se a cor estiver escura
    isEscuro = false;
    if ($('#seconds').hasClass('texto-preto')) {
        $('#seconds').removeClass('texto-preto');
        $('#contador').removeClass('texto-preto');
      }
    $('#seconds').addClass('texto-branco');
    $('#contador').addClass('texto-branco');

  } else {

    isEscuro = true;
    if($('#seconds').hasClass('texto-branco')) {
        $('#seconds').removeClass('texto-branco');
        $('#contador').removeClass('texto-branco')
      }
    $('#seconds').addClass('texto-preto');
    $('#seconds').addClass('texto-preto');
  }

    onTemaAlterado();
}

function onTemaAlterado () {
  if(suportaLocalStorage()) {
    localStorage.setItem("temaEscolhido", isEscuro);
    console.log('Tema salvo');
  } else {
    console.log('Não suporta localStorage');
  }
}

//listener do tempo total
$('#select-tempo').on('change', function(e) {
  if ($('#select-tempo option:selected').is(':last-child')) {
    swal({
      title: "Olá",
      text: "Escolha o tempo total desejado em minutos",
      type: "input",
      inputType: 'number',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Digite o valor",
      confirmButtonColor: "#388E3C"
    },
    function(inputValue){
      if (inputValue === false) return false;
      if (inputValue<1) {
        swal.showInputError('O tempo total não pode ser menor que 0');
        return false;
      }
      if (inputValue === "") {
        swal.showInputError("Você precisa escrever algo");
        return false
      }
      swal({
        title: "Okay!",
        text: "Tempo escolhido: " + inputValue,
        type: "success",
        timer: 2000,
        showConfirmButton: false
      });
        tempoTotal = (parseInt(inputValue));
        selectTempo = document.getElementById('select-tempo');
        selectTempo.options[selectTempo.selectedIndex].value = inputValue;
        if (inputValue > 1 ) {
          selectTempo.options[selectTempo.selectedIndex].text = 'Outro (' + inputValue + ' minutos)';
        }else {
          selectTempo.options[selectTempo.selectedIndex].text = 'Outro (' + inputValue + ' minuto)';
        }
        $(document).ready(function(){
          $('select').material_select();
        });
    });
  } else {
    tempoTotal = (parseInt($('#select-tempo option:selected').text()));
  }
});

//listener do tempo das voltas
$('#select-tempo-voltas').on('change', function(e) {
  if ($('#select-tempo-voltas option:selected').is(':last-child')) {
    swal({
      title: "Olá",
      text: "Escolha o tempo de volta desejado em segundos",
      type: "input",
      inputType: 'number',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "Digite o valor",
      confirmButtonColor: "#388E3C"
    },
    function(inputValue){
      if (inputValue === false) return false;
      if (inputValue<1) {
        swal.showInputError('O tempo total não pode ser menor que 0');
        return false;
      }

      if (inputValue === "") {
        swal.showInputError("Você precisa escrever algo");
        return false
      }

      swal({
        title: "Okay!",
        text: "Tempo escolhido: " + inputValue,
        type: "success",
        timer: 2000,
        showConfirmButton: false
      });
      tempoVoltas = (parseInt(inputValue));
      selectTempoVoltas = document.getElementById('select-tempo-voltas');
      selectTempoVoltas.options[selectTempoVoltas.selectedIndex].value = inputValue;
      if (inputValue > 1 ) {
        selectTempoVoltas.options[selectTempoVoltas.selectedIndex].text = 'Outro (' + inputValue + ' segundos)';
      }else {
        selectTempoVoltas.options[selectTempoVoltas.selectedIndex].text = 'Outro (' + inputValue + ' segundos)';
      }
      $(document).ready(function(){
        $('select').material_select();
      });
    });
  } else {
    tempoVoltas = (parseInt($('#select-tempo-voltas option:selected').text()));
  }
});


  function acaoAbrirModal(){
  if ((timer.isRunning() || timerLap.isRunning()) || (timer.isPaused() || timerLap.isPaused())) { //Esconde o conteúdo do modal caso o timer já esteja rodando ou esteja parado, porém, pausado
    $('.modal-content').hide();
    $('#btn-start').hide();
    $('#btn-zerar').show();
  }else if (!timer.isPaused() && !timer.isRunning() ){
    addFields(); //Adiciona os campos aos selects caso o timer não esteja rodando
    $('.modal-content').show();
    $('#btn-start').show();
    $('#btn-zerar').hide();
  }
}

  function onModalClose() {
    //TODO
  }


//Função Que adiciona os valores de tempo ao Select
function addFields() {
  const opcoesTempo = [1,3,5,10,15,20,30,40,60, 'Outro']; //Minutos para o tempo total
  const opcoesVolta = [10,15,20,30,45,60,90, 'Outro']; //Segundos para o tempo da volta

    selectTempo = document.getElementById('select-tempo');
    selectTempoVoltas = document.getElementById('select-tempo-voltas');
    ///Remove todos os elementos dos selects caso já existam (Para evitar que tenham opções repetidas)
    while (selectTempo.hasChildNodes()){
      selectTempo.removeChild(selectTempo.lastChild);
    }
    while (selectTempoVoltas.hasChildNodes()){
      selectTempoVoltas.removeChild(selectTempoVoltas.lastChild);
    }

  for (var i=0; i<opcoesTempo.length; i++){
      var opt = document.createElement('option');
      opt.value = opcoesTempo[i];
      if (opcoesTempo[i] === 1) {
        opt.innerHTML = opcoesTempo[i] + ' minuto';
      }else if (opcoesTempo[i] > 1) {
        opt.innerHTML = opcoesTempo[i] + ' minutos';
      }else
        opt.innerHTML = opcoesTempo[i];
      selectTempo.appendChild(opt);
  }
  for (var i=0; i<opcoesVolta.length; i++){
      var opt = document.createElement('option');
      opt.value = opcoesVolta[i];
      if (isNaN(opcoesVolta[i])) {
          opt.innerHTML = opcoesVolta[i];
      } else {
        opt.innerHTML = opcoesVolta[i] + ' segundos';
      }
      selectTempoVoltas.appendChild(opt);
  }

  $(document).ready(function(){ //reinicializa o select com os valores passados
     $('select').material_select();
  });
} /// Final addFields();


function preIniciarContador() {
  if($('#radioCountdown').is(':checked')) { //Definindo se o Contador será Crescente ou Descrescente
    isCountdown = true;
  }else {
    isCountdown = false;
  }

  if ($('#radioLivre').is(':checked')) {
    isLivre = true;
  }else {
    isLivre = false;
  }

  if ($('#radioTabata').is(':checked')) {
    isTabata = true;
  } else {
    isTabata = false;
  }

  $('#btn-config').hide();
  preTimer.start({countdown: true, startValues: {seconds: 3}, callback: function(){ //Inicia o pre Contador
    if (preTimer.getTotalTimeValues().seconds==0) {
      startSound.play();
    }else {
      countdownSound.play();
    }
  }
  });

  $('#seconds').addClass('texto-vermelho');
  $('#seconds .values').html(preTimer.getTimeValues().toString(['seconds'], '', 1));
  preTimer.addEventListener('secondsUpdated', function (e) {
      $('#seconds .values').html(preTimer.getTimeValues().toString(['seconds'], '', 1));
  });
}

//targetAchieved referente ao pre contador
preTimer.addEventListener('targetAchieved', function (e) { //Ações tomadas no final do pre Inicio
  $('#btn-config').show();
  $('#seconds').removeClass('texto-vermelho')
  if (isEscuro) {
    $('#seconds').addClass('texto-preto');
  } else {
    $('#seconds').addClass('texto-branco');
  }

  preTimer.stop();
  if (isLivre) {
    toggleButtons();
  } else {
    slideComponents();
  }
  iniciarContador();
});



function iniciarContador() {
  //Define o contador de voltas como 0 para o caso de estar rodando o Timer pela segunda vez
  lapCounter = 0;
  $('#lapCounter').html(lapCounter);

  if ((tempoTotal===0) && !isTabata) { //Caso o evento de mudança do select não tenha sido chamado
      tempoTotal = (parseInt($('#select-tempo option:selected').text()));
  } else if ((tempoTotal===0) && isTabata) {
      tempoTotal = 4;
  }

    if (isCountdown) { //Condição para caso seja countdown
      //DEFININDO O TARGET DO COUNTDOWN SEMPRE PARA 0 - Deveria ser definido por padrão pela api
      //Mas quando um timer do tipo cronometro é parado não acontece o reset do target que deveria ser [0,0,0,0,0]
      timer.start({countdown: true, startValues: {minutes: tempoTotal}, target: [0,0,0,0,0] , precision : 'seconds', callback: function(){
        var seconds = timer.getTimeValues().seconds; //Callback chamando o método etapaFinalContador nos últimos 15 segundos
        if (timer.getTotalTimeValues().seconds<15 && !isEtapaFinal) {  // O isEtapaFinal certifica que o timer não continuará entrando no callback por mais 15 segundos após a primeira condição
          etapaFinalContador();
        }
        if (timer.getTotalTimeValues().seconds<5) { //Toca o som de alerta nos últimos 5 segundos
          countdownSound.play();
        }
      }});
    } else if (isLivre){ //Condição para caso seja tempo livre
        //Utilizando o contador das voltas para o tempo livre para nao precisar redimensionar a tela
        timerLap.start({precision:'seconds', target: {minutes: tempoTotal}, callback: function() {
        var segundosTotais = (tempoTotal * 60);
        if (((timerLap.getTotalTimeValues().seconds + 15)==segundosTotais) && (!isEtapaFinal)) {
          console.log('callback tempo livre');
          etapaFinalContadorLivre();
        }
        if ((timerLap.getTotalTimeValues().seconds+5)>=segundosTotais) { //Toca o som de alerta nos últimos 5 segundos
          countdownSound.play();
        }
      }});
    } else if (isTabata) {
        timer.start({precision:'seconds', target: {minutes: tempoTotal}, callback: function () {

        }});
    } else { // Condição para caso seja cronometro
        timer.start ({precision:'seconds', target: {minutes: tempoTotal}, callback: function() {
        var segundosTotais = (tempoTotal * 60);
        if (((timer.getTotalTimeValues().seconds + 15)==segundosTotais) && (!isEtapaFinal)) {
          etapaFinalContador();
        }
        if ((timer.getTotalTimeValues().seconds+5)>=segundosTotais) { //Toca o som de alerta nos últimos 5 segundos
          countdownSound.play();
        }
      }});
    }

    if (!isLivre) {
      if((tempoVoltas===0) && !isTabata) {
        tempoVoltas = (parseInt($('#select-tempo-voltas option:selected').text()));
      } else if ((tempoVoltas===0) && isTabata) {
        tempoVoltas = 20
      }
      iniciarContadorSegundos();
    }
}



function iniciarContadorSegundos() { //Inicializa o contador dos segundos
  if (isCountdown) {
    timerLap.start({countdown: true, startValues: {seconds: tempoVoltas}, target: {seconds: 0}, precision : 'seconds'});
  } else {
    timerLap.start({precision:'seconds', target: {seconds: tempoVoltas}});
  }
  console.log('(re)iniciou o contador de voltas!!');
}

function iniciarContadorDescanso() {
  if (($('#seconds').hasClass('texto-branco'))){
    $('#seconds').removeClass('texto-branco');
  } else if ( ($('#seconds').hasClass('texto-preto'))) {
    $('#seconds').removeClass('texto-preto');
  }

  $('#seconds').addClass('texto-azul');
  tempoDescansoTabata = true;
  timerLap.start({precision:'seconds', target: {seconds: 10}});
}

function slideComponents() { //Traz a div contendo o número de voltas e o tempo total para a tela ao inciar o countdown
  var isHidden=$('#boxContainer').is(":hidden");
  if(isHidden) { //Se o contado não tiver sido iniciado, diminui o tamanho da fonte do countdownSeconds e troca os botões de play/pause
    resizeContadorFontDown();
    toggleButtons();
    $('.boxContainer').slideToggle("slow");
  }
}

function toggleButtons() { //Método para alternar entre os botões de play e pause
    var isBtnPauseHidden = $('#btn-pause').is(':hidden');
    if (isBtnPauseHidden) {
      $('#btn-play').hide();
      $('#btn-pause').show();
    } else if (!isBtnPauseHidden) {
      $('#btn-pause').hide();
      $('#btn-play').show();
    }
}

function resizeContadorFontDown() { //Método para diminuir o tamanho da fonte do countdownSeconds
    $('#seconds').animate({fontSize: '22vw'}, 500);
}

function resizeContadorFontUp() { //Método para aumetnar o tamanho da fonte do countdonwSeconds
    $('#seconds').animate({fontSize: '27vw'}, 500);
}

function etapaFinalContadorLivre() {
  if ($('#seconds').hasClass('texto-branco')) {
    $('#seconds').removeClass('texto-branco');
  } else if ($('#seconds').hasClass('texto-preto')){
    $('#seconds').removeClass('texto-preto');
  }

  $('#seconds').addClass('texto-vermelho');
  $('#btn-pause').hide();
  $('#btn-config').hide();
}

function etapaFinalContador() { //Método pra econder os elementos necessários da tela e exibir apenas os últimos segundos do contador do tempo total
    isEtapaFinal = true;
    $('#seconds').hide();
    $('#lapCounter').hide();
    $('#contador').css('position', 'relative');
    $('#contador').animate({fontSize: '27vw'}, 500);
    $('#contador').css('margin-top', '10vh');
    $('#contador').css('margin-left', '5vw');

    $('#contador').addClass('texto-vermelho');

    $('#btn-pause').hide();
    $('#btn-config').hide();
    timerLap.stop();
}

function acaoZerar() {
    timer.stop();
    timerLap.stop();
    tempoTotal=0;
    tempoVoltas=0;

      if (tempoDescansoTabata) {
        $('#seconds').removeClass('texto-azul');
      }
      if (isEscuro) {
        $('#seconds').addClass('texto-preto');
      }else {
        $('#seconds').addClass('texto-branco');
      }



    $('#contador .values').html(timer.getTimeValues().toString(units, separator, leftZeroPadding));
    $('#seconds .values').html(timerLap.getTimeValues().toString(units, separator, leftZeroPadding));
    var isHidden=$('#boxContainer').is(":hidden");
    if (!isHidden) {
      $('.boxContainer').slideToggle("slow");
    }
    $('#btn-pause').hide();
    $('#btn-play').hide();
    resizeContadorFontUp();
}

function pauseButtonClick() {
    toggleButtons();
    if (timer.isRunning()) {
      timer.pause();
    }
    if (timerLap.isRunning()) {
      timerLap.pause();
    }
}

function resumeButtonClick() {
    if (timer.isPaused()) {
      timer.start();
    }
    if (timerLap.isPaused()) {
      timerLap.start();
    }
    toggleButtons();
}

//Referente ao contador dos Segundos
timerLap.addEventListener('started', function (e) {
  if ((!isLivre && tempoVoltas>=60) || isLivre) {
    $('#seconds .values').html(timerLap.getTimeValues().toString(units, separator, leftZeroPadding));
  } else {
    $('#seconds .values').html(timerLap.getTimeValues().toString(['seconds'], '', 0));
  }
});
// $('#seconds .values').html(timerLap.getTimeValues().toString(units, separator, leftZeroPadding));
timerLap.addEventListener('secondsUpdated', function secondsUpdated(e) {
  if ((!isLivre && tempoVoltas>=60) || isLivre) {
    $('#seconds .values').html(timerLap.getTimeValues().toString(units, separator, leftZeroPadding));
  } else {
    $('#seconds .values').html(timerLap.getTimeValues().toString(['seconds'], '', 0));
  }
});

timerLap.addEventListener('targetAchieved', function (e) {
  if (isLivre) { // Target para o tempo livre
    $('#seconds .values').html('FIM!'); //Ao chegar no targetAchieved finaliza o coundown secundário (Segundos)
    setTimeout(function () {
      restaurarTelaInicial(); // Espera 3 segundos para restaurar a telaInicial
   }, 3000);
 }  else if (isTabata && tempoDescansoTabata) { //Target do tempo descanso tabata - Apenas os 10 segundos de descanso
   $('#seconds').removeClass('texto-azul');
   if(isEscuro) {
     $('#seconds').addClass('texto-preto');
   } else {
     $('#seconds').addClass('texto-branco');
   }
   tempoDescansoTabata = false;
   timerLap.stop();
   audioFimContador.play();
   iniciarContadorSegundos();
 }else{ //target padrão
    lapCounter++;
    if ($('#lapBeep').is(':checked')) {
      lapSound.play();
    }
    $('#lapCounter').html(lapCounter);  //Atualiza o contador de voltas no targetAchieved do contadorSegundos
    timerLap.stop();
    if (isTabata && !tempoDescansoTabata) { //Caso seja tabata e não esteja no tempo de descanso chama o contador do tempo de descanso
      iniciarContadorDescanso();
    } else {  //Caso não seja tabata simplesmente reincia o contador dos segundos;
      iniciarContadorSegundos();
    }
  }
});


//Referente  ao countdown do tempo total
timer.addEventListener('started', function (e) {
    $('#contador .values').html(timer.getTimeValues().toString(units, separator, leftZeroPadding));
});
$('#contador .values').html(timer.getTimeValues().toString(units, separator, leftZeroPadding));
timer.addEventListener('secondsUpdated', function (e) {
    $('#contador .values').html(timer.getTimeValues().toString(units, separator, leftZeroPadding));
});
timer.addEventListener('targetAchieved', function (e) {
  if (isTabata) {
    etapaFinalContador()
    } else {
      timerLap.addEventListener('targetAchieved' , function (e) {
        timerLap.stop();
      })
    }
    $('#contador').css('margin-left', '10vw'); //Ao chegar no targetAchieved finaliza o coundown secundário (Segundos)
    $('#contador .values').html('FIM!'); //Ao chegar no targetAchieved finaliza o coundown secundário (Segundos)
    audioFimContador.play();

    setTimeout(function () {
      restaurarTelaInicial(); // Espera 3 segundos para restaurar a telaInicial
   }, 3000);
});

function restaurarTelaInicial () {
    location.reload();
}

/* ------------ Envio de email -----------  */
 /*  Validação do formulário de envio */
function validarFormulario() {
  var nome = document.forms["form_email"]["usuario_nome"].value;
  var texto = document.forms["form_email"]["texto_mensagem"].value;
      if (nome !== "" && texto !== "") {
        swal({
          title: "Okay!",
          type: "success",
          timer: 2000,
          showConfirmButton: false
        });
        $('#modalEmail').modal('close');
        return true;
      } else {
        swal({
          title: "Atenção",
          text: "Para completar o envio escreva o seu nome e uma mensagem",
          imageUrl: "assets/icons/alert.png",
          timer: 3000,
          showConfirmButton: false
        });
        return false;
      }

}
