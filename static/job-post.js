(function () {
  // Wait for the Greenhouse embed script, then load this job's application form
  function loadIframe() {
    var meta = document.getElementById('gh_id');
    if (!meta) return;
    window.Grnhse.Iframe.load(meta.getAttribute('content'));
  }

  function whenReady(name, callback) {
    var interval = 10;
    function check() {
      if (window[name]) {
        callback(window[name]);
      } else {
        window.setTimeout(check, interval);
      }
    }
    window.setTimeout(check, interval);
  }

  whenReady('Grnhse', loadIframe);
})();
