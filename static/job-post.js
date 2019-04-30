(function(){

  function loadIframe() {
    var id = document.getElementById('gh_id').getAttribute('content');
    window.Grnhse.Iframe.load(id);
  }

  function whenReady(name, callback) {
    var interval = 10;
    window.setTimeout(function() {
      if (window[name]) {
        callback(window[name]);
      } else {
        window.setTimeout(arguments.callee, interval);
      }
    }, interval);
  }

  whenReady('Grnhse', loadIframe);

})();