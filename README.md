# SweepEQ

**Acoustic measurement and PEQ optimization tool** — measure your room or headphone frequency response and generate parametric EQ filters with a single click.

![Screenshot](https://img.shields.io/badge/status-beta-blue)
![License](https://img.shields.io/badge/license-MIT%20%2B%20LGPL-green)

## Features

- **Sweep measurement** — plays a log-spaced sine sweep through your speakers/headphones and captures the response via microphone
- **Frequency response chart** — real-time visualization with dual Y-axis (left: FR in dB, right: PEQ in dB)
- **Auto PEQ** — generates optimal parametric EQ filters using gradient-based optimization (AdaBelief optimizer, ported from [autoeq-c](https://github.com/peqdb/autoeq-c))
- **Multi-channel support** — select any input/output channel dynamically
- **Low-frequency tilt** — target curve can be sloped for bass boost/cut
- **Manual PEQ editing** — add, remove, and tweak individual PK / LSC / HSC filters
- **Import / Export** — JSON format with full measurement and PEQ data; REW-compatible export
- **Internationalization** — Chinese, English, French, Spanish, Russian, German, Japanese, Korean, Portuguese
- **Auto input level** — one-click microphone gain calibration

## Quick Start

### Option 1: Local HTTP server (recommended)

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

> **Note:** Chrome blocks microphone access on `file://` protocol. Use a local HTTP server.

### Option 2: GitHub Pages

Push the repository and enable GitHub Pages — the tool runs entirely in the browser with no backend required.

## Usage

1. **Select input/output devices** and channels
2. Click **▶ 开始扫频** (Start Sweep) to measure frequency response
3. Adjust the PEQ parameters and click **▶ 生成** (Generate) for auto PEQ
4. Fine-tune individual filters or export the result

## Project Structure

```
sweepeq/
├── index.html          # Main HTML page
├── style.css           # Styles
├── app.js              # Application logic (MIT license)
├── peq.js              # autoeq-c algorithm port (LGPL-3.0)
├── README.md
├── LICENSE             # MIT License
└── LICENSE.peq         # LGPL-3.0 (applies to peq.js only)
```

## License

- **app.js, style.css, index.html** — [MIT License](LICENSE)
- **peq.js** — [LGPL-3.0-or-later](LICENSE.peq) (ported from [autoeq-c](https://github.com/peqdb/autoeq-c) by PEQdB Inc.)

## Browser Support

| Feature | Chrome | Firefox | Safari |
|---------|--------|---------|--------|
| Sweep measurement | ✅ | ✅ | ✅ |
| Output device switching | ✅ 110+ | ❌ | ❌ |
| Multi-channel | ✅ | ✅ | ✅ |
