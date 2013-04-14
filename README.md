codevro.js
==========

Dealing with Siren, Siret, Luhn, INSEE code and many others using jQuery plugin.

Luhn
----

The Luhn algorithm!

Very simple to use as you can see:

    $('element').codevro( 'luhn', {onValidate: function(result){console.log(result)}})


FR: Siren
---------

Have more options than Luhn:

    $('element').codevro( 'frSiren', {required: true, onValidate: myCallback} )

FR: Siret
---------

Same options as Siren, but one more is available:


    $('element').codevro( 'frSiret', {required: true, onValidate: myCallback, getPlaceRank: myOtherCallback} )

FR: RIB
-------

RIB take same options as Siren plus some others: `getCodeBanque`, `getCodeGuichet`, `getNumeroDeCompte` and `getCleRib`

    $('element').codevro( 'frRib', {required: true, getCleRib: myCallback} )


