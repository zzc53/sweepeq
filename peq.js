/*
 * PEQ optimizer — generates PK/LSC/HSC biquad filters to correct
 * a measured frequency response toward a flat target.
 *
 * This is a clean-room implementation based on the published description
 * of gradient-based PEQ optimization with AdaBelief.
 *
 * SPDX-License-Identifier: MIT
 */

(function() {
  'use strict';

  // ---- Types ----
  const AE = { PK: 0, LSC: 1, HSC: 2 };

  // ---- Math helpers ----
  function _clip(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }
  function _sq(x) { return x * x; }
  function _exp10(x) { return Math.exp(Math.LN10 * x); }
  function _q2bw(Q) { return 2 / Math.LN2 * Math.asinh(0.5 / Q); }
  function _bw2q(bw) { return 0.5 / Math.sinh(0.5 * Math.LN2 * bw); }
  function _search(arr, v) {
    let idx = -1, best = 1e9;
    for (let i = 0; i < arr.length; i++) {
      const d = Math.abs(arr[i] - v);
      if (d < best) { best = d; idx = i; }
    }
    return idx;
  }

  // ---- Biquad coefficient computation (with analytic gradients) ----
  // Each function returns {b0,b1,b2,a0,a1,a2, db0/dA,...}
  // for the three filter types.

  // Peaking (PK)
  function _bqPK(A, cos_w, alpha) {
    const rA = 1 / A;
    return {
      b0: 1 + alpha * A,         db0_dA: alpha,          db0_dalpha: A,        db0_dcos: 0,
      b1: -2 * cos_w,            db1_dA: 0,                                     db1_dcos: -2,
      b2: 1 - alpha * A,         db2_dA: -alpha,          db2_dalpha: -A,       db2_dcos: 0,
      a0: (A + alpha) * rA,      da0_dA: -alpha * rA*rA,  da0_dalpha: rA,       da0_dcos: 0,
      a1: -2 * cos_w,            da1_dA: 0,                                     da1_dcos: -2,
      a2: (A - alpha) * rA,      da2_dA: alpha * rA*rA,   da2_dalpha: -rA,      da2_dcos: 0,
    };
  }

  // Low-Shelf (LSC)
  function _bqLSC(A, cos_w, alpha) {
    const p1 = A + 1, m1 = A - 1;
    const sqrtA = Math.sqrt(A);
    const k = 2 * sqrtA * alpha;
    const dk_dA = alpha / sqrtA;
    const dk_dalpha = 2 * sqrtA;

    const b0 = A * (p1 - m1 * cos_w + k);
    const b1 = 2 * A * (m1 - p1 * cos_w);
    const b2 = A * (p1 - m1 * cos_w - k);
    const a0 = p1 + m1 * cos_w + k;
    const a1 = -2 * (p1 * cos_w + m1);
    const a2 = p1 + m1 * cos_w - k;

    // Derivatives: db0/dA = (p1 - m1*cos_w + k) + A*(1 - cos_w + dk_dA)
    const db0_dA = (p1 - m1 * cos_w + k) + A * (1 - cos_w + dk_dA);
    const db1_dA = 2 * (m1 - p1 * cos_w) + 2 * A * (1 - cos_w);
    const db2_dA = (p1 - m1 * cos_w - k) + A * (1 - cos_w - dk_dA);
    const da0_dA = 1 + cos_w + dk_dA;
    const da1_dA = -2 * (cos_w + 1);
    const da2_dA = 1 + cos_w - dk_dA;

    return {
      b0, b1, b2, a0, a1, a2,
      db0_dA, db1_dA, db2_dA, da0_dA, da1_dA, da2_dA,
      db0_dalpha: A * dk_dalpha,  db2_dalpha: -A * dk_dalpha,
      da0_dalpha: dk_dalpha,      da2_dalpha: -dk_dalpha,
      db0_dcos: -A * m1,          db1_dcos: -2 * A * p1,
      db2_dcos: -A * m1,          da0_dcos: m1,
      da1_dcos: -2 * p1,          da2_dcos: m1,
    };
  }

  // High-Shelf (HSC)
  function _bqHSC(A, cos_w, alpha) {
    const p1 = A + 1, m1 = A - 1;
    const sqrtA = Math.sqrt(A);
    const k = 2 * sqrtA * alpha;
    const dk_dA = alpha / sqrtA;
    const dk_dalpha = 2 * sqrtA;

    const b0 = A * (p1 + m1 * cos_w + k);
    const b1 = -2 * A * (p1 * cos_w + m1);
    const b2 = A * (p1 + m1 * cos_w - k);
    const a0 = p1 - m1 * cos_w + k;
    const a1 = 2 * (m1 - p1 * cos_w);
    const a2 = p1 - m1 * cos_w - k;

    const db0_dA = (p1 + m1 * cos_w + k) + A * (1 + cos_w + dk_dA);
    const db1_dA = -2 * (p1 * cos_w + m1) - 2 * A * (cos_w + 1);
    const db2_dA = (p1 + m1 * cos_w - k) + A * (1 + cos_w - dk_dA);
    const da0_dA = 1 - cos_w + dk_dA;
    const da1_dA = 2 * (1 - cos_w);
    const da2_dA = 1 - cos_w - dk_dA;

    return {
      b0, b1, b2, a0, a1, a2,
      db0_dA, db1_dA, db2_dA, da0_dA, da1_dA, da2_dA,
      db0_dalpha: A * dk_dalpha,  db2_dalpha: -A * dk_dalpha,
      da0_dalpha: dk_dalpha,      da2_dalpha: -dk_dalpha,
      db0_dcos: A * m1,           db1_dcos: -2 * A * p1,
      db2_dcos: A * m1,           da0_dcos: -m1,
      da1_dcos: -2 * p1,          da2_dcos: -m1,
    };
  }

  const _BIQUAD_FNS = [_bqPK, _bqLSC, _bqHSC];

  // ---- Compute filter magnitude spectrum and accumulate into y ----
  // y[k] += 10*log10(|H(freqs[k])|^2)
  function _spectrum(type, f0, gain, Q, fs, freqs, y) {
    const A = _exp10(gain / 40);
    const w0 = 2 * Math.PI * f0 / fs;
    const cos_w = Math.cos(w0), sin_w = Math.sin(w0);
    const alpha = sin_w * 0.5 / Q;
    const s = _BIQUAD_FNS[type](A, cos_w, alpha);

    const sumB = s.b0 + s.b1 + s.b2;
    const sumA = s.a0 + s.a1 + s.a2;
    const b_x0 = _sq(sumB);
    const b_x1 = -4 * (s.b0*s.b1 + 4*s.b0*s.b2 + s.b1*s.b2);
    const b_x2 = 16 * s.b0 * s.b2;
    const a_x0 = _sq(sumA);
    const a_x1 = -4 * (s.a0*s.a1 + 4*s.a0*s.a2 + s.a1*s.a2);
    const a_x2 = 16 * s.a0 * s.a2;

    for (let k = 0; k < freqs.length; k++) {
      const phi = _sq(Math.sin(Math.PI / fs * freqs[k]));
      const bPoly = b_x0 + phi * (b_x1 + phi * b_x2);
      const aPoly = a_x0 + phi * (a_x1 + phi * a_x2);
      y[k] += 10 * Math.log10(Math.max(bPoly / aPoly, 1e-12));
    }
  }

  // ---- Single-point filter gain (used by PEQManager in app.js) ----
  function _filterGainAt(type, f0, gainDB, Q, freq, fs) {
    const A = _exp10(gainDB / 40);
    const w0 = 2 * Math.PI * f0 / fs;
    const cos_w = Math.cos(w0), sin_w = Math.sin(w0);
    const alpha = sin_w * 0.5 / Q;
    const s = _BIQUAD_FNS[type](A, cos_w, alpha);

    const phi = _sq(Math.sin(Math.PI / fs * freq));
    const sumB = s.b0 + s.b1 + s.b2;
    const sumA = s.a0 + s.a1 + s.a2;
    const b_x0 = _sq(sumB);
    const b_x1 = -4 * (s.b0*s.b1 + 4*s.b0*s.b2 + s.b1*s.b2);
    const b_x2 = 16 * s.b0 * s.b2;
    const a_x0 = _sq(sumA);
    const a_x1 = -4 * (s.a0*s.a1 + 4*s.a0*s.a2 + s.a1*s.a2);
    const a_x2 = 16 * s.a0 * s.a2;
    const bPoly = b_x0 + phi * (b_x1 + phi * b_x2);
    const aPoly = a_x0 + phi * (a_x1 + phi * a_x2);
    return 10 * Math.log10(Math.max(bPoly / aPoly, 1e-12));
  }

  // ---- Prominence-based peak detection (scipy-compatible) ----
  function _largestPeak(x, freqs, lim) {
    const K = freqs.length;
    const peaks = [];

    for (let i = 1; i < K - 1; i++) {
      if (freqs[i] < lim.lo || freqs[i] > lim.hi) continue;
      if (x[i-1] >= x[i]) continue;
      let i_ahead = i + 1;
      while (i_ahead < K - 1 && x[i_ahead] === x[i]) i_ahead++;
      if (x[i_ahead] < x[i]) {
        peaks.push(Math.floor((i + i_ahead - 1) / 2));
        i = i_ahead;
      }
    }
    if (peaks.length === 0) return { idx: -1, width: 0, height: 0 };

    const nPeaks = peaks.length;
    const leftBases = new Array(nPeaks);
    const rightBases = new Array(nPeaks);
    const prominences = new Array(nPeaks);

    for (let p = 0; p < nPeaks; p++) {
      const peak = peaks[p];
      const xPeak = x[peak];
      leftBases[p] = peak;
      let leftMin = xPeak;
      for (let i = peak; i >= 0 && x[i] <= xPeak; i--) {
        if (x[i] < leftMin) { leftMin = x[i]; leftBases[p] = i; }
      }
      rightBases[p] = peak;
      let rightMin = xPeak;
      for (let i = peak; i < K && x[i] <= xPeak; i++) {
        if (x[i] < rightMin) { rightMin = x[i]; rightBases[p] = i; }
      }
      prominences[p] = xPeak - Math.max(leftMin, rightMin);
    }

    let bestSize = 0;
    let best = { idx: -1, width: 0, height: 0 };
    for (let p = 0; p < nPeaks; p++) {
      const peak = peaks[p];
      const xPeak = x[peak];
      const halfHeight = xPeak - 0.5 * prominences[p];
      let i = peak;
      while (leftBases[p] < i && halfHeight < x[i]) i--;
      const leftIP = x[i] < halfHeight
        ? i + (halfHeight - x[i]) / (x[i+1] - x[i])
        : i;
      i = peak;
      while (i < rightBases[p] && halfHeight < x[i]) i++;
      const rightIP = x[i] < halfHeight
        ? i - (halfHeight - x[i]) / (x[i-1] - x[i])
        : i;
      const width = rightIP - leftIP;
      const size = width * xPeak;
      if (size > bestSize) {
        bestSize = size;
        best = { idx: peak, width, height: xPeak };
      }
    }
    return best;
  }

  // ---- Filter initializers ----
  function _initPK(y, freqs, fs, limF0, limGain, limQ) {
    let rect = y.map(v => Math.max(v, 0));
    const peak = _largestPeak(rect, freqs, limF0);
    rect = y.map(v => Math.max(-v, 0));
    const dip = _largestPeak(rect, freqs, limF0);
    const p = peak.width * peak.height > dip.width * dip.height ? peak : dip;
    if (p.idx < 0) return { f0: 1000, gain: 0, Q: 1 };
    const f0 = freqs[p.idx];
    const gain = p.idx === peak.idx ? peak.height : -dip.height;
    const bw = p.width * Math.log2(freqs[1] / freqs[0]);
    const bwExp2 = Math.pow(2, bw);
    const Q = _clip(Math.sqrt(bwExp2) / (bwExp2 - 1), limQ.lo, limQ.hi);
    return { f0, gain: _clip(gain, limGain.lo, limGain.hi), Q };
  }

  function _initLSC(y, freqs, _fs, limF0, limGain, limQ) {
    const K = freqs.length;
    const fl = { lo: Math.max(limF0.lo, 40), hi: Math.min(limF0.hi, 10000) };
    let best = 0, bestIdx = -1, accum = 0;
    for (let k = 0; k < K; k++) {
      accum += y[k];
      const avg = Math.abs(accum / (k + 1));
      if (avg > best) { best = avg; bestIdx = k; }
    }
    if (bestIdx < 0) return { f0: 100, gain: 0, Q: 0.707 };
    let f0 = _clip(freqs[bestIdx], fl.lo, fl.hi);
    const Q = _clip(0.70710678, limQ.lo, limQ.hi);
    const w = new Float64Array(K);
    _spectrum(AE.LSC, f0, 1, Q, 48000, freqs, w);
    let p = 0, c = 0;
    for (let k = 0; k < K; k++) { p += w[k] * y[k]; c += Math.abs(w[k]); }
    const gain = _clip(c > 0 ? p / c : 0, limGain.lo, limGain.hi);
    return { f0, gain, Q };
  }

  function _initHSC(y, freqs, _fs, limF0, limGain, limQ) {
    const K = freqs.length;
    const fl = { lo: Math.max(limF0.lo, 40), hi: Math.min(limF0.hi, 10000) };
    let best = 0, bestIdx = -1, accum = 0;
    for (let k = 0; k < K; k++) {
      accum += y[K - 1 - k];
      const avg = Math.abs(accum / (k + 1));
      if (avg > best) { best = avg; bestIdx = K - 1 - k; }
    }
    if (bestIdx < 0) return { f0: 10000, gain: 0, Q: 0.707 };
    let f0 = _clip(freqs[bestIdx], fl.lo, fl.hi);
    const Q = _clip(0.70710678, limQ.lo, limQ.hi);
    const w = new Float64Array(K);
    _spectrum(AE.HSC, f0, 1, Q, 48000, freqs, w);
    let p = 0, c = 0;
    for (let k = 0; k < K; k++) { p += w[k] * y[k]; c += Math.abs(w[k]); }
    const gain = _clip(c > 0 ? p / c : 0, limGain.lo, limGain.hi);
    return { f0, gain, Q };
  }

  const _INIT_FNS = [_initPK, _initLSC, _initHSC];

  // ---- Adaptive bilateral smoothing ----
  function _adaptiveSmooth(freqs, r, smoothF0, smoothF1, smoothLo, smoothHi,
      biasF0, biasF1, biasF2, biasF3, biasLo, biasMd, biasHi, clipF) {
    const K = freqs.length;
    const H = Math.max(1, Math.round(K / 8));
    const logF0 = Math.log(smoothF0), logF1 = Math.log(smoothF1);
    const bL0 = Math.log(biasF0), bL1 = Math.log(biasF1);
    const bL2 = Math.log(biasF2), bL3 = Math.log(biasF3);
    const x = r.slice();
    const clipIdx = _search(freqs, clipF);

    function _sgm(xx, x0, x1) {
      const SMOOTH = 4;
      const slope = SMOOTH / (x1 - x0);
      const mid = 0.5 * (x0 + x1);
      return 0.5 * Math.tanh(0.5 * slope * (xx - mid)) + 0.5;
    }

    for (let k = 0; k < K; k++) {
      const lk = Math.log(freqs[k]);
      const xk = x[k];
      const sigma = smoothLo + (smoothHi - smoothLo) * _sgm(lk, logF0, logF1);
      const bias = biasLo + (biasMd - biasLo) * _sgm(lk, bL0, bL1)
                 + (biasHi - biasMd) * _sgm(lk, bL2, bL3);
      let weightedSum = 0, weightSum = 0;
      for (let j = -H; j <= H; j++) {
        let s = k + j;
        s = s < 0 ? 0 : s > clipIdx ? clipIdx : s;
        const xs = x[s];
        const dSpatial = _sq(j * sigma);
        const dRange = bias * (xs - xk);
        const w = Math.exp(-0.5 * dSpatial + dRange);
        weightedSum += w * xs;
        weightSum += w;
      }
      r[k] = weightedSum / weightSum;
    }
  }

  // ---- Treble rolloff: cosine taper ----
  function _trebleRolloff(freqs, r, fTreble) {
    const K = freqs.length;
    const startIdx = _search(freqs, fTreble);
    const nPoints = K - startIdx;
    if (nPoints <= 1) return;
    const inv = 1 / (nPoints - 1);
    for (let i = 0; i < nPoints; i++) {
      const t = i * inv;
      r[startIdx + i] *= Math.cos(0.5 * Math.PI * t);
    }
  }

  // ---- Preprocess: build residual from target - source ----
  function _preprocess(freqs, dst, src, residual, smooth, demean) {
    const K = freqs.length;
    for (let k = 0; k < K; k++) residual[k] = dst[k] - src[k];
    if (smooth) {
      _adaptiveSmooth(freqs, residual,
        smooth.smoothF0, smooth.smoothF1, smooth.smoothLo, smooth.smoothHi,
        smooth.biasF0, smooth.biasF1, smooth.biasF2, smooth.biasF3,
        smooth.biasLo, smooth.biasMd, smooth.biasHi, smooth.clipF);
    }
    let mean = 0;
    if (demean) {
      const sum = residual.reduce((a, b) => a + b, 0);
      mean = sum / K;
      for (let k = 0; k < K; k++) residual[k] -= mean;
    }
    _trebleRolloff(freqs, residual, smooth ? 16000 : 18500);
    return mean;
  }

  // ---- AdaBelief optimizer ----
  class _AdaBelief {
    constructor(N) {
      this.W = 3 * N + 1;
      this.b1 = 0.9; this.b2 = 0.99;
      this.b1t = 0.9; this.b2t = 0.99;
      this.eps = 1e-12;
      this.epsRoot = 1e-12;
      this.lr = 3e-2;
      this.m = new Float64Array(this.W);
      this.s = new Float64Array(this.W);
    }
    step(x, g) {
      for (let w = 0; w < this.W; w++) {
        this.m[w] = this.b1 * this.m[w] + (1 - this.b1) * g[w];
        this.s[w] = this.b2 * this.s[w] + (1 - this.b2) * _sq(g[w] - this.m[w]);
        const mHat = this.m[w] / (1 - this.b1t);
        const sHat = this.s[w] / (1 - this.b2t);
        const den = Math.sqrt(sHat + this.epsRoot) + this.eps;
        x[w] -= this.lr * mHat / den;
      }
      this.b1t *= this.b1;
      this.b2t *= this.b2;
    }
  }

  // ---- Gradient computation ----
  function _grad(types, phi, r, fs, N, optAmp, x, g, w) {
    const K = r.length;
    const rK = 1 / K;
    const perFilterDydw0 = [];
    const perFilterDydGain = [];
    const perFilterDydBw = [];
    const w0vals = [];

    const predInit = optAmp ? _exp10(x[3*N] / 10) : 1;
    const pred = new Float64Array(K);
    pred.fill(predInit);

    for (let n = 0; n < N; n++) {
      const lnF0 = x[n];
      const gainVal = x[N + n];
      const bw = x[2*N + n];
      const f0 = Math.exp(lnF0);
      const A = _exp10(gainVal / 40);
      const w0 = 2 * Math.PI / fs * f0;
      const cos_w = Math.cos(w0), sin_w = Math.sin(w0);
      const kQ = Math.sinh(0.5 * Math.LN2 * bw);
      const alpha = sin_w * kQ;
      w0vals[n] = w0;
      const s = _BIQUAD_FNS[types[n]](A, cos_w, alpha);

      const dA_dGain = A * Math.LN10 / 40;
      const dAlpha_dW0 = cos_w * kQ;
      const dAlpha_dBw = sin_w * Math.cosh(0.5 * Math.LN2 * bw) * 0.5 * Math.LN2;
      const dCos_dW0 = -sin_w;

      const sumB = s.b0 + s.b1 + s.b2;
      const sumA = s.a0 + s.a1 + s.a2;
      const b_x0 = _sq(sumB);
      const b_x1 = -4 * (s.b0*s.b1 + 4*s.b0*s.b2 + s.b1*s.b2);
      const b_x2 = 16 * s.b0 * s.b2;
      const a_x0 = _sq(sumA);
      const a_x1 = -4 * (s.a0*s.a1 + 4*s.a0*s.a2 + s.a1*s.a2);
      const a_x2 = 16 * s.a0 * s.a2;

      const dydw0_k = new Float64Array(K);
      const dydGain_k = new Float64Array(K);
      const dydBw_k = new Float64Array(K);

      for (let k = 0; k < K; k++) {
        const phiK = phi[k];
        const bPoly = b_x0 + phiK * (b_x1 + phiK * b_x2);
        const aPoly = a_x0 + phiK * (a_x1 + phiK * a_x2);
        pred[k] *= bPoly / aPoly;

        const phiSq8 = 8 * _sq(phiK);
        const phi2 = 2 * phiK;
        const bMul = 20 / Math.LN10 / bPoly;
        const aMul = -20 / Math.LN10 / aPoly;

        const dy_db0 = bMul * (sumB - phi2 * (s.b1 + 4*s.b2) + phiSq8 * s.b2);
        const dy_db1 = bMul * (sumB - phi2 * (s.b0 + s.b2));
        const dy_db2 = bMul * (sumB - phi2 * (4*s.b0 + s.b1) + phiSq8 * s.b0);
        const dy_da0 = aMul * (sumA - phi2 * (s.a1 + 4*s.a2) + phiSq8 * s.a2);
        const dy_da1 = aMul * (sumA - phi2 * (s.a0 + s.a2));
        const dy_da2 = aMul * (sumA - phi2 * (4*s.a0 + s.a1) + phiSq8 * s.a0);

        const dy_dA = dy_db0*s.db0_dA + dy_db1*s.db1_dA + dy_db2*s.db2_dA
                    + dy_da0*s.da0_dA + dy_da1*s.da1_dA + dy_da2*s.da2_dA;
        const dy_dAlpha = dy_db0*s.db0_dalpha + dy_db2*s.db2_dalpha
                        + dy_da0*s.da0_dalpha + dy_da2*s.da2_dalpha;
        const dy_dCos = dy_db0*s.db0_dcos + dy_db1*s.db1_dcos + dy_db2*s.db2_dcos
                       + dy_da0*s.da0_dcos + dy_da1*s.da1_dcos + dy_da2*s.da2_dcos;

        dydw0_k[k] = dy_dAlpha * dAlpha_dW0 + dy_dCos * dCos_dW0;
        dydGain_k[k] = dy_dA * dA_dGain;
        dydBw_k[k] = dy_dAlpha * dAlpha_dBw;
      }

      perFilterDydw0[n] = dydw0_k;
      perFilterDydGain[n] = dydGain_k;
      perFilterDydBw[n] = dydBw_k;
    }

    // Loss and gradient aggregation (frequency-weighted MSE)
    let loss = 0;
    const dL_dy = new Float64Array(K);
    let dLSum = 0;
    let wSum = 0;
    for (let k = 0; k < K; k++) {
      const wk = w ? w[k] : 1;
      const diff = 10 * Math.log10(pred[k]) - r[k];
      loss += wk * _sq(diff);
      dLSum += dL_dy[k] = 2 * wk * diff;
      wSum += wk;
    }
    loss /= wSum || K;

    // Amplitude gradient
    g[3*N] = optAmp ? dLSum * rK : 0;

    for (let n = 0; n < N; n++) {
      let glf = 0, ggain = 0, gbw = 0;
      for (let k = 0; k < K; k++) {
        glf += dL_dy[k] * perFilterDydw0[n][k];
        ggain += dL_dy[k] * perFilterDydGain[n][k];
        gbw += dL_dy[k] * perFilterDydBw[n][k];
      }
      g[n] = glf * rK * w0vals[n];
      g[N + n] = ggain * rK;
      g[2*N + n] = gbw * rK;
    }

    return loss;
  }

  // ---- Main fitting loop ----
  function _fit(steps, types, f0, gain, Q, amp, f0Lim, gainLim, QLim, N, freqs, r, fs) {
    const K = freqs.length;
    const lnF0Lim = [];
    const bwLim = [];
    for (let n = 0; n < N; n++) {
      lnF0Lim[n] = { lo: Math.log(f0Lim[n].lo), hi: Math.log(f0Lim[n].hi) };
      bwLim[n] = { lo: _q2bw(QLim[n].hi), hi: _q2bw(QLim[n].lo) };
    }

    // Precompute phi for all frequency points
    const phi = new Float64Array(K);
    for (let k = 0; k < K; k++) {
      phi[k] = _sq(Math.sin(Math.PI / fs * freqs[k]));
    }
    // Frequency weights: de-emphasize high frequencies where comb-filter artifacts dominate
    const freqWeight = new Float64Array(K);
    for (let k = 0; k < K; k++) {
      const f = freqs[k];
      if (f <= 5000) freqWeight[k] = 1.0;
      else if (f >= 12000) freqWeight[k] = 0.01;
      else freqWeight[k] = 1.0 - (f - 5000) / 7000 * 0.99;
    }

    // State vector: [ln(f0)_0..N-1, gain_0..N-1, bw_0..N-1, amp]
    const nState = 3 * N + 1;
    const x = new Float64Array(nState);
    for (let n = 0; n < N; n++) {
      x[n] = Math.log(f0[n]);
      x[N + n] = gain[n];
      x[2*N + n] = _q2bw(Q[n]);
    }
    if (amp != null) x[3*N] = amp;
    const hasAmp = amp != null;

    const g = new Float64Array(nState);
    let bestLoss = 1e9;
    const bestX = new Float64Array(nState);
    const opt = new _AdaBelief(N);

    for (let step = 0; step < steps; step++) {
      const L = _grad(types, phi, r, fs, N, hasAmp, x, g, freqWeight);
      opt.step(x, g);

      // Box constraints with moment reset
      for (let n = 0; n < N; n++) {
        const clippedLf = _clip(x[n], lnF0Lim[n].lo, lnF0Lim[n].hi);
        if (x[n] !== clippedLf) { x[n] = clippedLf; opt.m[n] = 0; }
        const clippedGain = _clip(x[N + n], gainLim[n].lo, gainLim[n].hi);
        if (x[N + n] !== clippedGain) { x[N + n] = clippedGain; opt.m[N + n] = 0; }
        const clippedBw = _clip(x[2*N + n], bwLim[n].lo, bwLim[n].hi);
        if (x[2*N + n] !== clippedBw) { x[2*N + n] = clippedBw; opt.m[2*N + n] = 0; }
      }

      if (L < bestLoss) {
        bestLoss = L;
        for (let w = 0; w < nState; w++) bestX[w] = x[w];
      }
    }

    for (let n = 0; n < N; n++) {
      f0[n] = Math.exp(bestX[n]);
      gain[n] = bestX[N + n];
      Q[n] = _bw2q(bestX[2*N + n]);
    }
    if (amp != null) amp = bestX[3*N];
    return { amp, loss: bestLoss };
  }

  // ---- Top-level autoeq entry ----
  function _autoeq(steps, types, f0, gain, Q, amp, f0Lim, gainLim, QLim, N, freqs, r, fs) {
    const rInit = r.slice();
    // Sequential initialization
    for (let n = 0; n < N; n++) {
      const init = _INIT_FNS[types[n]](rInit, freqs, fs, f0Lim[n], gainLim[n], QLim[n]);
      _spectrum(types[n], init.f0, -init.gain, init.Q, fs, freqs, rInit);
      f0[n] = init.f0;
      gain[n] = init.gain;
      Q[n] = init.Q;
    }
    if (amp != null) amp = 0;
    return _fit(steps, types, f0, gain, Q, amp, f0Lim, gainLim, QLim, N, freqs, r, fs);
  }

  // ---- Public API ----
  function generateAutoPEQ(freqData, count, freqLow, freqHigh, maxGain, tiltDB, useShelving) {
    if (!freqData || freqData.length < 5) return [];

    const K = freqData.length;
    const freqs = freqData.map(d => d.freq);
    const rawDB = freqData.map(d => d.dB);
    const maxDB = Math.max(...rawDB);
    const dbNorm = rawDB.map(v => v - maxDB);

    // 3-point mild smoothing
    const smoothed = dbNorm.slice();
    for (let i = 1; i < K - 1; i++) {
      const diff = Math.abs(2 * dbNorm[i] - dbNorm[i - 1] - dbNorm[i + 1]);
      if (diff > 5) {
        smoothed[i] = dbNorm[i - 1] * 0.25 + dbNorm[i] * 0.5 + dbNorm[i + 1] * 0.25;
      }
    }
    // Exponential smoothing above 10kHz: wide window, weights decay with distance.
    // Applied unconditionally to already-3-point-smoothed data to suppress comb-filter artifacts.
    const expHalfWidth = 12;
    const expSigma = 5;
    for (let i = 0; i < K; i++) {
      if (freqs[i] <= 10000) continue;
      let sum = 0, wSum = 0;
      for (let j = -expHalfWidth; j <= expHalfWidth; j++) {
        const idx = Math.max(0, Math.min(K - 1, i + j));
        const w = Math.exp(-Math.abs(j) / expSigma);
        sum += w * smoothed[idx];
        wSum += w;
      }
      smoothed[i] = sum / wSum;
    }

    // Tilt curve
    const log20 = Math.log(20);
    const log20k = Math.log(20000);
    const tiltOffsets = (tiltDB != null && tiltDB !== 0)
      ? freqs.map(f => {
          const fl = Math.max(f, 20);
          const ratio = (Math.log(fl) - log20) / (log20k - log20);
          return tiltDB * (0.5 - Math.min(1, Math.max(0, ratio)));
        })
      : null;

    const src = smoothed;
    const dst = new Float64Array(K); // target = 0dB

    // Configure filters
    const N = Math.min(count, 32);
    const types = [];
    const f0Lim = [], gainLim = [], QLim = [];
    const f0 = new Float64Array(N);
    const gain = new Float64Array(N);
    const Q = new Float64Array(N);

    const fl = Math.max(freqLow || 20, 20) * 1.02;
    const fh = Math.min(freqHigh || 20000, 20000) * 0.98;
    const pkFreqLim = { lo: fl, hi: fh };
    const pkGainLim = { lo: -maxGain, hi: maxGain };
    const pkQLim = { lo: 0.4, hi: 4 };
    // Shelving filters: limited frequency range and tighter gain (broadband impact)
    const lscFreqLim = { lo: Math.max(fl, 20), hi: Math.min(fh, 500) };
    const hscFreqLim = { lo: Math.max(fl, 1500), hi: Math.min(fh, 2500) };
    const shelfQLim = { lo: 0.4, hi: 3 };
    const shelfGainCap = Math.min(maxGain, 6);
    const shelfGainLim = { lo: -shelfGainCap, hi: shelfGainCap };

    for (let n = 0; n < N; n++) {
      if (n === 0 && useShelving) {
        types[n] = AE.LSC;
        f0Lim[n] = lscFreqLim;
        gainLim[n] = shelfGainLim;
        QLim[n] = shelfQLim;
      } else if (n === 1 && useShelving) {
        types[n] = AE.HSC;
        f0Lim[n] = hscFreqLim;
        gainLim[n] = shelfGainLim;
        QLim[n] = shelfQLim;
      } else {
        types[n] = AE.PK;
        f0Lim[n] = pkFreqLim;
        gainLim[n] = pkGainLim;
        QLim[n] = pkQLim;
      }
    }

    const FS = 48000;

    // Adaptive smoothing config
    const smoothCfg = {
      smoothLo: 0.3, smoothHi: 0.03,
      smoothF0: 3000, smoothF1: 12000,
      biasLo: 0, biasMd: 0.15, biasHi: 0.03,
      biasF0: 10000, biasF1: 13000,
      biasF2: 14000, biasF3: 20000,
      clipF: 18500,
    };

    // Preprocess: residual = target - source
    const residual = new Float64Array(K);
    _preprocess(freqs, dst, src, residual, smoothCfg, true);

    // Apply tilt
    if (tiltOffsets) {
      for (let k = 0; k < K; k++) residual[k] += tiltOffsets[k];
    }

    // Frequency range masking
    if (freqLow && freqHigh) {
      for (let i = 0; i < K; i++) {
        if (freqs[i] <= freqLow || freqs[i] >= freqHigh) residual[i] = 0;
      }
    }

    // Optimize
    _autoeq(1200, types, f0, gain, Q, 0, f0Lim, gainLim, QLim, N, freqs, residual, FS);

    // Build output
    const bands = [];
    for (let n = 0; n < N; n++) {
      if (Math.abs(gain[n]) < 0.3) continue;
      bands.push({
        freq: f0[n],
        gain: gain[n],
        Q: Q[n],
        type: types[n] === AE.LSC ? 'LSC' : (types[n] === AE.HSC ? 'HSC' : 'PK'),
      });
    }
    bands.sort((a, b) => a.freq - b.freq);

    // Merge near-duplicate PK filters: if two PKs converge to ~same freq,
    // keep only the dominant one (larger |gain|). No gain summing.
    for (let i = bands.length - 1; i >= 1; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (bands[i].type !== 'PK' || bands[j].type !== 'PK') continue;
        if (bands[i].freq / bands[j].freq > 1.05) break; // sorted, further j are even smaller
        // Same sign → keep dominant, remove weaker
        if (bands[i].gain * bands[j].gain >= 0) {
          if (Math.abs(bands[i].gain) >= Math.abs(bands[j].gain)) {
            bands.splice(j, 1); i--;
          } else {
            bands.splice(i, 1);
          }
          break;
        }
      }
    }

    // Round and filter
    const result = bands
      .filter(b => Math.abs(b.gain) >= 0.5)
      .map(b => ({
        freq: Math.round(b.freq),
        gain: Math.round(b.gain * 10) / 10,
        Q: Math.round(b.Q * 100) / 100,
        type: b.type,
      }));
    result.sort((a, b) => a.freq - b.freq);

    // Remove exact duplicates (same freq, type, and approximate gain/Q after rounding)
    for (let i = result.length - 1; i >= 1; i--) {
      if (result[i].freq === result[i-1].freq &&
          result[i].type === result[i-1].type &&
          result[i].gain === result[i-1].gain &&
          result[i].Q === result[i-1].Q) {
        result.splice(i, 1);
      }
    }

    // Boundary Q reduction for high-gain filters
    for (const b of result) {
      const nearLo = freqLow && b.freq <= freqLow * 1.1;
      const nearHi = freqHigh && b.freq >= freqHigh * 0.9;
      if ((nearLo || nearHi) && Math.abs(b.gain) >= maxGain * 0.9) {
        b.Q = Math.max(0.4, b.Q * 0.7);
      }
    }

    return result;
  }

  // Export for use by app.js
  window.AE = AE;
  window._filterGainAt = _filterGainAt;
  window.generateAutoPEQ = generateAutoPEQ;

})();
