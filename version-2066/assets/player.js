(function () {
  var instances = new WeakMap();

  function load(video, url, done) {
    if (instances.has(video)) {
      done();
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      instances.set(video, true);
      done();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      instances.set(video, hls);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        done();
      });
      return;
    }
    video.src = url;
    instances.set(video, true);
    done();
  }

  function start(video, overlay, url) {
    load(video, url, function () {
      var playResult = video.play();
      if (playResult && typeof playResult.then === 'function') {
        playResult.then(function () {
          if (overlay) {
            overlay.classList.add('is-hidden');
          }
        }).catch(function () {});
      } else if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }

  window.MoviePlayer = {
    mount: function (url) {
      var root = document.querySelector('[data-player]');
      if (!root) {
        return;
      }
      var video = root.querySelector('video');
      var overlay = root.querySelector('[data-play-overlay]');
      if (!video || !url) {
        return;
      }
      if (overlay) {
        overlay.addEventListener('click', function () {
          start(video, overlay, url);
        });
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          start(video, overlay, url);
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (overlay && video.currentTime === 0) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  };
})();
