document.addEventListener('DOMContentLoaded', function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));

  shells.forEach(function (shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-player-overlay]');

    if (!video) {
      return;
    }

    var src = video.getAttribute('data-video-src');
    var hlsInstance = null;

    var attachSource = function () {
      if (!src || video.getAttribute('data-ready') === '1') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && Hls.isSupported()) {
        hlsInstance = new Hls({ enableWorker: true });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = src;
      }

      video.setAttribute('data-ready', '1');
    };

    var startPlayback = function () {
      attachSource();
      shell.classList.add('is-playing');
      video.setAttribute('controls', 'controls');

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          video.muted = true;
          video.play().catch(function () {});
        });
      }
    };

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
});
