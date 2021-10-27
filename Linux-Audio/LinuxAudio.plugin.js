const config = {
    info: {
        name: "Linux Audio",
        id: "LinuxAudio",
        description: "Shrink channel listAdd audio to streams on linux",
        author: "DeathKhan",
        updateUrl: "https://raw.githubusercontent.com/DeathKhan/DiscordPlugins/master/Linux-Audio/LinuxAudio.plugin.js"
    },
}


class LinuxAudio {
    getName() { return config.info.name; }
    getDescription() { return config.info.description; }
    getVersion() { return config.info.version; }
    getAuthor() { return config.info.author; }

    start() {
navigator.mediaDevices.chromiumGetDisplayMedia =
  navigator.mediaDevices.getDisplayMedia;
async function getDisplayMedia(
  { video: video, audio: audio } = { video: true, audio: true }
) {
  let captureSystemAudioStream = await navigator.mediaDevices.getUserMedia({
    audio: {
        // We add our audio constraints here, to get a list of supported constraints use navigator.mediaDevices.getSupportedConstraints();
        // We must capture a microphone, we use default since its the only deviceId that is the same for every Chromium user
        deviceId: { exact: "default" },
        // We want auto gain control, noise cancellation and noise suppression disabled so that our stream won't sound bad
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
        // By default Chromium sets channel count for audio devices to 1, we want it to be stereo in case we find a way for Discord to accept stereo screenshare too
        channelCount: 2,
        // You can set more audio constraints here, bellow are some examples
        latency: 0,
        sampleRate: 48000,
        sampleSize: 16,
        volume: 1.0
    }
  });
  let [track] = captureSystemAudioStream.getAudioTracks();
  const gdm = await navigator.mediaDevices.chromiumGetDisplayMedia({
    video: true,
    audio: true,
  });
  gdm.addTrack(track);
  return gdm;
}
navigator.mediaDevices.getDisplayMedia = getDisplayMedia;
var gdm = await navigator.mediaDevices.getDisplayMedia({
  audio: true,
  video: true,
});
//Stop the fake screenshare after getting permission
gdm.getTracks().forEach(track => track.stop());
}
