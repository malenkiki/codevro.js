/**
 * @fileOverview Format and chack many kind of code
 *               <p>License MIT
 *               <br />Copyright 2013 Michel Petit <a href="http://www.malenkiland.fr">http://www.malenkiland.fr</a>
 *               <br />Project page <a href="https://github.com/malenkiki/codevrojs">https://github.com/malenkiki/codevrojs</a>
 * @version 0.1
 * @author Michel Petit <petit.michel@gmail.com>
 * @requires jquery
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>.
 * @name $
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>
 * @name fn
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 * @memberOf $
 */

/**
 * Pseudo-Namespace containing private methods (for documentation purposes)
 * @name _private_methods
 * @namespace
 */
(function($){

    var methods = {
        /**
         * @lends $.fn.codevro
         */
        init: function(options){},

        /**
         * Define element as a luhn code.
         *
         * As options, you can use `required` and `onValidate`. First is a
         * boolean, the second is a callback function taking the boolean check
         * result as argument. 
         *
         * @example $(element).codevro('luhn', options)
         * @param {Object} options
         * @return {Object}
         */
        luhn: function(options){

            var defaults = {
                required: false,
                onValidate: function(){}
            }

            options = $.extend({}, defaults, options)

            var code = cleanNoDigit($(this).val())
            var luhn = new Luhn(code)

            return this.each(function(){
                options.onValidate.apply(this, [luhn.check()])
            })
        },

        /**
         * Define element as a french siren code.
         *
         * Siren code identifies french enterprises by a nine-digits code. This
         * code is not a simple list of digit, this digits must check the Luhn
         * algorithm and must have exactly nine digits.
         *
         * Parameters for options are:
         *
         * <ul>
         * <li>type, one string from 'siren' or 'siret'
         * <li>required, a boolean, self explain I think
         * <li>check, a boolean, to check the code or not
         * <li>format, a boolean, to format the code or not
         * <li>separator, a string used when formating code to separate digit blocks
         * <li>onValide, a function to call when after code checking taking as option the result as a boolean
         * </ul>
         *
         * @example $(element).codevro('frSiren', options)
         * @param {Object} options
         * @return {Object}
         */
        frSiren: function(options){
            var defaults = {
                type: 'siren',
                required: false,
                check: true,
                format: true,
                separator: ' ',
                onValidate: function(){}
            }

            options = $.extend({}, defaults, options)


            return this.each(function(){
                var code = cleanNoDigit($(this).val())
                var luhn = new Luhn(code)

                var test = luhn.check() && code.length == 9

                if(options.check){
                    options.onValidate.apply(this, [test])
                }

                if(options.format){
                    if(test){
                        var f = []
                        f.push(code.substring(0, 3))
                        f.push(code.substring(3, 6))
                        f.push(code.substring(6))

                        $(this).val(f.join(options.separator))
                    }
                }
                else {
                    if(test){
                        $(this).val(code)
                    }
                }
            })
            
        },
        
        
        /**
         * Define element as a french siret code.
         *
         * Siret code identifies french enterprises places by a 14-digits code. This
         * code is not a simple list of digit, this digits must check the Luhn
         * algorithm and must have exactly 14 digits.
         *
         * The first nine digits of siret code are the Siren code.
         *
         * Parameters for options are:
         *
         * <ul>
         * <li>type, one string from 'siren' or 'siret'
         * <li>required, a boolean, self explain I think
         * <li>check, a boolean, to check the code or not
         * <li>format, a boolean, to format the code or not
         * <li>separator, a string used when formating code to separate digit blocks
         * <li>onValide, a function to call when after code checking taking as option the result as a boolean
         * <li>getPlaceRank, a function to call taking the n-th place of the enterprise
         * </ul>
         *
         * @example $(element).codevro('frSiren', options)
         * @param {Object} options
         * @return {Object}
         */
        frSiret: function(options){
            var defaults = {
                type: 'siret',
                required: false,
                check: true,
                format: true,
                separator: ' ',
                onValidate: function(){},
                getInformation: function(){}
            }

            options = $.extend({}, defaults, options)



            return this.each(function(){
                var code = cleanNoDigit($(this).val())
                var luhn = new Luhn(code)

                var test = luhn.check() && code.length == 14

                if(options.check){
                    options.onValidate.apply(this, [test])
                }
                
                options.getInformation.apply(this, [{placeRank: code.charAt(12)}])

                if(options.format){
                    if(test){
                        var f = []
                        f.push(code.substring(0, 3))
                        f.push(code.substring(3, 6))
                        f.push(code.substring(6, 9))
                        f.push(code.substring(9))

                        $(this).val(f.join(options.separator))
                    }
                }
                else {
                    if(test){
                        $(this).val(code)
                    }
                }
            })
        },

        /**
         * Define element as a french RIB bank code.
         *
         * RIB code identifies french bank account.
         *
         * This code is a list of numbers, sometimes letters too. The length is
         * 23 characters.
         *
         * Parameters for options are:
         *
         * <ul>
         * <li>required, a boolean, self explain I think
         * <li>check, a boolean, to check the code or not
         * <li>format, a boolean, to format the code or not
         * <li>separator, a string used when formating code to separate digit blocks
         * <li>onValide, a function to call when after code checking taking as option the result as a boolean
         * <li>getCodeBanque, a function to call when bank code number is returned after checking
         * <li>getCodeGuichet, a function to call when counter code number is returned after checking
         * <li>getNumeroDeCompte, a function to call when accunt number number is returned after checking
         * <li>getCleRib, a function to call when RIB key is returned after checking
         * </ul>
         *
         * @example $(element).codevro('frSiren', options)
         * @param {Object} options
         * @return {Object}
         */
        frRib: function(options){
            var defaults = {
                required: false,
                check: true,
                format: true,
                separator: ' ',
                onValidate: function(){},
                getInformation: function(){}
            }

            options = $.extend({}, defaults, options)


            return this.each(function(){
                var code = cleanNoDigit($(this).val())
                var rib = new Rib(code)

                var test = rib.check()

                if(options.check){
                    options.onValidate.apply(this, [test])
                }

                options.getInformation.apply(this, [{
                    codeBanque: rib.getCodeBanque(),
                    codeGuichet: rib.getCodeGuichet(),
                    numeroDeCompte: rib.getNumeroDeCompte(),
                    cleRib: rib.getCleRib()}])

                if(options.format){
                    if(test){
                        var f = []
                        f.push(rib.getCodeBanque())
                        f.push(rib.getCodeGuichet())
                        f.push(rib.getNumeroDeCompte())
                        f.push(rib.getCleRib())

                        $(this).val(f.join(options.separator))
                    }
                }
                else {
                    if(test){
                        $(this).val(code)
                    }
                }
            })
            
        },

        /**
         * Define element as a french NIR code.
         *
         *
         * Parameters for options are:
         *
         * <ul>
         * <li>required, a boolean, self explain I think
         * <li>check, a boolean, to check the code or not
         * <li>format, a boolean, to format the code or not
         * <li>separator, a string used when formating code to separate digit blocks
         * <li>onValide, a function to call when after code checking taking as option the result as a boolean
         * <li>getInformation, a function to call on return to use some informations about this code
         * </ul>
         *
         * @example $(element).codevro('frNir', options)
         * @param {Object} options
         * @return {Object}
         */
        frNir: function(options){
            var defaults = {
                required: false,
                check: true,
                format: true,
                separator: ' ',
                onValidate: function(){},
                getInformation: function(){}
            }

            options = $.extend({}, defaults, options)


            return this.each(function(){
                var code = $(this).val().replace(/[^ABab0-9]/g, '')
                var nir = new Nir(code)

                var test = nir.check()

                if(options.check){
                    options.onValidate.apply(this, [test])
                }

                options.getInformation.apply(this, [nir.getInformation()])

                if(options.format){
                    if(test){
                        var info = nir.getInformation()
                        var f = []
                        f.push(info.gender == 'man' ? '1' : '2')
                        f.push(info.year)
                        f.push(info.month)
                        f.push(info.department)
                        f.push(info.city)
                        f.push(info.rank)
                        f.push(info.key)
                        $(this).val(f.join(options.separator))
                    }
                }
                else {
                    if(test){
                        $(this).val(code)
                    }
                }
            })
            
        },
        /**
         * Define element as a credit card number.
         *
         * @example $(element).codevro('intlCreditCard', options)
         * @param {Object} options
         * @return {Object}
         */
        intlCreditCard: function(options){
            var defaults = {
                required: false,
                check: true,
                format: true,
                separator: ' ',
                onValidate: function(){}
            }

            options = $.extend({}, defaults, options)

            return this.each(function(){
                var code = cleanNoDigit($(this).val())
                var luhn = new Luhn(code)

                var test = luhn.check()

                if(options.check){
                    options.onValidate.apply(this, [test])
                }
                
                if(test){
                    if(options.format){
                        var str = ''
                        var k = 0
                        for(var c in code) {
                            k = k + 1
                                str += code.charAt(c) + ''

                            if(k % 4 == 0) {
                                str += options.separator
                            }
                        }

                        $(this).val(str.replace(/[^0-9]+$/, ''))
                    }
                    else {
                        $(this).val(code)
                    }
                }
            })
        },
        
        /**
         * Define element as US SSN.
         *
         * @example $(element).codevro('usSsn', options)
         * @param {Object} options
         * @return {Object}
         */
        usSsn: function(options){
            var defaults = {
                required: false,
                check: true,
                format: true,
                separator: '-',
                onValidate: function(){},
                get
            }

            options = $.extend({}, defaults, options)

            return this.each(function(){
                var code = cleanNoDigit($(this).val())
                var ssn = new Ssn(code)
                var test = ssn.check()

                if(options.check){
                    options.onValidate.apply(this, [test])
                }
                
                options.getInformation.apply(this, [ssn.getInformation()])
                
                if(test){
                    if(options.format){
                        var str = ''
                        var k = 0
                        for(var c in code) {
                            k = k + 1
                                str += code.charAt(c) + ''

                            if(k % 4 == 0) {
                                str += options.separator
                            }
                        }

                        $(this).val(str.replace(/[^0-9]+$/, ''))
                    }
                    else {
                        $(this).val(code)
                    }
                }
            })
        },
        
    }
        

    /**
     * Codevro allow you to define element as a specific code.
     *
     * @class codevro
     * @memberOf $.fn
     * @param {String} methodOrOptions 
     */
    $.fn.codevro = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        }
        else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.codevro' );
        }    
    };












    /**
     * @lends _private_methods
     */


    /**
     * The Luhn algorithm.
     *
     * @name Luhn
     * @class Luhn
     * @constructor
     * @param {String} str Code value
     */
     var Luhn = function(str){
         this.luhnValue = ''
         this.luhnLength = 0

         if(typeof str == 'string' && str.length){
             this.luhnValue = str
             this.luhnLength = str.length
         }
         else {
             throw 'Code must be a non null string.'
         }

         this.toString = function(){
             return this.luhnValue
         }

         /**
          * Compute modulo 10 using the Luhn algorithm.
          *
          * @return {Number} The modulo 10 result
          */
         this.modulo10 = function(){
             var code = this.luhnValue.split('').reverse()
             var sum = 0

             for(i in code){
                 var digit = parseInt(code[i])

                 if((parseInt(i) + 1) % 2 == 0){
                     digit = digit * 2

                     if(digit > 9){
                         digit = digit - 9
                     }
                 }

                 sum += digit 
             }

             return sum % 10
         }

         /**
          * Check if the code if valid or not.
          *
          * @return {Number} True if code is valid
          */
         this.check = function(){
             return !this.modulo10()
         }
     }



    /**
     * RIB
     *
     * @name Rib
     * @class Rib
     * @constructor
     * @param {String} str Code value
     */
     var Rib = function(str){
         this.value = ''
         this.length = 0

         if(typeof str == 'string' && str.length){
             this.value = new String(str)
             this.length = str.length
         }
         else {
             throw 'Code must be a non null string.'
         }

         this.toString = function(){
             return this.value
         }

         /**
          * Check if the code if valid or not.
          *
          * @return {Number} True if code is valid
          */
         this.check = function(){
             var strAccount = ''
             var str = this.getNumeroDeCompte()
             var strRib = ''

             for(var i in str){
                 var c = str[i]

                 if(c.match(/[^0-9]/)){
                     var intCProv = c.charCodeAt(0) - 64

                     var intC = ((intCProv + Math.pow(2, (intCProv - 10) / 9 )) % 10)
                     intC += intCProv > 18 && intCProv < 25 ? 1 : 0

                     c = new String(intC)
                 }

                 strAccount += c
             }

             strRib += this.getCodeBanque() + ''
             strRib += this.getCodeGuichet() + ''
             strRib += strAccount + ''
             strRib += this.getCleRib() + ''

             return modulo(strRib, 97) == 0 && this.length == 23
         }

         this.getCodeBanque = function(){
             return this.value.substr(0 , 5);
         }

         this.getCodeGuichet = function(){
             return this.value.substr(5, 5);
         }

         this.getNumeroDeCompte = function(){
             return this.value.substr(10, 11);
         }

         this.getCleRib = function(){
             return this.value.substr(21, 2);
         }
     }


    /**
     * NIR
     *
     * @name Nir
     * @class Nir
     * @constructor
     * @param {String} str Code value
     */
     var Nir = function(str){
         this.value = ''
         this.length = 0

         if(typeof str == 'string' && str.length){
             this.value = new String(str)
             this.length = str.length
         }
         else {
             throw 'Code must be a non null string.'
         }

         this.toString = function(){
             return this.value
         }

         /**
          * Check if the code if valid or not.
          *
          * @return {Number} True if code is valid
          */
         this.check = function(){
             var key = this.value.substr(13, 2)
             var strNir = this.adapt(this.value)
             return (97 - modulo(strNir, 97)) == key && this.length == 15
         }

         /**
          * Change the code to follow some rules used for Corsica. In Corsica,
          * two letters are used into the code: A and B. This letter must be
          * replaced by a zero and in case of A, substract by 1.000.000 or
          * 2.000.000 for B.
          *
          * @param {String} str The code to adapt
          * @return {String} The adapted code
          */
         this.adapt = function(str){
             var str = str.substr(0, 13)
             var substract = 0
             if(str.match(/[aA]g/)) substract = 1000000
             if(str.match(/[bB]g/)) substract = 2000000
             var int = parseInt(str.replace(/ABab/g, '0'))

             if(substract > 0){
                 return new String(int - substract)
             }
             else {
                 return str
             }
         }

         /**
          * Returns some structured informations about this NIR code.
          *
          * Informations returned are:
          *
          * <ul>
          * <li>gender: a string like man or woman.
          * <li>year: a 2-digits string for the birth year.
          * <li>month: Birth month in two digits.
          * <li>department: the "département" code.
          * <li>city: City of birth code.
          * <li>rank: Ranking among the list of births
          * <li>key: The verification key 
          * </ul>
          * @return {Object}
          */
         this.getInformation = function(){
            return {
                gender: this.value.charAt(0) == '1' ? 'man' : 'woman',
                year: this.value.substr(1, 2) + '',
                month: this.value.substr(3, 2) + '',
                department: this.value.substr(5, 2) + '',
                city: this.value.substr(7, 3) + '',
                rank: this.value.substr(10, 3) + '',
                key: this.value.substr(13) + ''
            }
         }
     }
    
     
     
     /**
      * SSN
      *
      * @name Ssn
      * @class Ssn
      * @constructor
      * @param {String} str Code value
      */
     var Ssn = function(str){
         this.value = ''

         if(typeof str == 'string' && str.length == 9){
             this.value = new String(str)
         }
         else {
             throw 'Code must be a nine digits string.'
         }

         this.toString = function(){
             return this.value
         }

         /**
          * Check if the code if valid or not.
          *
          * @return {Number} True if code is valid
          */
         this.check = function(){
             var arrOnlyForAds = [
                 '987654320',
                 '987654321',
                 '987654322',
                 '987654323',
                 '987654324',
                 '987654325',
                 '987654326',
                 '987654327',
                 '987654328',
                 '987654329'
             ]

             var arrInvalids = [
                 '002281852',
                 '042103580',
                 '062360749',
                 '078051120',
                 '095073645',
                 '128036045',
                 '135016629',
                 '141186941',
                 '165167999',
                 '165187999',
                 '165207999',
                 '165227999',
                 '165247999',
                 '189092294',
                 '212097694',
                 '212099999',
                 '306302348',
                 '308125070',
                 '468288779',
                 '549241889'
             ]

             if(this.getInformation().area == '000') {
                 return false
             } 
             else if(this.getInformation().group == '00') {
                 return false
             }
             else if(this.getInformation().serial == '0000') {
                 return false
             } 
             else if(this.getInformation().area == '666') {
                 return false
             } 
             else if($.inArray(this.value, arrInvalids) != -1) {
                 return false
             } 
             else if($.inArray(this.value, arrOnlyForAds) != -1) {
                 return false
             } 
             // pas sûr de moi, je dois vérifier mes sources…
             else if(this.getInformation().area >= '900' && this.getInformation().area <= '999') {
                 return false
             }
             else {
                 return true
             }


         }


         /**
          * Returns some structured informations about this SSN.
          *
          * Informations returned are: Area, group and serial part of the number.
          *
          * @return {Object}
          */
         this.getInformation = function(){
            return {
                area: this.value.substr(0, 3),
                group: this.value.substr(3, 2) + '',
                serial: this.value.substr(5) + ''
            }
         }
     }


     /**
      * Modulo for big value.
      *
      * Avoiding some issues with javascript and modulo calculus of big value.
      *
      * See http://stackoverflow.com/questions/929910/modulo-in-javascript-large-number
      *
      * @lends _private_methods
      * @param {String} divident
      * @param {Number} divisor
      */
     var modulo = function(divident, divisor) {
         var cDivident = ''
         var cRest = ''

         divident = divident + ''

         for (var i in divident ) {
             var cChar = divident[i]
             var cOperator = cRest + '' + cDivident + '' + cChar

             if ( cOperator < parseInt(divisor) ) {
                 cDivident += '' + cChar
             }
             else {
                 cRest = cOperator % divisor
                 if ( cRest == 0 ) {
                     cRest = ''
                 }
                 cDivident = ''
             }

         }
         cRest += '' + cDivident
         
         if (cRest == '') {
             cRest = 0
         }

         return cRest
     }


     /**
      * Remove form given string all non digit characters.
      *
      * @lends _private_methods
      * @param {String} str The string to clean
      * @return {String} Cleaned string
      */
     var cleanNoDigit = function(str){
         return str.replace(/[^0-9]/g, '')
     }

 })(jQuery)
