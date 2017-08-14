const config = require('config');
const express = require('express');
const router = express.Router();
const nem = require('nem-sdk').default;
const nemlib = require('nem-library');
nemlib.NEMLibrary.bootstrap(nemlib.NetworkTypes.TEST_NET);

const endpoint = nem.model.objects.create('endpoint')(
  process.env.NIS_ADDR || nem.model.nodes.defaultTestnet,
  process.env.NIS_PORT || nem.model.nodes.defaultPort
);

const accountHttp = new nemlib.AccountHttp();

router.get('/', function(req, res, next) {
  var address = req.query.address;
  var message = req.query.message;
  var encrypt = req.query.encrypt;
  var mosaic  = req.query.mosaic;
  var amount  = req.query.amount;

  // nem.com.requests.account.data(endpoint, process.env.NEM_ADDRESS).then(function(nisRes) {
  //   res.render('index', {
  //     txHash: req.flash('txHash'),
  //     error: req.flash('error'),
  //     xemMax: config.xem.max,
  //     xemMin: config.xem.min,
  //     address: address,
  //     message: message,
  //     encrypt: encrypt,
  //     amount: amount,
  //     faucetAddress: nisRes['account']['address'],
  //     faucetBalance: nisRes['account']['balance'],
  //     recaptcha_secret: process.env.RECAPTCHA_CLIENT_SECRET
  //   });
  // })
  // .catch(next);

  accountHttp.getFromAddress(new Address(process.env.NEM_ADDRESS)).subscribe(accountInfo => {
    res.render('index', {
      txHash: req.flash('txHash'),
      error: req.flash('error'),
      address: address,
      message: message,
      encrypt: encrypt,
      mosaic: mosaic,
      amount: amount,
      faucetAddress: accountInfo['publicAccount']['address']['value'],
      faucetBalance: accountInfo['balance']['balance'],
      xemMax: config.xem.max,
      xemMin: config.xem.min,
      recaptcha_secret: process.env.RECAPTCHA_CLIENT_SECRET
    });
  });
});

module.exports = router;
