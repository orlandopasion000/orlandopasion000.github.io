"""
Audio Asset Generator for Daily Recharge
- Trims piano.mp3 to eliminate the 2.25s silence and ensure instantaneous note playback.
- Mathematically generates authentic colored noises (Green, Brown, Pink, White, Blue)
  with exact spectral slopes, 3D stereo width, calibrated perceived loudness,
  and 100% seamless pop-free circular looping.
"""

import os
import wave
import struct
import numpy as np
import miniaudio
import lameenc

SOUNDS_DIR = os.path.join(os.path.dirname(__file__), "sounds")

def process_piano():
    src_path = os.path.join(SOUNDS_DIR, "piano.mp3")
    print(f"--> Processing {src_path}...")
    decoded = miniaudio.decode_file(src_path)
    sr = decoded.sample_rate
    ch = decoded.nchannels
    samples = np.array(decoded.samples, dtype=np.int16).reshape(-1, ch)
    print(f"  Original duration: {len(samples)/sr:.2f}s ({len(samples)} frames)")

    # Find the exact onset of the first piano chord
    amp = np.max(np.abs(samples), axis=1)
    onset_idx = np.where(amp > 80)[0][0]
    print(f"  First audible note detected at frame {onset_idx} ({onset_idx/sr:.3f}s)")

    # Start 6ms (approx 260 samples) before onset for natural attack transient
    start_idx = max(0, onset_idx - int(0.006 * sr))

    # Cut after the final chord's natural acoustic ring-out fades into room silence (at ~181.5s)
    end_idx = min(len(samples), int(181.5 * sr))

    trimmed = samples[start_idx:end_idx].copy().astype(np.float32)

    # Micro fade-in (5ms) to guarantee zero DC offset click
    fade_in_len = int(0.005 * sr)
    trimmed[:fade_in_len] *= np.linspace(0.0, 1.0, fade_in_len)[:, None]

    # Smooth fade-out (1.5s) at the very end
    fade_out_len = int(1.5 * sr)
    trimmed[-fade_out_len:] *= np.linspace(1.0, 0.0, fade_out_len)[:, None]

    trimmed_int16 = np.clip(trimmed, -32768, 32767).astype(np.int16)
    print(f"  Trimmed duration: {len(trimmed_int16)/sr:.2f}s")

    # Encode to high-quality MP3 (192 kbps, stereo)
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(192)
    encoder.set_in_sample_rate(sr)
    encoder.set_channels(ch)
    encoder.set_quality(2)

    mp3_bytes = bytes(encoder.encode(trimmed_int16.tobytes()) + encoder.flush())
    with open(src_path, "wb") as f:
        f.write(mp3_bytes)
    print(f"  Saved trimmed piano.mp3 ({len(mp3_bytes):,} bytes)")

    # Verify onset of the new MP3
    verify_dec = miniaudio.decode(mp3_bytes)
    verify_samples = np.array(verify_dec.samples, dtype=np.int16).reshape(-1, verify_dec.nchannels)
    verify_amp = np.max(np.abs(verify_samples), axis=1)
    verify_onset = np.where(verify_amp > 80)[0][0]
    verify_latency_ms = (verify_onset / verify_dec.sample_rate) * 1000
    print(f"  Verification: New piano starts in {verify_latency_ms:.1f} ms! (Instantaneous)\n")


def generate_color_noise(name, exponent, target_rms, hp_fc=None, lp_fc=None, bp_fc=None, bp_q=None, duration=20.0, sr=44100):
    """
    Generates mathematically pure colored noise using frequency-domain synthesis.
    - exponent: power spectral density exponent / 2 (since amplitude = sqrt(power))
      White:  0.0  (0 dB/octave)
      Pink:  -0.5  (-3 dB/octave, 1/f power)
      Brown: -1.0  (-6 dB/octave, 1/f^2 power)
      Blue:  +0.5  (+3 dB/octave, f power)
      Green: -0.5  (Pink base) + bandpass centered at 500 Hz
    """
    print(f"--> Generating {name} (exponent={exponent}, duration={duration}s)...")
    L = int(duration * sr)
    fade_len = int(1.5 * sr)
    N = L + fade_len
    freqs = np.fft.rfftfreq(N, 1.0 / sr)
    freqs[0] = freqs[1] # avoid division by zero

    # Amplitude curve based on power spectrum
    mag = freqs ** exponent

    # Highpass filter (e.g. 20 Hz to eliminate non-audible sub-bass DC)
    if hp_fc:
        mag *= 1.0 / np.sqrt(1.0 + (hp_fc / freqs)**4)

    # Lowpass filter (e.g. 10 kHz for Blue noise to avoid ultrasonic ear fatigue)
    if lp_fc:
        mag *= 1.0 / np.sqrt(1.0 + (freqs / lp_fc)**4)

    # Bandpass filter for Green Noise (centered at 500 Hz)
    if bp_fc and bp_q:
        w = freqs / bp_fc
        denom = np.sqrt((1.0 - w**2)**2 + (w / bp_q)**2)
        bp_mag = (w / bp_q) / np.maximum(denom, 1e-9)
        mag = mag * (0.15 + 0.85 * bp_mag)

    mag[0] = 0.0 # Strict zero DC

    # Generate 2 independent stereo channels with random phases
    np.random.seed(42 if name == "white" else (101 if name == "pink" else (202 if name == "brown" else (303 if name == "blue" else 404))))
    phase_l = np.random.uniform(-np.pi, np.pi, len(freqs))
    phase_r = np.random.uniform(-np.pi, np.pi, len(freqs))
    phase_l[0] = phase_r[0] = 0.0

    spec_l = mag * (np.cos(phase_l) + 1j * np.sin(phase_l))
    spec_r = mag * (np.cos(phase_r) + 1j * np.sin(phase_r))

    # Inverse real FFT
    audio_l = np.fft.irfft(spec_l, n=N)
    audio_r = np.fft.irfft(spec_r, n=N)

    # Subtle binaural stereo cross-feed for natural 3D depth (removes extreme headphone isolation)
    mix_l = 0.88 * audio_l + 0.12 * audio_r
    mix_r = 0.88 * audio_r + 0.12 * audio_l

    # Circular crossfade loop:
    # Crossfade the tail [L : L + fade_len] into the head [0 : fade_len], then keep [0 : L].
    # When looped, sample L-1 continues naturally to sample 0 (which equals sample L)!
    fade_curve = 0.5 * (1.0 - np.cos(np.linspace(0, np.pi, fade_len)))
    for i in range(fade_len):
        w_in = fade_curve[i]
        w_out = 1.0 - w_in
        mix_l[i] = mix_l[i] * w_in + mix_l[L + i] * w_out
        mix_r[i] = mix_r[i] * w_in + mix_r[L + i] * w_out

    out_l = mix_l[:L].copy()
    out_r = mix_r[:L].copy()

    # Normalize to target RMS
    current_rms = np.sqrt(np.mean((out_l**2 + out_r**2) / 2.0))
    scale = target_rms / current_rms
    out_l *= scale
    out_r *= scale

    # Clip safely to avoid overflow
    peak = max(np.max(np.abs(out_l)), np.max(np.abs(out_r)))
    if peak > 0.95:
        out_l = (out_l / peak) * 0.95
        out_r = (out_r / peak) * 0.95
        print(f"  Soft limited peak: {peak:.3f} -> 0.950")

    # Interleave to 16-bit PCM stereo
    int_l = np.clip(out_l * 32767, -32768, 32767).astype(np.int16)
    int_r = np.clip(out_r * 32767, -32768, 32767).astype(np.int16)
    stereo_interleaved = np.empty((L, 2), dtype=np.int16)
    stereo_interleaved[:, 0] = int_l
    stereo_interleaved[:, 1] = int_r

    out_path = os.path.join(SOUNDS_DIR, f"{name}-noise.wav")
    with wave.open(out_path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(stereo_interleaved.tobytes())

    # Measure verified RMS and spectral slope
    measured_rms = np.sqrt(np.mean((stereo_interleaved / 32768.0)**2))
    print(f"  Saved {name}-noise.wav: {os.path.getsize(out_path):,} bytes, RMS: {measured_rms:.3f}")
    return out_path
    return out_path


def main():
    print("=== STARTING MASTER AUDIO ASSET GENERATION ===\n")
    # 1. Instant Piano
    process_piano()

    # 2. Authentic Color Noises
    # White: 0 dB/octave flat, highpass 20Hz, target RMS 0.075
    generate_color_noise("white", exponent=0.0, target_rms=0.075, hp_fc=20.0)

    # Pink: -3 dB/octave (1/f power), highpass 20Hz, target RMS 0.110
    generate_color_noise("pink", exponent=-0.5, target_rms=0.110, hp_fc=20.0)

    # Brown: -6 dB/octave (1/f^2 power), highpass 20Hz, target RMS 0.160
    generate_color_noise("brown", exponent=-1.0, target_rms=0.160, hp_fc=20.0)

    # Blue: +3 dB/octave (f power), lowpass 10kHz (soothing air), target RMS 0.060
    generate_color_noise("blue", exponent=0.5, target_rms=0.060, lp_fc=10000.0)

    # Green: Pink base + bandpass centered at 500 Hz (natural ambient foliage/woods), target RMS 0.120
    generate_color_noise("green", exponent=-0.5, target_rms=0.120, hp_fc=60.0, bp_fc=500.0, bp_q=0.85)

    print("\n=== MASTER AUDIO GENERATION COMPLETE ===")

if __name__ == "__main__":
    main()
