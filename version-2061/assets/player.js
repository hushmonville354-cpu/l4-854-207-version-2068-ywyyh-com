(function () {
    function initPlayer(box) {
        var video = box.querySelector("video[data-stream]");
        var button = box.querySelector(".player-start");
        var hlsInstance = null;
        var ready = false;

        if (!video || !button) {
            return;
        }

        function attachStream() {
            if (ready) {
                return;
            }

            var stream = video.getAttribute("data-stream");

            if (!stream) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                ready = true;
                return;
            }

            video.src = stream;
            ready = true;
        }

        function beginPlayback() {
            attachStream();
            var promise = video.play();

            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    box.classList.remove("playing");
                });
            }
        }

        button.addEventListener("click", function () {
            box.classList.add("playing");
            beginPlayback();
        });

        video.addEventListener("play", function () {
            box.classList.add("playing");
        });

        video.addEventListener("pause", function () {
            if (!video.ended) {
                box.classList.remove("playing");
            }
        });

        video.addEventListener("ended", function () {
            box.classList.remove("playing");
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                beginPlayback();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-player]"), initPlayer);
})();
