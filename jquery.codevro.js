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
                getPlaceRank: function(){}
            }

            options = $.extend({}, defaults, options)



            return this.each(function(){
                var code = cleanNoDigit($(this).val())
                var luhn = new Luhn(code)

                var test = luhn.check() && code.length == 14

                if(options.check){
                    options.onValidate.apply(this, [test])
                }
                
                options.getPlaceRank.apply(this, [code.charAt(12)])

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
        }
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
