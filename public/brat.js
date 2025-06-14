<script>
function hasDecimal(number) {
    var sqrt = Math.sqrt(number);
    return sqrt !== Math.floor(sqrt);
}
function createDiamond(sentence) {
       const words = sentence.split(" ");  // Split sentence into words
            const len = words.length;
            const $container =$('body.black div#textOverlay span.textFitted');
            $container.empty();  
        

           /* const groups = [
                words.slice(0, 1),  // First group: 1 word
                words.slice(1, 3),  // Second group: 2 words
                words.slice(3, 7),  // Third group: 4 words
                words.slice(7, 11), // Fourth group: 4 words
                words.slice(11, 14),// Fifth group: 3 words
                words.slice(14, 15),// Sixth group: 1 word
                words.slice(15)     // Seventh group: remaining words
            ];*/
            const groups = [];
                var num1=0;
                var num2=0;             

                const sqrtlen = Math.floor(Math.sqrt(words.length));

                for (let i = 0; i < sqrtlen; i++) {
                    num1 = num2;
                    num2 = num2 + i + 1;
                    console.log(num1+ "," + num2);
                groups.push(words.slice(num1, num2));
                }


              
if (hasDecimal(words.length)) {
for (let j = sqrtlen; j >= 1; j--) {
    num1 = num2;
    num2 = num2 + j;
    console.log(num1+ "," + num2);
groups.push(words.slice(num1, num2));
}
if(len > num2){
for(let z =0; z < len-num2; z ++){
num1 = num2;
num2 = num2 +1;
 console.log(num1+ "," + num2);
groups.push(words.slice(num1, num2));
}
}
console.log("hasdecimal");
} else{
  for (let j = sqrtlen; j > 1; j--) {
                    num1 = num2;
                    num2 = num2 + j - 1;
                    console.log(num1+ "," + num2);
                groups.push(words.slice(num1, num2));
                }
console.log("Nodecimal");
}


            // Loop through word groups and display them
            groups.forEach(function(group, i) {
                if (group.length > 0) {
                    let spaces = " ".repeat((groups.length - i - 1) * 2); // Add spaces for centering
                    let row = spaces + group.join(" ");  // Join words in the group
                    $container.append(`<div class="diamond-row">${row}</div>`);
                }
            });
}
        // for text Fit
        /**
        * textFit v2.3.1
        * Previously known as jQuery.textFit
        * 11/2014 by STRML (strml.github.com)
        * MIT License
        *
        * To use: textFit(document.getElementById('target-div'), options);
        *
        * Will make the *text* content inside a container scale to fit the container
        * The container is required to have a set width and height
        * Uses binary search to fit text with minimal layout calls.
        * Version 2.0 does not use jQuery.
        */
        /*global define:true, document:true, window:true, HTMLElement:true*/

        (function (root, factory) {
            "use strict";

            // UMD shim
            if (typeof define === "function" && define.amd) {
                // AMD
                define([], factory);
            } else if (typeof exports === "object") {
                // Node/CommonJS
                module.exports = factory();
            } else {
                // Browser
                root.textFit = factory();
            }

        }(typeof global === "object" ? global : this, function () {
            "use strict";

            var defaultSettings = {
                alignVert: false, // if true, textFit will align vertically using css tables
                alignHoriz: false, // if true, textFit will set text-align: center
                multiLine: true, // if true, textFit will not set white-space: no-wrap
                detectMultiLine: true, // disable to turn off automatic multi-line sensing
                minFontSize: 8,
                maxFontSize: 80,
                reProcess: true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
                widthOnly: false, // if true, textFit will fit text to element width, regardless of text height
                alignVertWithFlexbox: false, // if true, textFit will use flexbox for vertical alignment
            };

            return function textFit(els, options) {
if(!jQuery("body").hasClass("black")){
options.maxFontSize = 170;
}
if(jQuery("body").hasClass("blue")){
options.maxFontSize = 230;
}
if(jQuery("body").hasClass("strike")){
if(screen.width < 1023){
options.maxFontSize = 100;}
}
                if (!options) options = {};

                // Extend options.
                var settings = {};
                for (var key in defaultSettings) {
                    if (options.hasOwnProperty(key)) {
                        settings[key] = options[key];
                    } else {
                        settings[key] = defaultSettings[key];
                    }
                }

                // Convert jQuery objects into arrays
                if (typeof els.toArray === "function") {
                    els = els.toArray();
                }

                // Support passing a single el
                var elType = Object.prototype.toString.call(els);
                if (elType !== '[object Array]' && elType !== '[object NodeList]' &&
                    elType !== '[object HTMLCollection]') {
                    els = [els];
                }

                // Process each el we've passed.
                for (var i = 0; i < els.length; i++) {
                    processItem(els[i], settings);
                }
            };

            /**
             * The meat. Given an el, make the text inside it fit its parent.
             * @param  {DOMElement} el       Child el.
             * @param  {Object} settings     Options for fit.
             */
            function processItem(el, settings) {
                if (!isElement(el) || (!settings.reProcess && el.getAttribute('textFitted'))) {
                    return false;
                }

                // Set textFitted attribute so we know this was processed.
                if (!settings.reProcess) {
                    el.setAttribute('textFitted', 1);
                }

                var innerSpan, originalHeight, originalHTML, originalWidth;
                var low, mid, high;

                // Get element data.
                originalHTML = el.innerHTML;
                originalWidth = innerWidth(el);
                originalHeight = innerHeight(el);

                // Don't process if we can't find box dimensions
                if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
                    if (!settings.widthOnly)
                        throw new Error('Set a static height and width on the target element ' + el.outerHTML +
                            ' before using textFit!');
                    else
                        throw new Error('Set a static width on the target element ' + el.outerHTML +
                            ' before using textFit!');
                }

                // Add textFitted span inside this container.
                if (originalHTML.indexOf('textFitted') === -1) {
                    innerSpan = document.createElement('span');
                    innerSpan.className = 'textFitted';
                    //$("#memeText").css({"display": "none"});
                    // Inline block ensure it takes on the size of its contents, even if they are enclosed
                    // in other tags like <p>
                    innerSpan.style['display'] = 'inline-block';
                    innerSpan.innerHTML = originalHTML;
                    el.innerHTML = '';
                    el.appendChild(innerSpan);
if(jQuery("body").hasClass("black")){
createDiamond($("body.green #textInput").val());
}
                } else {
                    // Reprocessing.
                    innerSpan = el.querySelector('span.textFitted');
                    // Remove vertical align if we're reprocessing.
                    if (hasClass(innerSpan, 'textFitAlignVert')) {
                        innerSpan.className = innerSpan.className.replace('textFitAlignVert', '');
                        innerSpan.style['height'] = '';
                        el.className.replace('textFitAlignVertFlex', '');
                    }
                }

                // Prepare & set alignment
                if (settings.alignHoriz) {
                    el.style['text-align'] = 'center';
                    innerSpan.style['text-align'] = 'center';
                }

                // Check if this string is multiple lines
                // Not guaranteed to always work if you use wonky line-heights
                var multiLine = settings.multiLine;
                if (settings.detectMultiLine && !multiLine &&
                    innerSpan.getBoundingClientRect().height >= parseInt(window.getComputedStyle(innerSpan)['font-size'], 10) * 2) {
                    multiLine = true;
                }

                // If we're not treating this as a multiline string, don't let it wrap.
                if (!multiLine) {
                    el.style['white-space'] = 'nowrap';
                }

                low = settings.minFontSize;
                high = settings.maxFontSize;

                // Binary search for highest best fit
                var size = low;
                while (low <= high) {
                    mid = (high + low) >> 1;
                    innerSpan.style.fontSize = mid + 'px';
                    var innerSpanBoundingClientRect = innerSpan.getBoundingClientRect();
                    if (
                        innerSpanBoundingClientRect.width <= originalWidth
                        && (settings.widthOnly || innerSpanBoundingClientRect.height <= originalHeight)
                    ) {
                        size = mid;
  …</script>