(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

        players.forEach(function (box) {
            var video = box.querySelector('video');
            var layer = box.querySelector('.poster-layer');
            var stream = box.getAttribute('data-stream');
            var hls = null;
            var prepared = false;

            function prepare() {
                if (prepared || !video || !stream) {
                    return;
                }
                prepared = true;

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
            }

            function start() {
                prepare();
                box.classList.add('is-playing');
                if (video) {
                    var promise = video.play();
                    if (promise && promise.catch) {
                        promise.catch(function () {});
                    }
                }
            }

            if (layer) {
                layer.addEventListener('click', start);
            }

            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        start();
                    }
                });
                video.addEventListener('play', function () {
                    box.classList.add('is-playing');
                });
            }

            window.addEventListener('pagehide', function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    });
})();
