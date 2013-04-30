codevro.js
==========

Dealing with Siren, Siret, Luhn, INSEE code and many others using jQuery plugin.

Luhn
----

The Luhn algorithm!

Very simple to use as you can see:

``` javascript
$('element').codevro( 'luhn', {onValidate: function(result){console.log(result)}})
```

FR: Siren
---------

Have more options than Luhn:

``` javascript
$('element').codevro( 'frSiren', {required: true, onValidate: myCallback} )
```

FR: Siret
---------

Same options as Siren, but one more is available:


``` javascript
$('element').codevro( 'frSiret', {required: true, onValidate: myCallback, getPlaceRank: myOtherCallback} )
```

FR: RIB
-------

RIB take same options as Siren plus some others: `getCodeBanque`, `getCodeGuichet`, `getNumeroDeCompte` and `getCleRib`

``` javascript
$('element').codevro( 'frRib', {required: true, getCleRib: myCallback} )
```

INTL: Credit Card Number
------------------------

Check if cardit card number is valid and format it by adding space by default after each ' digits block.

``` javascript
$('element').codevro( 'intlCreditCard', {onValidate: myCallback} )
```
 

