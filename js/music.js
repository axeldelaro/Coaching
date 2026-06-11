// ============================================================
// RECOMP — Lecteur Musical
// Playlist persistante · YouTube IFrame API · Audio HTML5
// ============================================================

window.MusicPlayer = (() => {
  const LS_KEY = 'rc_playlist';
  let playlist = [];
  let currentIndex = 0;
  let isPlaying = false;
  let shuffle = false;
  let ytPlayer = null;
  let audioEl = null;
  let onStateChange = null; // callback UI

  function load() {
    try { playlist = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { playlist = []; }
  }
  function save() { localStorage.setItem(LS_KEY, JSON.stringify(playlist)); }
  function notify() { if (onStateChange) onStateChange(getState()); }

  // --- YouTube helpers ---
  function extractYTId(url) {
    if (!url) return null;
    let m = url.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function ensureYTAPI() {
    return new Promise(resolve => {
      if (window.YT && window.YT.Player) { resolve(); return; }
      if (!document.getElementById('yt-api-script')) {
        const s = document.createElement('script');
        s.id = 'yt-api-script';
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
      window.onYouTubeIframeAPIReady = resolve;
    });
  }

  function getOrCreateContainer() {
    let c = document.getElementById('yt-player-wrap');
    if (!c) {
      c = document.createElement('div');
      c.id = 'yt-player-wrap';
      c.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;';
      c.innerHTML = '<div id="yt-player"></div>';
      document.body.appendChild(c);
    }
    return document.getElementById('yt-player');
  }

  async function playYT(videoId) {
    await ensureYTAPI();
    const el = getOrCreateContainer();
    if (ytPlayer) { ytPlayer.destroy(); ytPlayer = null; }
    ytPlayer = new YT.Player(el.id, {
      height: '1', width: '1', videoId,
      playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1 },
      events: {
        onReady: e => { e.target.playVideo(); isPlaying = true; notify(); },
        onStateChange: e => {
          if (e.data === YT.PlayerState.ENDED) next();
          isPlaying = e.data === YT.PlayerState.PLAYING;
          notify();
        },
        onError: () => { next(); }
      }
    });
    // Recreate the div for next time
    const wrap = document.getElementById('yt-player-wrap');
    if (wrap && !document.getElementById('yt-player')) {
      const d = document.createElement('div'); d.id = 'yt-player'; wrap.appendChild(d);
    }
  }

  // --- HTML5 Audio ---
  function playAudio(url) {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.addEventListener('ended', () => next());
      audioEl.addEventListener('error', () => next());
    }
    audioEl.src = url;
    audioEl.play().then(() => { isPlaying = true; notify(); }).catch(() => { next(); });
  }

  // --- Controls ---
  function playTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    stopAll();
    currentIndex = index;
    const track = playlist[index];
    if (track.type === 'youtube') playYT(track.videoId);
    else playAudio(track.url);
  }

  function stopAll() {
    if (ytPlayer && ytPlayer.stopVideo) try { ytPlayer.stopVideo(); } catch {}
    if (audioEl) { audioEl.pause(); audioEl.currentTime = 0; }
    isPlaying = false;
  }

  function toggle() {
    if (!playlist.length) return;
    if (isPlaying) {
      if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
      if (audioEl && !audioEl.paused) audioEl.pause();
      isPlaying = false;
    } else {
      if (currentIndex >= playlist.length) currentIndex = 0;
      const track = playlist[currentIndex];
      if (track.type === 'youtube' && ytPlayer && ytPlayer.playVideo) ytPlayer.playVideo();
      else if (track.type === 'audio' && audioEl && audioEl.src) audioEl.play();
      else playTrack(currentIndex);
      isPlaying = true;
    }
    notify();
  }

  function next() {
    if (!playlist.length) return;
    if (shuffle) currentIndex = Math.floor(Math.random() * playlist.length);
    else currentIndex = (currentIndex + 1) % playlist.length;
    playTrack(currentIndex);
  }

  function prev() {
    if (!playlist.length) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentIndex);
  }

  function toggleShuffle() { shuffle = !shuffle; notify(); }

  // --- Playlist management ---
  function addTrack(url, title) {
    const ytId = extractYTId(url);
    if (ytId) {
      playlist.push({ type: 'youtube', videoId: ytId, title: title || 'YouTube — ' + ytId, url });
    } else if (url) {
      playlist.push({ type: 'audio', url, title: title || url.split('/').pop().split('?')[0] || 'Audio' });
    }
    save(); notify();
  }

  function removeTrack(index) {
    if (index === currentIndex) stopAll();
    playlist.splice(index, 1);
    if (currentIndex >= playlist.length) currentIndex = Math.max(0, playlist.length - 1);
    save(); notify();
  }

  function moveTrack(from, to) {
    const [item] = playlist.splice(from, 1);
    playlist.splice(to, 0, item);
    if (currentIndex === from) currentIndex = to;
    save(); notify();
  }

  function getState() {
    return {
      playlist, currentIndex, isPlaying, shuffle,
      current: playlist[currentIndex] || null,
      count: playlist.length
    };
  }

  function setOnStateChange(cb) { onStateChange = cb; }

  load();
  return {
    addTrack, removeTrack, moveTrack,
    playTrack, toggle, next, prev, toggleShuffle, stopAll,
    getState, setOnStateChange, extractYTId
  };
})();
