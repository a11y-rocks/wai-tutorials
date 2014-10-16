(function () {
  'use strict';

  var addclass = function(el, className) {
   if (el.classList)
     el.classList.add(className);
   else
     el.className += ' ' + className;
 };

  // Fragmention script: https://github.com/chapmanu/fragmentions

  // detect native/existing fragmention support
  if (!('fragmention' in window.location)) (function () {
    // populate fragmention
    location.fragmention = location.fragmention || '';

    // return first element in scope containing case-sensitive text
    function getElementByText(scope, text) {
      // iterate descendants of scope
      for (var all = scope.childNodes, index = 0, element; (element = all[index]); ++index) {
        // conditionally return element containing visible, whitespace-insensitive, case-sensitive text (a match)
        if (element.nodeType == 1 && (element.innerText || element.textContent || '').replace(/\s+/g, ' ').indexOf(text) !== -1) {
          return getElementByText(element, text);
        }
      }

      // return scope (no match)
      return scope;
    }

    // on dom ready or hash change
    function onHashChange() {
      // set location fragmention as uri-decoded text (from href, as hash may be decoded)
      location.fragmention = decodeURIComponent((location.href.match(/#(#|%23)(.+)/) || [0,0,''])[2].replace(/\+/g, ' '));


      // conditionally remove stashed element fragmention attribute
      if (element) {
        element.removeAttribute('fragmention');

        // DEPRECATED: trigger style in IE8
        if (element.runtimeStyle) {
          element.runtimeStyle.windows = element.runtimeStyle.windows;
        }
      }

      // if fragmention exists
      if (location.fragmention) {
        // get element containing text (or return document)
        element = getElementByText(document, location.fragmention);

        // if element found
        if (element !== document) {
          // scroll to element
          element.scrollIntoView();

          // set fragmention attribute
          element.setAttribute('fragmention', '');
          element.setAttribute('tabindex', '-1');
          element.focus();

          // DEPRECATED: trigger style in IE8
          if (element.runtimeStyle) {
            element.runtimeStyle.windows = element.runtimeStyle.windows;
          }
        }
        // otherwise clear stashed element
        else {
          element = null;
        }
      }
    }

    // set stashed element
    var element;

    // add listeners
    if ('addEventListener' in window) {
      window.addEventListener('hashchange', onHashChange);
      document.addEventListener('DOMContentLoaded', onHashChange);
    }
    // DEPRECATED: otherwise use old IE attachEvent
    else {
      window.attachEvent('onhashchange', onHashChange);
      document.attachEvent('onreadystatechange', function () {
        if (document.readyState[0] === 'c') {
          onHashChange();
        }
      });
    }
  })();

  document.addEventListener('DOMContentLoaded', function(){

   var spc = document.createTextNode(' ');

   var firstheading = document.querySelectorAll('.content h2[id], .ap')[0];

   if (firstheading) {
    if (firstheading.classList)
     firstheading.classList.add('first');
   else
     firstheading.className += ' ' + ('first');


    var toc_elements = document.querySelectorAll('.content h2[id], .content h3[id]'); // $('.content h2[id], .ap')
    var toc_outer = document.createElement('figure');
    toc_outer.setAttribute('role', 'navigation');
    toc_outer.setAttribute('aria-describedby', 'toc_desc');
    toc_outer.innerHTML = '<figcaption id="toc_desc">On this page</figcaption><div class="figcontent"></div>';
    if (toc_outer.classList)
      toc_outer.classList.add('toc');
    else
      toc_outer.className += ' ' + ('toc');
    var toc_wrap = document.createElement('ul');
    var toc_elem = document.createElement('li');
    var nesting = false;
    var sub_wrap, last_elem;
    Array.prototype.forEach.call(toc_elements, function(el, i){ // … .each(…)
      // console.log(el.localName + ': ' + el.textContent + ' // ' + nesting);
      var cur_elem = toc_elem.cloneNode(true);
      if ((el.localName==="h3") && (nesting===false)) {
        sub_wrap = toc_wrap.cloneNode(false);
      }
      if ((el.localName==="h2") && (nesting===true)) {
        last_elem.appendChild(sub_wrap);
        nesting = false;
      }
      cur_elem.innerHTML = '<a class="' + el.getAttribute('class') + '" href="#' + el.getAttribute('id') + '">' + el.innerHTML + '</a>';

      // console.log(cur_elem);

      if (el.localName==="h3") {
        sub_wrap.appendChild(cur_elem);
        nesting = true;
      } else {
        toc_wrap.appendChild(cur_elem);
        last_elem = cur_elem;
      }
    });

    if (nesting===true) {
      last_elem.appendChild(sub_wrap);
      nesting = false;
    }

    toc_outer.querySelectorAll('.figcontent')[0].innerHTML = toc_wrap.outerHTML;

    var inner = document.querySelectorAll('.inner > :first-child')[0];
    inner.insertAdjacentHTML('beforebegin', toc_outer.outerHTML);

  }

  var plel = document.createElement('a');
  addclass(plel, 'permalink');
  plel.innerHTML = '¶';
  plel.setAttribute('title', "Permalink");

  var elements = document.querySelectorAll('.content h2[id], .content h3[id]');
  Array.prototype.forEach.call(elements, function(el, i){ // … .each(…)
    var cplel = plel.cloneNode(true);
    cplel.setAttribute('href', '#' + el.id);
    el.appendChild(spc.cloneNode(true));

    el.insertAdjacentHTML('beforeend', cplel.outerHTML);

  });

  if ((window.location.hostname !== 'www.w3.org') || (window.location.hostname !== 'w3.org')) {
    var notification = document.createElement('div');
    notification.className = 'not-w3c-notification';
    notification.innerHTML = 'This is an Editor’s draft, for <em>preview purposes only</em>. Please see, and link to, released tutorials at <a href="http://w3.org/WAI/tutorials">w3.org/WAI/tutorials/</a>.';
    document.getElementsByClassName('w3c-wai-header')[0].insertAdjacentHTML('beforebegin', notification.outerHTML);

    document.getElementsByTagName('title')[0].innerHTML = '[PREVIEW] ' + document.getElementsByTagName('title')[0].innerHTML;
  }


});
}());
