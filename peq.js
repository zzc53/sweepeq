/*
 * Copyright (C) 2026 PEQdB Inc.
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * This file is part of SweepEQ.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * ---
 *
 * Ported from https://github.com/peqdb/autoeq-c
 * Original C implementation by PEQdB Inc., licensed under LGPL-3.0-or-later.
 *
 * Changes from original: adapted to variable grid size (matching measurement
 * data points instead of fixed 384-point grid); ported to JavaScript.
 */
const AE = { PK: 0, LSC: 1, HSC: 2 };

function _clip(x, lo, hi) { return Math.min(Math.max(x, lo), hi); }
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
function _bqPK(A, cos_w, alpha) {
  const rA = 1 / A;
  return {
    b0: A*alpha + 1,       db0_dA: alpha,      db0_dalpha: A,      db0_dcos: 0,
    b1: -2*cos_w,           db1_dA: 0,                            db1_dcos: -2,
    b2: -A*alpha + 1,       db2_dA: -alpha,     db2_dalpha: -A,    db2_dcos: 0,
    a0: (A + alpha)*rA,     da0_dA: -alpha*_sq(rA), da0_dalpha: rA, da0_dcos: 0,
    a1: -2*cos_w,           da1_dA: 0,                            da1_dcos: -2,
    a2: (A - alpha)*rA,     da2_dA: alpha*_sq(rA),  da2_dalpha: -rA, da2_dcos: 0,
  };
}
function _bqLSC(A, cos_w, alpha) {
  const p1 = A + 1, m1 = A - 1, sqrtA = Math.sqrt(A), k = 2*sqrtA*alpha;
  const dk_dA = alpha / sqrtA, dk_dalpha = 2*sqrtA;
  return {
    b0: A*(-cos_w*m1 + k + p1),        db0_dA: A*dk_dA - A*cos_w + A - cos_w*m1 + k + p1,  db0_dalpha: A*dk_dalpha,  db0_dcos: -A*m1,
    b1: 2*A*(-cos_w*p1 + m1),          db1_dA: -2*A*cos_w + 2*A - 2*cos_w*p1 + 2*m1,                                      db1_dcos: -2*A*p1,
    b2: A*(-cos_w*m1 - k + p1),        db2_dA: -A*dk_dA - A*cos_w + A - cos_w*m1 - k + p1,  db2_dalpha: -A*dk_dalpha, db2_dcos: -A*m1,
    a0: cos_w*m1 + k + p1,             da0_dA: dk_dA + cos_w + 1,                            da0_dalpha: dk_dalpha,    da0_dcos: m1,
    a1: -2*cos_w*p1 - 2*m1,            da1_dA: -2*cos_w - 2,                                                                 da1_dcos: -2*p1,
    a2: cos_w*m1 - k + p1,             da2_dA: -dk_dA + cos_w + 1,                           da2_dalpha: -dk_dalpha,   da2_dcos: m1,
  };
}
function _bqHSC(A, cos_w, alpha) {
  const p1 = A + 1, m1 = A - 1, sqrtA = Math.sqrt(A), k = 2*sqrtA*alpha;
  const dk_dA = alpha / sqrtA, dk_dalpha = 2*sqrtA;
  return {
    b0: A*(cos_w*m1 + k + p1),         db0_dA: A*dk_dA + A*cos_w + A + cos_w*m1 + k + p1,  db0_dalpha: A*dk_dalpha,  db0_dcos: A*m1,
    b1: -2*A*(cos_w*p1 + m1),          db1_dA: -2*A*cos_w - 2*A - 2*cos_w*p1 - 2*m1,                                       db1_dcos: -2*A*p1,
    b2: A*(cos_w*m1 - k + p1),         db2_dA: -A*dk_dA + A*cos_w + A + cos_w*m1 - k + p1,  db2_dalpha: -A*dk_dalpha, db2_dcos: A*m1,
    a0: -cos_w*m1 + k + p1,            da0_dA: dk_dA - cos_w + 1,                           da0_dalpha: dk_dalpha,    da0_dcos: -m1,
    a1: -2*cos_w*p1 + 2*m1,            da1_dA: 2 - 2*cos_w,                                                                  da1_dcos: -2*p1,
    a2: -cos_w*m1 - k + p1,            da2_dA: -dk_dA - cos_w + 1,                          da2_dalpha: -dk_dalpha,   da2_dcos: -m1,
  };
}
const _BIQUAD_FNS = [_bqPK, _bqLSC, _bqHSC];

// ---- spectrum: compute filter frequency response and accumulate into y ----
function _spectrum(type, f0, gain, Q, fs, freqs, y) {
  const A = _exp10(gain / 40);
  const w0 = 2 * Math.PI / fs * f0;
  const cos_w = Math.cos(w0), sin_w = Math.sin(w0);
  const alpha = sin_w * 0.5 / Q;
  const s = _BIQUAD_FNS[type](A, cos_w, alpha);
  const b_x0 = _sq(s.b0 + s.b1 + s.b2);
  const b_x1 = -4*(s.b0*s.b1 + 4*s.b0*s.b2 + s.b1*s.b2);
  const b_x2 = 16*s.b0*s.b2;
  const a_x0 = _sq(s.a0 + s.a1 + s.a2);
  const a_x1 = -4*(s.a0*s.a1 + 4*s.a0*s.a2 + s.a1*s.a2);
  const a_x2 = 16*s.a0*s.a2;
  for (let k = 0; k < freqs.length; k++) {
    const phi = _sq(Math.sin(Math.PI / fs * freqs[k]));
    const b_poly = b_x0 + phi*(b_x1 + phi*b_x2);
    const a_poly = a_x0 + phi*(a_x1 + phi*a_x2);
    y[k] += 10 * Math.log10(Math.max(b_poly / a_poly, 1e-12));
  }
}

// ---- Peak detection (scipy-compatible: find_peaks + prominence + width) ----
function _largestPeak(x, freqs, lim) {
  const K = freqs.length;
  const H = Math.floor(K / 2);
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

  const prominences = []; const leftBases = []; const rightBases = [];
  for (let p = 0; p < peaks.length; p++) {
    const peak = peaks[p], xPeak = x[peak];
    leftBases[p] = peak; let leftMin = xPeak;
    for (let i = peak; i >= 0 && x[i] <= xPeak; i--) {
      if (x[i] < leftMin) { leftMin = x[i]; leftBases[p] = i; }
    }
    rightBases[p] = peak; let rightMin = xPeak;
    for (let i = peak; i < K && x[i] <= xPeak; i++) {
      if (x[i] < rightMin) { rightMin = x[i]; rightBases[p] = i; }
    }
    prominences[p] = xPeak - Math.max(leftMin, rightMin);
  }

  let bestSize = 0, best = { idx: -1, width: 0, height: 0 };
  for (let p = 0; p < peaks.length; p++) {
    const peak = peaks[p], xPeak = x[peak];
    const height = xPeak - 0.5*prominences[p];
    let i = peak; while (leftBases[p] < i && height < x[i]) i--;
    const leftIP = x[i] < height ? i + (height - x[i]) / (x[i+1] - x[i]) : i;
    i = peak; while (i < rightBases[p] && height < x[i]) i++;
    const rightIP = x[i] < height ? i - (height - x[i]) / (x[i-1] - x[i]) : i;
    const width = rightIP - leftIP, size = width * xPeak;
    if (size > bestSize) { bestSize = size; best = { idx: peak, width, height: xPeak }; }
  }
  return best;
}

// ---- Initialization functions ----
function _initPK(y, freqs, fs, limF0, limGain, limQ) {
  const K = freqs.length;
  let rect = y.map(v => Math.max(v, 0));
  const peak = _largestPeak(rect, freqs, limF0);
  rect = y.map(v => Math.max(-v, 0));
  const dip = _largestPeak(rect, freqs, limF0);
  const p = peak.width*peak.height > dip.width*dip.height ? peak : dip;
  if (p.idx < 0) return { f0: 1000, gain: 0, Q: 1 };
  let f0 = freqs[p.idx], gain = p.idx === peak.idx ? peak.height : -dip.height;
  const bw = p.width * Math.log2(freqs[1] / freqs[0]);
  const bwExp2 = Math.pow(2, bw);
  let Q = Math.sqrt(bwExp2) / (bwExp2 - 1);
  gain = _clip(gain, limGain.lo, limGain.hi);
  Q = _clip(Q, limQ.lo, limQ.hi);
  return { f0, gain, Q };
}
function _initLSC(y, freqs, fs, limF0, limGain, limQ) {
  const K = freqs.length;
  const fl = { lo: Math.max(limF0.lo, 40), hi: Math.min(limF0.hi, 10000) };
  let best = 0, bestIdx = -1, a = 0;
  for (let k = 0; k < K; k++) { a += y[k]; const avg = Math.abs(a / (k + 1)); if (avg > best) { best = avg; bestIdx = k; } }
  if (bestIdx < 0) return { f0: 100, gain: 0, Q: 0.707 };
  let f0 = freqs[bestIdx], Q = 0.70710678;
  f0 = _clip(f0, fl.lo, fl.hi); Q = _clip(Q, limQ.lo, limQ.hi);
  const w = new Float64Array(K).fill(0);
  _spectrum(AE.LSC, f0, 1, Q, fs, freqs, w);
  let p = 0, c = 0;
  for (let k = 0; k < K; k++) { p += w[k]*y[k]; c += Math.abs(w[k]); }
  let gain = c > 0 ? p / c : 0;
  gain = _clip(gain, limGain.lo, limGain.hi);
  return { f0, gain, Q };
}
function _initHSC(y, freqs, fs, limF0, limGain, limQ) {
  const K = freqs.length;
  const fl = { lo: Math.max(limF0.lo, 40), hi: Math.min(limF0.hi, 10000) };
  let best = 0, bestIdx = -1, a = 0;
  for (let k = 0; k < K; k++) { a += y[K-1-k]; const avg = Math.abs(a / (k + 1)); if (avg > best) { best = avg; bestIdx = K-1-k; } }
  if (bestIdx < 0) return { f0: 10000, gain: 0, Q: 0.707 };
  let f0 = freqs[bestIdx], Q = 0.70710678;
  f0 = _clip(f0, fl.lo, fl.hi); Q = _clip(Q, limQ.lo, limQ.hi);
  const w = new Float64Array(K).fill(0);
  _spectrum(AE.HSC, f0, 1, Q, fs, freqs, w);
  let p = 0, c = 0;
  for (let k = 0; k < K; k++) { p += w[k]*y[k]; c += Math.abs(w[k]); }
  let gain = c > 0 ? p / c : 0;
  gain = _clip(gain, limGain.lo, limGain.hi);
  return { f0, gain, Q };
}
const _INIT_FNS = [_initPK, _initLSC, _initHSC];

/** Compute dB gain of a single filter at a given frequency (PK/LSC/HSC) */
function _filterGainAt(type, f0, gainDB, Q, freq, fs) {
  const A = _exp10(gainDB / 40);
  const w0 = 2 * Math.PI * f0 / fs;
  const cos_w = Math.cos(w0), sin_w = Math.sin(w0);
  const alpha = sin_w * 0.5 / Q;
  const s = _BIQUAD_FNS[type](A, cos_w, alpha);
  const phi = _sq(Math.sin(Math.PI / fs * freq));
  const ba = s.b0 + s.b1 + s.b2;
  const aa = s.a0 + s.a1 + s.a2;
  const b_x0 = _sq(ba);
  const b_x1 = -4*(s.b0*s.b1 + 4*s.b0*s.b2 + s.b1*s.b2);
  const b_x2 = 16*s.b0*s.b2;
  const a_x0 = _sq(aa);
  const a_x1 = -4*(s.a0*s.a1 + 4*s.a0*s.a2 + s.a1*s.a2);
  const a_x2 = 16*s.a0*s.a2;
  const b_poly = b_x0 + phi*(b_x1 + phi*b_x2);
  const a_poly = a_x0 + phi*(a_x1 + phi*a_x2);
  return 10 * Math.log10(Math.max(b_poly / a_poly, 1e-12));
}

// ---- Adaptive smoothing (bilateral-ish filtering) ----
function _adaptiveSmooth(freqs, r, smoothF0, smoothF1, smoothLo, smoothHi,
    biasF0, biasF1, biasF2, biasF3, biasLo, biasMd, biasHi, clipF) {
  const K = freqs.length;
  const H = Math.max(1, Math.round(K / 8));
  const smoothL0 = Math.log(smoothF0), smoothL1 = Math.log(smoothF1);
  const biasL0 = Math.log(biasF0), biasL1 = Math.log(biasF1);
  const biasL2 = Math.log(biasF2), biasL3 = Math.log(biasF3);
  const x = r.slice();
  const clipIdx = _search(freqs, clipF);
  function _sgm(xx, x0, x1) {
    const SMOOTH = 4;
    const k = SMOOTH / (x1 - x0), m = 0.5*(x0 + x1);
    return 0.5*Math.tanh(0.5*k*(xx - m)) + 0.5;
  }
  for (let k = 0; k < K; k++) {
    const fk = freqs[k], l = Math.log(fk), xk = x[k];
    const sigma = smoothLo + (smoothHi - smoothLo)*_sgm(l, smoothL0, smoothL1);
    const bias = biasLo + (biasMd - biasLo)*_sgm(l, biasL0, biasL1) + (biasHi - biasMd)*_sgm(l, biasL2, biasL3);
    let a = 0, c = 0;
    for (let j = -H; j <= H; j++) {
      let s = k + j;
      s = s < 0 ? 0 : s > clipIdx ? clipIdx : s;
      const xs = x[s], dSpatial = _sq(j * sigma), dRange = bias * (xs - xk);
      const w = Math.exp(-0.5*dSpatial + dRange);
      a += w * x[s]; c += w;
    }
    r[k] = a / c;
  }
}

// ---- Treble rolloff ----
function _trebleRolloff(freqs, r, fTreble) {
  const K = freqs.length;
  const trebleIdx = _search(freqs, fTreble);
  const nTreble = K - trebleIdx;
  if (nTreble <= 1) return;
  const inv = 1 / (nTreble - 1);
  for (let i = 0; i < nTreble; i++) {
    const t = i * inv;
    r[trebleIdx + i] *= Math.cos(0.5 * Math.PI * t);
  }
}

// ---- AdaBelief optimizer ----
class _AdaBelief {
  constructor(N) {
    this.N = N;
    this.W = 3*N + 1;
    this.b1 = 0.9; this.b2 = 0.99;
    this.b1t = 0.9; this.b2t = 0.99;
    this.eps = 1e-12; this.eps_root = 1e-12;
    this.lr = 3e-2;
    this.step = 0;
    this.m = new Float64Array(this.W);
    this.s = new Float64Array(this.W);
  }
  stepOpt(x, g) {
    for (let w = 0; w < this.W; w++) {
      this.m[w] = this.b1*this.m[w] + (1-this.b1)*g[w];
      this.s[w] = this.b2*this.s[w] + (1-this.b2)*_sq(g[w] - this.m[w]);
      const mHat = this.m[w] / (1 - this.b1t);
      const sHat = this.s[w] / (1 - this.b2t);
      const den = Math.sqrt(sHat + this.eps_root) + this.eps;
      x[w] -= this.lr * mHat / den;
    }
    this.b1t *= this.b1; this.b2t *= this.b2;
    this.step++;
  }
}

// ---- Analytic gradient computation ----
function _grad(types, phi, r, fs, N, optAmp, x, g) {
  const K = r.length;
  const rK = 1 / K;
  const dy_dw0 = []; const dy_dgain = []; const dy_dbw = [];
  const w0_v = [];
  let predInit = optAmp ? _exp10(x[3*N] / 10) : 1;
  const pred = new Float64Array(K).fill(predInit);

  for (let n = 0; n < N; n++) {
    const lf = x[0*N + n], gainVal = x[1*N + n], bw = x[2*N + n];
    const f0 = Math.exp(lf);
    const A = _exp10(gainVal / 40);
    const w0 = 2*Math.PI/fs * f0;
    const cos_w = Math.cos(w0), sin_w = Math.sin(w0);
    const kQ = Math.sinh(0.5*Math.LN2 * bw);
    const alpha = sin_w * kQ;
    w0_v[n] = w0;
    const s = _BIQUAD_FNS[types[n]](A, cos_w, alpha);
    const dA_dgain = A * Math.LN10/40;
    const dalpha_dw0 = cos_w * kQ;
    const dalpha_dbw = sin_w * Math.cosh(0.5*Math.LN2 * bw) * 0.5*Math.LN2;
    const dcos_dw0 = -sin_w;
    const b_x0 = _sq(s.b0 + s.b1 + s.b2);
    const b_x1 = -4*(s.b0*s.b1 + 4*s.b0*s.b2 + s.b1*s.b2);
    const b_x2 = 16*s.b0*s.b2;
    const a_x0 = _sq(s.a0 + s.a1 + s.a2);
    const a_x1 = -4*(s.a0*s.a1 + 4*s.a0*s.a2 + s.a1*s.a2);
    const a_x2 = 16*s.a0*s.a2;
    const ba = s.b0 + s.b1 + s.b2;
    const aa = s.a0 + s.a1 + s.a2;
    const dy0 = []; const dy1 = []; const dy2 = [];
    for (let k = 0; k < K; k++) {
      const phiK = phi[k];
      const bPoly = b_x0 + phiK*(b_x1 + phiK*b_x2);
      const aPoly = a_x0 + phiK*(a_x1 + phiK*a_x2);
      pred[k] *= bPoly / aPoly;
      const _8phi2 = 8*_sq(phiK), _2phi = 2*phiK;
      const bm = 20/Math.LN10 / bPoly, am = -20/Math.LN10 / aPoly;
      const dy_db0 = bm * (ba - _2phi*(s.b1 + 4*s.b2) + _8phi2*s.b2);
      const dy_db1 = bm * (ba - _2phi*(s.b0 + s.b2));
      const dy_db2 = bm * (ba - _2phi*(4*s.b0 + s.b1) + _8phi2*s.b0);
      const dy_da0 = am * (aa - _2phi*(s.a1 + 4*s.a2) + _8phi2*s.a2);
      const dy_da1 = am * (aa - _2phi*(s.a0 + s.a2));
      const dy_da2 = am * (aa - _2phi*(4*s.a0 + s.a1) + _8phi2*s.a0);
      const dy_dA = dy_db0*s.db0_dA + dy_db1*s.db1_dA + dy_db2*s.db2_dA
                  + dy_da0*s.da0_dA + dy_da1*s.da1_dA + dy_da2*s.da2_dA;
      const dy_dalpha = dy_db0*s.db0_dalpha + dy_db2*s.db2_dalpha
                      + dy_da0*s.da0_dalpha + dy_da2*s.da2_dalpha;
      const dy_dcos = dy_db0*s.db0_dcos + dy_db1*s.db1_dcos + dy_db2*s.db2_dcos
                    + dy_da0*s.da0_dcos + dy_da1*s.da1_dcos + dy_da2*s.da2_dcos;
      dy0[k] = dy_dalpha*dalpha_dw0 + dy_dcos*dcos_dw0;
      dy1[k] = dy_dA*dA_dgain;
      dy2[k] = dy_dalpha*dalpha_dbw;
    }
    dy_dw0[n] = dy0; dy_dgain[n] = dy1; dy_dbw[n] = dy2;
  }

  let L = 0; const dL_dy = new Float64Array(K); let dL_dySum = 0;
  for (let k = 0; k < K; k++) {
    const d = 10*Math.log10(pred[k]) - r[k];
    L += _sq(d);
    dL_dySum += dL_dy[k] = 2*d;
  }
  L *= rK;
  // amp gradient
  g[3*N] = optAmp ? dL_dySum * rK : 0;
  for (let n = 0; n < N; n++) {
    let glf = 0, ggain = 0, gbw = 0;
    for (let k = 0; k < K; k++) {
      glf += dL_dy[k]*dy_dw0[n][k];
      ggain += dL_dy[k]*dy_dgain[n][k];
      gbw += dL_dy[k]*dy_dbw[n][k];
    }
    g[0*N + n] = glf * rK * w0_v[n];
    g[1*N + n] = ggain * rK;
    g[2*N + n] = gbw * rK;
  }
  return L;
}

// ---- Main fit loop ----
function _fit(steps, types, f0, gain, Q, amp, f0Lim, gainLim, QLim, N, freqs, r, fs) {
  const K = freqs.length;
  const lfLim = [], bwLim = [];
  for (let n = 0; n < N; n++) {
    lfLim[n] = { lo: Math.log(f0Lim[n].lo), hi: Math.log(f0Lim[n].hi) };
    bwLim[n] = { lo: _q2bw(QLim[n].hi), hi: _q2bw(QLim[n].lo) };
  }
  const phi = new Float64Array(K);
  for (let k = 0; k < K; k++) phi[k] = _sq(Math.sin(Math.PI / fs * freqs[k]));

  const x = new Float64Array(3*N + 1);
  for (let n = 0; n < N; n++) {
    x[0*N + n] = Math.log(f0[n]);
    x[1*N + n] = gain[n];
    x[2*N + n] = _q2bw(Q[n]);
  }
  if (amp != null) x[3*N] = amp;
  const optAmp = amp != null;

  const g = new Float64Array(3*N + 1);
  let bestL = 1e9;
  const bestX = new Float64Array(3*N + 1);
  const opt = new _AdaBelief(N);

  for (let step = 0; step < steps; step++) {
    const L = _grad(types, phi, r, fs, N, optAmp, x, g);
    opt.stepOpt(x, g);
    // box constraints
    for (let n = 0; n < N; n++) {
      if (x[0*N + n] !== _clip(x[0*N + n], lfLim[n].lo, lfLim[n].hi)) { x[0*N + n] = _clip(x[0*N + n], lfLim[n].lo, lfLim[n].hi); opt.m[0*N + n] = 0; }
      if (x[1*N + n] !== _clip(x[1*N + n], gainLim[n].lo, gainLim[n].hi)) { x[1*N + n] = _clip(x[1*N + n], gainLim[n].lo, gainLim[n].hi); opt.m[1*N + n] = 0; }
      if (x[2*N + n] !== _clip(x[2*N + n], bwLim[n].lo, bwLim[n].hi)) { x[2*N + n] = _clip(x[2*N + n], bwLim[n].lo, bwLim[n].hi); opt.m[2*N + n] = 0; }
    }
    if (L < bestL) { bestL = L; for (let w = 0; w < 3*N+1; w++) bestX[w] = x[w]; }
  }
  for (let n = 0; n < N; n++) {
    f0[n] = Math.exp(bestX[0*N + n]);
    gain[n] = bestX[1*N + n];
    Q[n] = _bw2q(bestX[2*N + n]);
  }
  if (amp != null) amp = bestX[3*N];
  return { amp, loss: bestL };
}

// ---- Preprocessing ----
function _preprocess(freqs, dst, src, r, smooth, demean) {
  const K = freqs.length;
  for (let k = 0; k < K; k++) r[k] = dst[k] - src[k];
  if (smooth) {
    _adaptiveSmooth(freqs, r,
      smooth.smoothF0, smooth.smoothF1, smooth.smoothLo, smooth.smoothHi,
      smooth.biasF0, smooth.biasF1, smooth.biasF2, smooth.biasF3,
      smooth.biasLo, smooth.biasMd, smooth.biasHi, smooth.clipF);
  }
  let mean = 0;
  if (demean) {
    const sum = r.reduce((a, b) => a + b, 0);
    mean = sum / K;
    for (let k = 0; k < K; k++) r[k] -= mean;
  }
  _trebleRolloff(freqs, r, smooth ? 16000 : 18500);
  return mean;
}

// ---- Top-level autoeq ----
function _autoeq(steps, types, f0, gain, Q, amp, f0Lim, gainLim, QLim, N, freqs, r, fs) {
  const K = freqs.length;
  const rInit = r.slice();
  // Sequential initialization
  for (let n = 0; n < N; n++) {
    const p = _INIT_FNS[types[n]](rInit, freqs, fs, f0Lim[n], gainLim[n], QLim[n]);
    _spectrum(types[n], p.f0, -p.gain, p.Q, fs, freqs, rInit);
    f0[n] = p.f0; gain[n] = p.gain; Q[n] = p.Q;
  }
  if (amp != null) amp = 0;
  return _fit(steps, types, f0, gain, Q, amp, f0Lim, gainLim, QLim, N, freqs, r, fs);
}

// ---- Public API: generateAutoPEQ, compatible with original caller ----
function generateAutoPEQ(freqData, count, freqLow, freqHigh, maxGain, tiltDB, useShelving) {
  if (!freqData || freqData.length < 5) return [];

  const K = freqData.length;
  const freqs = freqData.map(d => d.freq);
  const rawDB = freqData.map(d => d.dB);
  const maxDB = Math.max(...rawDB);
  const dbNorm = rawDB.map(v => v - maxDB);

  // 轻度平滑原始测量数据，消除单点测量伪影（如驻波相消导致的孤立深谷）
  // 使用 1 遍 3 点加权平均：中间点权重 50%，两侧各 25%
  const smoothed = dbNorm.slice();
  for (let i = 1; i < K - 1; i++) {
    // 仅当当前点与两侧差异显著（> 5dB）时才平滑，避免抹平真实峰谷
    const diff = Math.abs(2 * dbNorm[i] - dbNorm[i - 1] - dbNorm[i + 1]);
    if (diff > 5) {
      smoothed[i] = dbNorm[i - 1] * 0.25 + dbNorm[i] * 0.5 + dbNorm[i + 1] * 0.25;
    }
  }

  // 倾斜曲线：tiltDB 表示 20Hz 比 20000Hz 高出的 dB 数
  const log20 = Math.log(20), log20k = Math.log(20000);
  const tiltOffsets = (tiltDB != null && tiltDB !== 0) ? freqs.map(f => {
    const fl = Math.max(f, 20);
    const ratio = (Math.log(fl) - log20) / (log20k - log20);
    return tiltDB * (0.5 - Math.min(1, Math.max(0, ratio)));
  }) : null;

  // 构建源曲线和目标曲线
  // 目标固定为 0dB（去均值后等效于测量值中位数）
  const src = smoothed;
  const dst = new Float64Array(K); // 全零

  // 残差 = dst - src，由 _preprocess 计算
  // Frequency range masking applied after preprocessing
  const r = [];
  for (let k = 0; k < K; k++) r[k] = 0;

  // 配置滤波器类型 [LSC, HSC, PK, PK, ...]
  const N = Math.min(count, 32);
  const types = [];
  const f0Lim = [], gainLim = [], QLim = [];
  const f0 = new Float64Array(N), gain = new Float64Array(N), Q = new Float64Array(N);

  // 使用用户设定的频响调整范围作为滤波器频率限制
  // 留 2% 边界余量，避免滤波器聚集在范围边缘
  const fl = Math.max(freqLow || 20, 20) * 1.02;
  const fh = Math.min(freqHigh || 20000, 20000) * 0.98;
  const lim = { lo: fl, hi: fh };
  const gLim = { lo: -maxGain, hi: maxGain };
  const qLim = { lo: 0.4, hi: 4 };
  // 搁架滤波器使用更保守的增益上限（宽带影响大，不宜过大）
  const shelfGainCap = Math.min(maxGain, 10);
  const shelfGLim = { lo: -shelfGainCap, hi: shelfGainCap };

  for (let n = 0; n < N; n++) {
    if (n === 0 && useShelving) { types[n] = AE.LSC; f0Lim[n] = { lo: Math.max(fl, 20), hi: Math.min(fh, 500) }; gainLim[n] = shelfGLim; QLim[n] = { lo: 0.4, hi: 3 }; }
    else if (n === 1 && useShelving) { types[n] = AE.HSC; f0Lim[n] = { lo: Math.max(fl, 1000), hi: Math.min(fh, 2000) }; gainLim[n] = shelfGLim; QLim[n] = { lo: 0.4, hi: 3 }; }
    else                    { types[n] = AE.PK;  f0Lim[n] = lim; gainLim[n] = gLim; QLim[n] = qLim; }
  }

  const FS = 48000;

  // 自适应平滑 (通用配置)
  const smooth = {
    smoothLo: 0.3, smoothHi: 0.03,
    smoothF0: 3000, smoothF1: 12000,
    biasLo: 0, biasMd: 0.15, biasHi: 0.03,
    biasF0: 10000, biasF1: 13000,
    biasF2: 14000, biasF3: 20000,
    clipF: 18500,
  };

  // Preprocessing（平滑 + 去均值 + Treble rolloff）
  const residual = new Float64Array(K);
  const meanOffset = _preprocess(freqs, dst, src, residual, smooth, true);

  // 在去均值之后叠加倾斜曲线，避免 center_mean 抵消倾斜
  if (tiltOffsets) {
    for (let k = 0; k < K; k++) residual[k] += tiltOffsets[k];
  }

  // 频率范围屏蔽（含边界），在Preprocessing后执行
  if (freqLow && freqHigh) {
    for (let i = 0; i < K; i++) {
      if (freqs[i] <= freqLow || freqs[i] >= freqHigh) residual[i] = 0;
    }
  }

  // 执行优化 (1200 步迭代)
  const result = _autoeq(
    1200, types, f0, gain, Q, 0,
    f0Lim, gainLim, QLim, N, freqs, residual, FS
  );

  // Build output format (no rounding before post-processing)
  const bands = [];
  for (let n = 0; n < N; n++) {
    const gv = gain[n];
    if (Math.abs(gv) < 0.3) continue;
    bands.push({ freq: f0[n], gain: gv, Q: Q[n], type: types[n] === AE.LSC ? 'LSC' : (types[n] === AE.HSC ? 'HSC' : 'PK') });
  }
  bands.sort((a, b) => a.freq - b.freq);

  // Post-processing: merge nearby duplicate filters
  // bands array shrinks during scan, use while loop
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = bands.length - 1; i >= 1 && !changed; i--) {
      for (let j = i - 1; j >= 0 && !changed; j--) {
        const ratio = bands[i].freq / bands[j].freq;
        if (ratio > 1.05) continue; // Frequency ratio > 5%, skip

        // --- 情况 A：Same sign → merge into one filter ---
        if (bands[i].gain * bands[j].gain >= 0) {
          const abs_i = Math.abs(bands[i].gain);
          const abs_j = Math.abs(bands[j].gain);
          const total = abs_i + abs_j;
          const merged = {
            freq: (bands[i].freq * abs_i + bands[j].freq * abs_j) / total,
            gain: bands[i].gain + bands[j].gain,
            Q: Math.max(bands[i].Q, bands[j].Q),
            type: bands[i].type || bands[j].type || 'PK',
          };
          bands[j] = merged;
          bands.splice(i, 1);
          changed = true;
          break;
        }

        // --- 情况 B：Opposite sign and nearly cancelling → remove both ---
        const net = bands[i].gain + bands[j].gain;
        if (Math.abs(net) < 0.5) {
          bands.splice(j, 1);
          bands.splice(i - 1, 1);
          changed = true;
          break;
        }

        // --- 情况 C：Opposite sign but not cancelling → keep dominant only ---
        // 增益较小的那个移除，因为它被较大的抵消了大部分
        const abs_i = Math.abs(bands[i].gain);
        const abs_j = Math.abs(bands[j].gain);
        if (abs_i > abs_j * 1.5) {
          bands.splice(j, 1);
          changed = true;
          break;
        } else if (abs_j > abs_i * 1.5) {
          bands.splice(i, 1);
          changed = true;
          break;
        }
      }
    }
  }

  // Round and filter insignificant gains
  const finalBands = bands
    .filter(b => Math.abs(b.gain) >= 0.5)
    .map(b => ({
      freq: Math.round(b.freq),
      gain: Math.round(b.gain * 10) / 10,
      Q: Math.round(b.Q * 100) / 100,
      type: b.type || 'PK',
    }));
  finalBands.sort((a, b) => a.freq - b.freq);

  // 后处理：Trim high-gain filters at range boundaries
  // Reduce Q for near-boundary filters with gain near maxGain
  for (const b of finalBands) {
    const nearLo = freqLow && b.freq <= freqLow * 1.1;
    const nearHi = freqHigh && b.freq >= freqHigh * 0.9;
    if ((nearLo || nearHi) && Math.abs(b.gain) >= maxGain * 0.9) {
      b.Q = Math.max(0.4, b.Q * 0.7);
    }
  }

  return finalBands;
}
