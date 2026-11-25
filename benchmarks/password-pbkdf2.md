# Password PBKDF2 benchmark

## Reproducible demo

The browser benchmark source is [`password-pbkdf2.html`](./password-pbkdf2.html).
Serve this directory or open the HTML through a local HTTP server, then press
**Run benchmark** and copy the rendered JSON:

```sh
python3 -m http.server 8765
```

Open `http://localhost:8765/password-pbkdf2.html` in Chrome. Android can use
ADB reverse-forwarding:

```sh
adb reverse tcp:8765 tcp:8765
adb shell am start -a android.intent.action.VIEW \
  -d http://127.0.0.1:8765/password-pbkdf2.html \
  com.android.chrome
```

The demo performs five runs for 8192, 32000, 64000, 128000, and 600000
iterations. It times `importKey(PBKDF2)` plus `deriveKey(AES-GCM 256)` and
reports the median and all five samples. It does not encrypt or decrypt plaintext.
This documents local key-derivation measurements for choosing a password utility
default. Mobile results are separate from desktop results; neither is a universal
latency guarantee.

## Desktop environment

- Platform: macOS 26.3.0, arm64
- Node.js: v26.3.0
- CPU: Apple M5 Max
- API: `crypto.subtle.importKey` followed by `subtle.deriveKey`
- Algorithm: PBKDF2-HMAC-SHA-256
- Derived key: 256-bit AES-GCM key
- Runs: 5 samples per iteration count

## Desktop results

| Iterations | Median |
| ---: | ---: |
| 8,192 | 0.76 ms |
| 32,000 | 2.69 ms |
| 64,000 | 5.70 ms |
| 128,000 | 9.79 ms |
| 600,000 | 42.63 ms |

The unoptimized Node/WebCrypto desktop run also recorded these individual 64k
samples: 5.27, 4.90, 6.18, 6.41, and 5.70 ms.

## Android environment

- Device: ASUS_AI2302 (ROG Phone 8)
- OS: Android 15, API 35
- SOC: Qualcomm SM8550 / Snapdragon 8 Gen 2
- Browser: Chrome 157.0.0.0
- Hardware concurrency: 8
- Reported device memory: 8 GB
- API: Chrome `crypto.subtle.importKey` followed by `subtle.deriveKey`
- Algorithm: PBKDF2-HMAC-SHA-256
- Derived key: 256-bit AES-GCM key
- Runs: 5 samples per iteration count

## Android results

| Iterations | Median | Individual samples (ms) |
| ---: | ---: | --- |
| 8,192 | 1.90 ms | 1.40, 1.50, 1.90, 4.40, 8.30 |
| 32,000 | 5.00 ms | 5.00, 5.00, 5.00, 5.40, 5.60 |
| 64,000 | 9.20 ms | 8.10, 9.10, 9.20, 9.40, 9.90 |
| 128,000 | 21.30 ms | 15.60, 16.20, 21.30, 24.10, 28.00 |
| 600,000 | 82.30 ms | 82.20, 82.30, 82.30, 82.40, 95.80 |

Relative to 600,000 iterations on Android:

- 64k is roughly 8.9 times faster.
- 128k is roughly 3.9 times faster.

## Interpretation

8192 iterations are too weak for a modern default. 64k and 128k both fit within
a small interactive latency budget on this Android 2023 flagship. 600k is around
82 ms for one PBKDF2 key derivation on Chrome here, before AES-GCM encryption or
decryption work.

Each full `password(secret).encrypt(value)` or `decrypt(envelope)` operation
derives the AES-GCM key once, so it pays PBKDF2 cost once. 64k is about 9 ms and
128k is about 21 ms in this test.

A server or modern desktop may use 600k or more, but mobile and browser devices
have widely different CPU and battery characteristics. These Android results
support keeping mobile latency as the primary default-selection constraint, but
more devices should be tested.

## Suggestions

- `64,000` favors low latency and bootstrap responsiveness.
- `128,000` offers a stronger offline guessing deterrent at a still modest
  Android median cost.
- `600,000` is preferable only when slower user-facing latency is explicitly
  acceptable or the secret is used in a server environment.

A repeat run produced 64k median 9.60 ms, 128k median 23.20 ms, and 600k median
82.30 ms. The Android medians were therefore stable for 64k and 600k, while 128k
varied slightly between 21.30 and 23.20 ms.

The utility should expose `iterations` so applications can tune this value.
Weak user passwords should additionally use an optional server-only pepper.
PBKDF2 parameters and a pepper cannot compensate for a trivially predictable
password, and future iteration increases require an interoperability strategy
for decrypting existing envelopes.
