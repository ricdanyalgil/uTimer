var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  var api_key = "key-4f6ed026c2dd6ef4088711f94bd47f59"; //Esconder esses valor
  var domain = "sandbox86c83f76c4a446129e058c531ee6366e.mailgun.org"; //Esconder esse valor
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from:'uTimer <postmaster@sandbox86c83f76c4a446129e058c531ee6366e.mailgun.org>', //Substituir pelo no-reply@banksytem.com
    to: 'breno.vieira@banksystem.com.br', //Substituir para o email da bank
    subject: 'Avaliação de Usuário',
    text: req.body.texto_mensagem
  };

  mailgun.messages().send(data, function (error, body){
    if (!error) {
      console.log('Email enviado com sucesso!!!');
    }else {
      res.send('/')
      console.log('Algo aconteceu de errado, o email não foi enviado!');
    }
  });
});


module.exports = router;
