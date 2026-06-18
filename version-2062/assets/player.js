import { H as Hls } from './hls.js';

const players = document.querySelectorAll('[data-player]');

const setStatus = (player, message) => {
  const status = player.querySelector('[data-player-status]');
  if (status) {
    status.textContent = message;
  }
};

const playVideo = async (player) => {
  const source = player.dataset.src;
  const video = player.querySelector('video');

  if (!source || !video) {
    setStatus(player, '未找到播放源');
    return;
  }

  setStatus(player, '正在加载播放源…');

  try {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      await video.play();
      player.classList.add('is-playing');
      setStatus(player, '正在播放');
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        await video.play();
        player.classList.add('is-playing');
        setStatus(player, '正在播放');
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) {
          setStatus(player, '播放源加载失败，请刷新页面重试');
        }
      });
      return;
    }

    setStatus(player, '当前浏览器不支持 HLS 播放');
  } catch (error) {
    setStatus(player, '播放被浏览器拦截，请再次点击播放');
  }
};

players.forEach((player) => {
  const button = player.querySelector('[data-play-button]');
  if (button) {
    button.addEventListener('click', () => playVideo(player));
  }
});
