/*
 * SweepEQ - Acoustic measurement and PEQ optimization tool
 * Copyright (C) 2026 SweepEQ contributors
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// ========================================================================
//  Internationalization
// ========================================================================
const LANGUAGES = ['en','zh','fr','es','ru','de','ja','ko','pt'];
const LOCALE_NAMES = { en:'English', zh:'中文', fr:'Français', es:'Español',
  ru:'Русский', de:'Deutsch', ja:'日本語', ko:'한국어', pt:'Português' };

const STR = {
  zh: {
    appTitle:'🎧 声学测量工具', device:'设备', input:'输入设备',
    output:'输出设备', inputCh:'输入声道', outputCh:'输出声道', all:'全部', refresh:'🔄 刷新设备', standby:'待机', micReady:'麦克风已就绪',
    micErr:'麦克风错误', micFail:'麦克风启动失败',
    level:'输入电平', adjust:'调整', noise:'▶ 白噪声',
    stop:'■ 停止', inGain:'输入增益', autoLevel:'自动调整',
    sweep:'测试', startSweep:'▶ 开始扫频', stopSweep:'■ 停止',
    from:'起始', to:'终止', points:'点数', dur:'时长', ms:'ms',
    filter:'带通滤波',
    ready:'就绪', waiting:'Awaiting measurement', preparing:'Preparing…', processing:'Processing…',
    measuring:'Measuring', pointFmt:(c,t,f)=>`点 ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'完成', doneFmt:(n,lo,hi)=>`${n} 个频率点 · 范围 ${lo}–${hi} Hz`,
    error:'错误', stopped:'已停止', aborted:'测量被中止',
    failed:'失败', noData:'测量数据不足，请检查输入/输出设备和音量', noSweepData:'数据不足，请先执行Sweep measurement',
    peqGenFailed:'未能生成 PEQ 参数', peqGenDone:(n)=>`自动 PEQ: ${n} 个`,
    selectMicFirst:'请先选择输入设备并启动麦克风',
    dataInfo:(n,lo,hi,t)=>`数据: ${n} 点 · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`导入: ${n} 点`, importFail:'导入失败',
    noDataExport:'没有测量数据可以导出', invalidFile:'无效的数据文件',
    rawResp:'原始频响', peq:'PEQ', corrected:'校正后', leftAxis:'(左轴)', rightAxis:'(右轴)',
    peqTitle:'参数均衡器', peqAdd:'＋ 添加', peqClear:'清除',
    peqEmpty:'尚未添加 PEQ — 点击「添加」创建',
    peqCount:(n)=>`${n} 个`,
    peqFreq:'频率', peqGain:'增益',
    autoPeqLabel:'自动 PEQ',
    autoPeqCount:'数量',
    autoPeqTarget:'目标增益',
    autoPeqTilt:'低频增益',
    autoPeqFlat:'调整响应范围',
    autoPeqGain:'PEQ 增益',
    autoPeqBtn:'▶ 生成',
        targetSpl:'目标 SPL',
    confirmClearPeq:'自动计算 PEQ 将清除当前所有 PEQ 配置，是否继续？',
    confirmOk:'确定继续',
    confirmCancel:'取消',
    noDataLabel:'无测量数据',
    exportBtn:'📤 导出数据', importBtn:'📥 导入数据',
    exportRew:'📤 REW',
    startAudioFirst:'请先启动音频再切换输出设备',
    outDevFail:'输出设备切换失败',
    defaultDev:'系统默认 (Default)',
    micLabel:(i)=>`麦克风 ${i}`, speakerLabel:(i)=>`扬声器 ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'频响 dB', axisRight:'PEQ dB',
    placeholder1:'执行Sweep measurement以获取频率响应', placeholder2:'点击左侧「开始扫频」按钮',
  },
  en: {
    appTitle:'🎧 Acoustic Measurement', device:'Device', input:'Input Device',
    output:'Output Device', inputCh:'Input Ch', outputCh:'Output Ch', all:'All', refresh:'🔄 Refresh', standby:'Standby', micReady:'Microphone ready',
    micErr:'Mic error', micFail:'Microphone failed',
    level:'Input Level', adjust:'Adjust', noise:'▶ White Noise',
    stop:'■ Stop', inGain:'Input Gain', autoLevel:'Auto',
    sweep:'Sweep', startSweep:'▶ Start Sweep', stopSweep:'■ Stop',
    from:'From', to:'To', points:'Points', dur:'Duration', ms:'ms',
    filter:'Bandpass',
    ready:'Ready', waiting:'Awaiting measurement', preparing:'Preparing…', processing:'Processing…',
    measuring:'Measuring', pointFmt:(c,t,f)=>`Point ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'Done', doneFmt:(n,lo,hi)=>`${n} points · ${lo}–${hi} Hz`,
    error:'Error', stopped:'Stopped', aborted:'Measurement aborted',
    failed:'Failed', noData:'Insufficient data — check I/O devices and volume', noSweepData:'Insufficient data — run a sweep first',
    peqGenFailed:'Failed to generate PEQ', peqGenDone:(n)=>`Auto EQ: ${n} filters`,
    selectMicFirst:'Select input device and start microphone first',
    dataInfo:(n,lo,hi,t)=>`Data: ${n} pts · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`Imported: ${n} pts`, importFail:'Import failed',
    noDataExport:'No measurement data to export', invalidFile:'Invalid data file',
    rawResp:'Raw Resp.', peq:'PEQ', corrected:'Corrected', leftAxis:'(L)', rightAxis:'(R)',
    peqTitle:'Parametric EQ', peqAdd:'＋ Add', peqClear:'Clear',
    peqEmpty:'No PEQ added — click Add to create',
    peqCount:(n)=>`${n} item(s)`,
    peqFreq:'Freq.', peqGain:'Gain',
    autoPeqLabel:'Auto EQ',
    autoPeqCount:'Count',
    autoPeqTarget:'Target',
    autoPeqTilt:'LF Tilt',
    autoPeqFlat:'Range',
    autoPeqGain:'Gain',
    autoPeqBtn:'▶ Generate',
        targetSpl:'Target SPL',
    confirmClearPeq:'Auto-calculate PEQ will clear all current PEQ settings. Continue?',
    confirmOk:'Continue',
    confirmCancel:'Cancel',
    noDataLabel:'No data',
    exportBtn:'📤 Export', importBtn:'📥 Import',
    exportRew:'📤 REW',
    startAudioFirst:'Start audio first before switching output device',
    outDevFail:'Output device switch failed',
    defaultDev:'System Default',
    micLabel:(i)=>`Mic ${i}`, speakerLabel:(i)=>`Speaker ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'Resp. dB', axisRight:'PEQ dB',
    placeholder1:'Run a sweep to measure frequency response', placeholder2:'Click "Start Sweep" on the left',
  },
  fr: {
    appTitle:'🎧 Mesure Acoustique', device:'Périphérique', input:'Périphérique d\'entrée',
    output:'Périphérique de sortie', inputCh:'Canal Entrée', outputCh:'Canal Sortie', all:'Tous',
    refresh:'🔄 Actualiser', standby:'Veille', micReady:'Micro prêt',
    micErr:'Erreur micro', micFail:'Échec micro',
    level:'Niveau Entrée', adjust:'Ajuster', noise:'▶ Bruit Blanc',
    stop:'■ Stop', inGain:'Gain Entrée', autoLevel:'Auto',
    sweep:'Balayage', startSweep:'▶ Démarrer', stopSweep:'■ Stop',
    from:'Début', to:'Fin', points:'Points', dur:'Durée', ms:'ms',
    filter:'Passe-bande',
    ready:'Prêt', waiting:'En attente', preparing:'Préparation…', processing:'Traitement…',
    measuring:'Mesure', pointFmt:(c,t,f)=>`Point ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'Terminé', doneFmt:(n,lo,hi)=>`${n} points · ${lo}–${hi} Hz`,
    error:'Erreur', stopped:'Arrêté', aborted:'Mesure interrompue',
    failed:'Échec', noData:'Données insuffisantes', noSweepData:'Données insuffisantes — lancez un balayage d\'abord',
    dataInfo:(n,lo,hi,t)=>`Données: ${n} pts · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`Importé: ${n} pts`, importFail:'Échec import',
    noDataExport:'Aucune donnée', invalidFile:'Fichier invalide',
    rawResp:'Réponse Brute', peq:'PEQ', corrected:'Corrigé', leftAxis:'(G)', rightAxis:'(D)',
    peqTitle:'Égaliseur paramétrique', peqAdd:'＋ Ajouter', peqClear:'Effacer',
    peqEmpty:'Aucun PEQ — cliquez Ajouter',
    peqCount:(n)=>`${n}`, peqFreq:'Fréq.', peqGain:'Gain',
    autoPeqLabel:'EQ Auto',
    autoPeqCount:'Nb',
    autoPeqTarget:'Cible',
    autoPeqTilt:'Inclin. BF',
    autoPeqFlat:'Fr Range',
    autoPeqGain:'Gain',
    autoPeqBtn:'▶ Générer',
        targetSpl:'SPL cible',
    confirmClearPeq:'Le calcul automatique du PEQ effacera tous les réglages PEQ actuels. Continuer\u00a0?',
    confirmOk:'Continuer',
    confirmCancel:'Annuler',
    noDataLabel:'Aucune donnée',
    exportBtn:'📤 Exporter', importBtn:'📥 Importer',
    exportRew:'📤 REW',
    startAudioFirst:'Démarrez l\'audio d\'abord',
    outDevFail:'Échec changement sortie',
    defaultDev:'Défaut Système',
    micLabel:(i)=>`Micro ${i}`, speakerLabel:(i)=>`HP ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'Réponse dB', axisRight:'PEQ dB',
    placeholder1:'Effectuez un balayage pour mesurer la réponse en fréquence',
    placeholder2:'Cliquez sur «Démarrer» à gauche',
  },
  es: {
    appTitle:'🎧 Medición Acústica', device:'Dispositivo', input:'Dispositivo de entrada',
    output:'Dispositivo de salida', inputCh:'Canal Entrada', outputCh:'Canal Salida', all:'Todos',
    refresh:'🔄 Refrescar', standby:'Espera', micReady:'Micrófono listo',
    micErr:'Error mic.', micFail:'Fallo micrófono',
    level:'Nivel Entrada', adjust:'Ajustar', noise:'▶ Ruido Blanco',
    stop:'■ Parar', inGain:'Gan. Entrada', autoLevel:'Auto',
    sweep:'Barrido', startSweep:'▶ Iniciar', stopSweep:'■ Parar',
    from:'Inicio', to:'Fin', points:'Puntos', dur:'Duración', ms:'ms',
    filter:'Paso-banda',
    ready:'Listo', waiting:'Esperando', preparing:'Preparando…', processing:'Procesando…',
    measuring:'Midiendo', pointFmt:(c,t,f)=>`Punto ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'Completado', doneFmt:(n,lo,hi)=>`${n} puntos · ${lo}–${hi} Hz`,
    error:'Error', stopped:'Detenido', aborted:'Medición cancelada',
    failed:'Fallado', noData:'Datos insuficientes', noSweepData:'Datos insuficientes — ejecute un barrido primero',
    dataInfo:(n,lo,hi,t)=>`Datos: ${n} pts · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`Importado: ${n} pts`, importFail:'Fallo importación',
    noDataExport:'Sin datos', invalidFile:'Archivo inválido',
    rawResp:'Resp. Original', peq:'PEQ', corrected:'Corregido', leftAxis:'(I)', rightAxis:'(D)',
    peqTitle:'EQ paramétrico', peqAdd:'＋ Añadir', peqClear:'Limpiar',
    peqEmpty:'Sin PEQ — pulse Añadir',
    peqCount:(n)=>`${n}`, peqFreq:'Frec.', peqGain:'Gan.',
    autoPeqLabel:'EQ Auto',
    autoPeqCount:'Cant.',
    autoPeqTarget:'Objetivo',
    autoPeqTilt:'Inclin. BF',
    autoPeqFlat:'Rango',
    autoPeqGain:'Ganancia',
    autoPeqBtn:'▶ Generar',
        targetSpl:'SPL objetivo',
    confirmClearPeq:'El cálculo automático de PEQ borrará todos los ajustes actuales. ¿Continuar?',
    confirmOk:'Continuar',
    confirmCancel:'Cancelar',
    noDataLabel:'Sin datos',
    exportBtn:'📤 Exportar', importBtn:'📥 Importar',
    exportRew:'📤 REW',
    exportRew:'📤 REW',
    startAudioFirst:'Inicie audio primero',
    outDevFail:'Fallo cambio salida',
    defaultDev:'Defecto Sistema',
    micLabel:(i)=>`Mic ${i}`, speakerLabel:(i)=>`Altavoz ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'Resp. dB', axisRight:'PEQ dB',
    placeholder1:'Realice un barrido para medir la respuesta de frecuencia',
    placeholder2:'Haga clic en «Iniciar» a la izquierda',
  },
  ru: {
    appTitle:'🎧 Акустические Измерения', device:'Устройство', input:'Устройство входа',
    output:'Устройство выхода', inputCh:'Канал входа', outputCh:'Канал выхода', all:'Все',
    refresh:'🔄 Обновить', standby:'Ожидание', micReady:'Микрофон готов',
    micErr:'Ошибка микрофона', micFail:'Не удалось запустить микрофон',
    level:'Уровень входа', adjust:'Настройка', noise:'▶ Белый шум',
    stop:'■ Стоп', inGain:'Усиление входа', autoLevel:'Авто',
    sweep:'Свип', startSweep:'▶ Старт', stopSweep:'■ Стоп',
    from:'От', to:'До', points:'Точки', dur:'Длит.', ms:'мс',
    filter:'Полосовой',
    ready:'Готов', waiting:'Ожидание', preparing:'Подготовка…', processing:'Обработка…',
    measuring:'Измерение', pointFmt:(c,t,f)=>`Точка ${c}/${t}  ${f.toFixed(0)} Гц`,
    done:'Готово', doneFmt:(n,lo,hi)=>`${n} точек · ${lo}–${hi} Гц`,
    error:'Ошибка', stopped:'Остановлено', aborted:'Измерение прервано',
    failed:'Сбой', noData:'Недостаточно данных', noSweepData:'Недостаточно данных — сначала выполните измерение',
    dataInfo:(n,lo,hi,t)=>`Данные: ${n} т. · ${lo}–${hi} Гц · ${t}`,
    importOk:(n)=>`Импорт: ${n} т.`, importFail:'Ошибка импорта',
    noDataExport:'Нет данных', invalidFile:'Неверный файл',
    rawResp:'Исходный', peq:'PEQ', corrected:'Скоррект.', leftAxis:'(Л)', rightAxis:'(П)',
    peqTitle:'Параметрический эквалайзер', peqAdd:'＋ Добавить', peqClear:'Очистить',
    peqEmpty:'Нет PEQ — нажмите Добавить',
    peqCount:(n)=>`${n}`, peqFreq:'Частота', peqGain:'Усил.',
    autoPeqLabel:'Авто ЭК',
    autoPeqCount:'Кол-во',
    autoPeqTarget:'Цель',
    autoPeqTilt:'НЧ наклон',
    autoPeqFlat:'Диапазон',
    autoPeqGain:'Усиление',
    autoPeqBtn:'▶ Создать',
        targetSpl:'Целевой SPL',
    confirmClearPeq:'Автоматический расчет PEQ удалит все текущие настройки PEQ. Продолжить?',
    confirmOk:'Продолжить',
    confirmCancel:'Отмена',
    noDataLabel:'Нет данных',
    exportBtn:'📤 Экспорт', importBtn:'📥 Импорт',
    exportRew:'📤 REW',
    startAudioFirst:'Сначала запустите аудио',
    outDevFail:'Ошибка переключения',
    defaultDev:'Системный',
    micLabel:(i)=>`Мик ${i}`, speakerLabel:(i)=>`Дин ${i}`,
    hz:'Гц', db:'дБ',
    axisLeft:'Отклик дБ', axisRight:'PEQ дБ',
    placeholder1:'Выполните свип-измерение для получения АЧХ',
    placeholder2:'Нажмите «Старт» слева',
  },
  de: {
    appTitle:'🎧 Akustische Messung', device:'Gerät', input:'Eingangsgerät',
    output:'Ausgangsgerät', inputCh:'Eingangskanal', outputCh:'Ausgangskanal', all:'Alle',
    refresh:'🔄 Aktualisieren', standby:'Bereit', micReady:'Mikrofon bereit',
    micErr:'Mikrofonfehler', micFail:'Mikrofonfehler',
    level:'Eingangspegel', adjust:'Einstellen', noise:'▶ Weißes Rauschen',
    stop:'■ Stop', inGain:'Eingangsverst.', autoLevel:'Auto',
    sweep:'Sweep', startSweep:'▶ Start', stopSweep:'■ Stop',
    from:'Von', to:'Bis', points:'Punkte', dur:'Dauer', ms:'ms',
    filter:'Bandpass',
    ready:'Bereit', waiting:'Warten', preparing:'Vorbereiten…', processing:'Verarbeitung…',
    measuring:'Messen', pointFmt:(c,t,f)=>`Punkt ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'Fertig', doneFmt:(n,lo,hi)=>`${n} Punkte · ${lo}–${hi} Hz`,
    error:'Fehler', stopped:'Gestoppt', aborted:'Abbruch',
    failed:'Fehlgeschlagen', noData:'Unzureichende Daten', noSweepData:'Keine Daten — führen Sie zuerst einen Sweep durch',
    dataInfo:(n,lo,hi,t)=>`Daten: ${n} Pkt. · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`Importiert: ${n} Pkt.`, importFail:'Importfehler',
    noDataExport:'Keine Daten', invalidFile:'Ungültige Datei',
    rawResp:'Original', peq:'PEQ', corrected:'Korrigiert', leftAxis:'(L)', rightAxis:'(R)',
    peqTitle:'Parametrischer EQ', peqAdd:'＋ Hinzufügen', peqClear:'Löschen',
    peqEmpty:'Kein PEQ — klicken Sie Hinzufügen',
    peqCount:(n)=>`${n}`, peqFreq:'Freq.', peqGain:'Gain',
    autoPeqLabel:'Auto EQ',
    autoPeqCount:'Anzahl',
    autoPeqTarget:'Ziel',
    autoPeqTilt:'LF-Neigung',
    autoPeqFlat:'Bereich',
    autoPeqGain:'Verstärk.',
    autoPeqBtn:'▶ Erzeugen',
        targetSpl:'Ziel-SPL',
    confirmClearPeq:'Die automatische PEQ-Berechnung löscht alle aktuellen PEQ-Einstellungen. Fortfahren?',
    confirmOk:'Fortfahren',
    confirmCancel:'Abbrechen',
    noDataLabel:'Keine Daten',
    exportBtn:'📤 Exportieren', importBtn:'📥 Importieren',
    exportRew:'📤 REW',
    startAudioFirst:'Starten Sie zuerst Audio',
    outDevFail:'Ausgangswechsel fehlgeschlagen',
    defaultDev:'Standard',
    micLabel:(i)=>`Mik ${i}`, speakerLabel:(i)=>`Laut ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'Antwort dB', axisRight:'PEQ dB',
    placeholder1:'Führen Sie einen Sweep durch, um den Frequenzgang zu messen',
    placeholder2:'Klicken Sie links auf «Start»',
  },
  ja: {
    appTitle:'🎧 音響測定', device:'デバイス', input:'入力デバイス',
    output:'出力デバイス', inputCh:'入力チャンネル', outputCh:'出力チャンネル', all:'すべて',
    refresh:'🔄 更新', standby:'待機', micReady:'マイク準備完了',
    micErr:'マイクエラー', micFail:'マイク起動失敗',
    level:'入力レベル', adjust:'調整', noise:'▶ ホワイトノイズ',
    stop:'■ 停止', inGain:'入力ゲイン', autoLevel:'自動',
    sweep:'スイープ', startSweep:'▶ 開始', stopSweep:'■ 停止',
    from:'開始', to:'終了', points:'点数', dur:'時間', ms:'ms',
    filter:'帯域通過',
    ready:'準備完了', waiting:'待機中', preparing:'準備中…', processing:'処理中…',
    measuring:'測定中', pointFmt:(c,t,f)=>`点 ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'完了', doneFmt:(n,lo,hi)=>`${n} 点 · ${lo}–${hi} Hz`,
    error:'エラー', stopped:'停止', aborted:'測定中断',
    failed:'失敗', noData:'データ不足', noSweepData:'データ不足 — スイープ測定を先に実行してください',
    dataInfo:(n,lo,hi,t)=>`データ: ${n} 点 · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`インポート: ${n} 点`, importFail:'インポート失敗',
    noDataExport:'データなし', invalidFile:'無効なファイル',
    rawResp:'元の応答', peq:'PEQ', corrected:'補正後', leftAxis:'(左)', rightAxis:'(右)',
    peqTitle:'パラメトリックEQ', peqAdd:'＋ 追加', peqClear:'クリア',
    peqEmpty:'PEQ なし — 「追加」をクリック',
    peqCount:(n)=>`${n}`, peqFreq:'周波数', peqGain:'ゲイン',
    autoPeqLabel:'自動EQ',
    autoPeqCount:'数',
    autoPeqTarget:'目標',
    autoPeqTilt:'低域傾斜',
    autoPeqFlat:'範囲',
    autoPeqGain:'ゲイン',
    autoPeqBtn:'▶ 生成',
        targetSpl:'目標 SPL',
    confirmClearPeq:'自動PEQ計算を実行すると、現在のPEQ設定がすべて消去されます。続行しますか？',
    confirmOk:'続行',
    confirmCancel:'キャンセル',
    noDataLabel:'データなし',
    exportBtn:'📤 エクスポート', importBtn:'📥 インポート',
    exportRew:'📤 REW',
    startAudioFirst:'先にオーディオを起動してください',
    outDevFail:'出力デバイス切替失敗',
    defaultDev:'システムデフォルト',
    micLabel:(i)=>`マイク ${i}`, speakerLabel:(i)=>`スピーカー ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'応答 dB', axisRight:'PEQ dB',
    placeholder1:'スイープ測定を実行して周波数特性を取得',
    placeholder2:'左側の「開始」をクリック',
  },
  ko: {
    appTitle:'🎧 음향 측정', device:'장치', input:'입력 장치',
    output:'출력 장치', inputCh:'입력 채널', outputCh:'출력 채널', all:'모두',
    refresh:'🔄 새로고침', standby:'대기', micReady:'마이크 준비 완료',
    micErr:'마이크 오류', micFail:'마이크 시작 실패',
    level:'입력 레벨', adjust:'조정', noise:'▶ 백색 잡음',
    stop:'■ 정지', inGain:'입력 게인', autoLevel:'자동',
    sweep:'스위프', startSweep:'▶ 시작', stopSweep:'■ 정지',
    from:'시작', to:'종료', points:'포인트', dur:'시간', ms:'ms',
    filter:'대역 통과',
    ready:'준비', waiting:'대기 중', preparing:'준비 중…', processing:'처리 중…',
    measuring:'측정 중', pointFmt:(c,t,f)=>`포인트 ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'완료', doneFmt:(n,lo,hi)=>`${n} 포인트 · ${lo}–${hi} Hz`,
    error:'오류', stopped:'중지', aborted:'측정 중단',
    failed:'실패', noData:'데이터 부족', noSweepData:'데이터 부족 — 스윕 측정을 먼저 실행하세요',
    dataInfo:(n,lo,hi,t)=>`데이터: ${n} 포인트 · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`가져오기: ${n} 포인트`, importFail:'가져오기 실패',
    noDataExport:'내보낼 데이터 없음', invalidFile:'잘못된 파일',
    rawResp:'원래 응답', peq:'PEQ', corrected:'보정됨', leftAxis:'(좌)', rightAxis:'(우)',
    peqTitle:'파라메트릭 EQ', peqAdd:'＋ 추가', peqClear:'지우기',
    peqEmpty:'PEQ 없음 — 추가를 클릭하세요',
    peqCount:(n)=>`${n}`, peqFreq:'주파수', peqGain:'게인',
    autoPeqLabel:'자동 EQ',
    autoPeqCount:'개수',
    autoPeqTarget:'목표',
    autoPeqTilt:'저역 기울기',
    autoPeqFlat:'범위',
    autoPeqGain:'게인',
    autoPeqBtn:'▶ 생성',
        targetSpl:'목표 SPL',
    confirmClearPeq:'자동 PEQ 계산을 실행하면 현재 PEQ 설정이 모두 지워집니다. 계속하시겠습니까?',
    confirmOk:'계속',
    confirmCancel:'취소',
    noDataLabel:'데이터 없음',
    exportBtn:'📤 내보내기', importBtn:'📥 가져오기',
    exportRew:'📤 REW',
    startAudioFirst:'오디오를 먼저 시작하세요',
    outDevFail:'출력 장치 전환 실패',
    defaultDev:'시스템 기본값',
    micLabel:(i)=>`마이크 ${i}`, speakerLabel:(i)=>`스피커 ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'응답 dB', axisRight:'PEQ dB',
    placeholder1:'스위프 측정을 실행하여 주파수 응답을 얻으세요',
    placeholder2:'왼쪽의 「시작」을 클릭하세요',
  },
  pt: {
    appTitle:'🎧 Medição Acústica', device:'Dispositivo', input:'Dispositivo de entrada',
    output:'Dispositivo de saída', inputCh:'Canal Entrada', outputCh:'Canal Saída', all:'Todos',
    refresh:'🔄 Atualizar', standby:'Espera', micReady:'Microfone pronto',
    micErr:'Erro microfone', micFail:'Falha no microfone',
    level:'Nível Entrada', adjust:'Ajustar', noise:'▶ Ruído Branco',
    stop:'■ Parar', inGain:'Ganho Entrada', autoLevel:'Auto',
    sweep:'Varredura', startSweep:'▶ Iniciar', stopSweep:'■ Parar',
    from:'Início', to:'Fim', points:'Pontos', dur:'Duração', ms:'ms',
    filter:'Passa-banda',
    ready:'Pronto', waiting:'Aguardando', preparing:'Preparando…', processing:'Processando…',
    measuring:'Medindo', pointFmt:(c,t,f)=>`Ponto ${c}/${t}  ${f.toFixed(0)} Hz`,
    done:'Concluído', doneFmt:(n,lo,hi)=>`${n} pontos · ${lo}–${hi} Hz`,
    error:'Erro', stopped:'Parado', aborted:'Medição cancelada',
    failed:'Falhou', noData:'Dados insuficientes', noSweepData:'Dados insuficientes — execute uma varredura primeiro',
    dataInfo:(n,lo,hi,t)=>`Dados: ${n} pts · ${lo}–${hi} Hz · ${t}`,
    importOk:(n)=>`Importado: ${n} pts`, importFail:'Falha na importação',
    noDataExport:'Sem dados', invalidFile:'Arquivo inválido',
    rawResp:'Resp. Original', peq:'PEQ', corrected:'Corrigido', leftAxis:'(E)', rightAxis:'(D)',
    peqTitle:'EQ paramétrico', peqAdd:'＋ Adicionar', peqClear:'Limpar',
    peqEmpty:'Sem PEQ — clique Adicionar',
    peqCount:(n)=>`${n}`, peqFreq:'Freq.', peqGain:'Ganho',
    autoPeqLabel:'EQ Auto',
    autoPeqCount:'Quant.',
    autoPeqTarget:'Alvo',
    autoPeqTilt:'Inclin. BF',
    autoPeqFlat:'Faixa',
    autoPeqGain:'Ganho',
    autoPeqBtn:'▶ Gerar',
    exportRew:'📤 REW',
        targetSpl:'SPL alvo',
    confirmClearPeq:'O cálculo automático de PEQ limpará todas as configurações atuais de PEQ. Continuar?',
    confirmOk:'Continuar',
    confirmCancel:'Cancelar',
    noDataLabel:'Sem dados',
    exportBtn:'📤 Exportar', importBtn:'📥 Importar',
    startAudioFirst:'Inicie o áudio primeiro',
    outDevFail:'Falha ao trocar saída',
    defaultDev:'Padrão Sistema',
    micLabel:(i)=>`Mic ${i}`, speakerLabel:(i)=>`Alto-falante ${i}`,
    hz:'Hz', db:'dB',
    axisLeft:'Resp. dB', axisRight:'PEQ dB',
    placeholder1:'Execute uma varredura para medir a resposta de frequência',
    placeholder2:'Clique em «Iniciar» à esquerda',
  },
};

let _lang = 'en';
function tr(key) { return STR[_lang] && STR[_lang][key] !== undefined ? STR[_lang][key] : (STR.en[key] || key); }
function trf(key, ...args) { const v = tr(key); return typeof v === 'function' ? v(...args) : v; }

function applyLanguage(lang) {
  _lang = lang;
  document.documentElement.lang = lang;
  const t = STR[lang] || STR.en;
  const _ = (el) => { try { return document.querySelector(el); } catch(e) { return null; } };
  const __ = (el) => { try { return document.querySelectorAll(el); } catch(e) { return []; } };
  const safe = (fn) => { try { fn(); } catch(e) { console.warn('i18n:', e); } };

  safe(() => document.querySelector('h1').textContent = '🎧 SweepEQ');
  safe(() => { document.title = 'Sweep EQ: Room EQ made easy'; });
  safe(() => _('#devicePanel h2').textContent = t.device);
  safe(() => _('#levelPanel h2').textContent = t.level);
  safe(() => _('#adjustPanel h2').textContent = t.adjust);
  safe(() => _('#sweepPanel h2').textContent = t.sweep);

  // Device panel
  safe(() => _('#devicePanel .panel-row:nth-child(2) label').textContent = t.input);
  safe(() => _('#devicePanel .panel-row:nth-child(3) label').textContent = t.inputCh);
  safe(() => _('#devicePanel .panel-row:nth-child(4) label').textContent = t.output);
  safe(() => _('#devicePanel .panel-row:nth-child(5) label').textContent = t.outputCh);

  safe(() => { rebuildChannelOptions('inChannel', audio._inChannelCount || 2, false); });
  safe(() => { rebuildChannelOptions('outChannel', audio._outChCount || 2, true); });
  safe(() => { $refreshDevices.textContent = t.refresh; });
  safe(() => { $audioStatus.textContent = t.standby; });

  // Adjust panel
  safe(() => { $playNoise.textContent = t.noise; });
  safe(() => { $stopNoise.textContent = t.stop; });
  safe(() => _('#adjustPanel .panel-row:nth-child(3) label').textContent = t.inGain);
  safe(() => { $autoLevelBtn.textContent = t.autoLevel; });

  // Sweep panel
  safe(() => { $startSweep.textContent = t.startSweep; });
  safe(() => { $stopSweep.textContent = t.stopSweep; });
  safe(() => {
    const sw = _('#sweepPanel');
    if (!sw) return;
    const ll = sw.querySelectorAll('.panel-row label');
    if (ll[0]) ll[0].textContent = t.from;
    if (ll[1]) ll[1].textContent = t.to;
    if (ll[2]) ll[2].textContent = t.points;
    if (ll[3]) ll[3].textContent = t.dur;
    // ll[4] 是 chk-label（含 checkbox），安全替换文本
    if (ll[4]) {
      const cb = ll[4].querySelector('input[type="checkbox"]');
      ll[4].textContent = '';
      if (cb) ll[4].appendChild(cb);
      ll[4].append(t.filter);
    }
    if (ll[5]) ll[5].textContent = 'Q';
  });
  // 单位
  safe(() => {
    const spans = __('#sweepPanel span[style*="font-size:11px"]');
    if (spans[0]) spans[0].textContent = t.hz;
    if (spans[1]) spans[1].textContent = t.hz;
    if (spans[2]) spans[2].textContent = t.ms;
  });

  // 状态
  safe(() => {
    if (!audio._sweepRunning && !audio._noiseSource) {
      setStatus('idle', t.ready, t.waiting);
    }
  });

  // Legend
  safe(() => {
    const items = __('.legend-item');
    if (items.length >= 4) {
      // 第0项：原始频响 + (左轴)
      const c0 = items[0].childNodes;
      for (const n of c0) if (n.nodeType === 3) { n.textContent = t.rawResp + ' '; break; }
      const la = items[0].querySelector('span[style*="color:#8b949e"]');
      if (la) la.textContent = t.leftAxis;
      // 第1项：PEQ + (右轴)
      const c1 = items[1].childNodes;
      for (const n of c1) if (n.nodeType === 3) { n.textContent = t.peq + ' '; break; }
      const ra = items[1].querySelector('span[style*="color:#8b949e"]');
      if (ra) ra.textContent = t.rightAxis;
      // 第2项：校正后
      const c2 = items[2].childNodes;
      for (const n of c2) if (n.nodeType === 3) { n.textContent = t.corrected; break; }
    }
  });

  // PEQ 面板
  safe(() => { const el = _('#peqPanel h2'); if (el) el.textContent = t.peqTitle; });
  safe(() => { $addPeqBtn.textContent = t.peqAdd; });
  safe(() => { $clearPeqBtn.textContent = t.peqClear; });
  safe(() => { $peqEmpty.textContent = t.peqEmpty; });

  // Auto PEQ 面板
  safe(() => {
    const el = _('[data-i18n="autoPeqLabel"]'); if (el) el.textContent = t.autoPeqLabel;
  });
  safe(() => {
    const el = _('[data-i18n="autoPeqCount"]'); if (el) el.textContent = t.autoPeqCount;
  });
  safe(() => {
    const el = _('[data-i18n="autoPeqFlat"]'); if (el) el.textContent = t.autoPeqFlat;
  });
  safe(() => {
    const el = _('[data-i18n="autoPeqGain"]'); if (el) el.textContent = t.autoPeqGain;
  });
  safe(() => {
    const el = _('[data-i18n="autoPeqBtn"]'); if (el) el.textContent = t.autoPeqBtn;
  });
  safe(() => {
    const el = _('[data-i18n="autoPeqTarget"]'); if (el) el.textContent = t.autoPeqTarget;
  });
  safe(() => {
    const el = _('[data-i18n="autoPeqTilt"]'); if (el) el.textContent = t.autoPeqTilt;
  });

  // 导入导出
  safe(() => { $exportBtn.textContent = t.exportBtn; });
  safe(() => { $importBtn.textContent = t.importBtn; });
  safe(() => {
    const el = _('[data-i18n="exportRew"]'); if (el) el.textContent = t.exportRew;
  });
  safe(() => {
    const el = _('[data-i18n="targetSpl"]'); if (el) el.textContent = t.targetSpl;
  });
  safe(() => {
    if (freqData && freqData.length > 0) {
      const lo = Math.round(freqData[0].freq);
      const hi = Math.round(freqData[freqData.length-1].freq);
      $dataInfo.textContent = trf('dataInfo', freqData.length, lo, hi, new Date().toLocaleTimeString());
    } else {
      $dataInfo.textContent = t.noDataLabel;
    }
  });

  safe(() => { renderPEQList(); });
  safe(() => { chart.draw(); });
}

/** 根据声道数返回标准扬声器标签 */
function getChannelLabels(chCount) {
  const LABELS = {
    1: ['M'],
    2: ['L', 'R'],
    4: ['L', 'R', 'SL', 'SR'],
    6: ['L', 'R', 'C', 'LFE', 'SL', 'SR'],
    8: ['L', 'R', 'C', 'LFE', 'SL', 'SR', 'RL', 'RR'],
  };
  return LABELS[chCount] || Array.from({ length: chCount }, (_, i) => `${i + 1}`);
}

/** 重建声道选择下拉框（根据实际声道数动态生成） */
function rebuildChannelOptions(selectId, chCount, isOutput) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const val = sel.value;
  const n = chCount || 2;
  const labels = getChannelLabels(n);
  let html = '';
  if (isOutput) {
    html += `<option value="all" selected>${tr('all')}</option>`;
  }
  for (let i = 0; i < n; i++) {
    html += `<option value="${i}">${labels[i]}</option>`;
  }
  sel.innerHTML = html;
  if (val && (val === 'all' || (parseInt(val) < n))) sel.value = val;
}

function detectBrowserLang() {
  const navLang = (navigator.language || navigator.userLanguage || 'en').slice(0,2).toLowerCase();
  return LANGUAGES.includes(navLang) ? navLang : 'en';
}

// ========================================================================
// ========================================================================
//  AudioEngine — Web Audio 引擎
//  职责：创建 AudioContext，管理输入（麦克风）和输出（播放）音频链，
//  生成白噪声，执行Sweep measurement，Auto input level adjustment
// ========================================================================
//  AudioEngine — 管理 Web Audio 上下文、设备、节点
// ========================================================================
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.micStream = null;
    this.micSource = null;
    this.micGain = null;
    this.micAnalyser = null;
    this.masterGain = null;
    this.masterAnalyser = null;
    this._running = false;
    this._noiseSource = null;
    this._noiseGain = null;
    this._sweepOsc = null;
    this._sweepGain = null;
    this._sweepRunning = false;
    this._onAudioData = null; // callback (buffer) when mic data arrives
    this._scriptNode = null;
    this._inputBuffers = [];
    this._isRecording = false;
    this._micPanner = null;
    this._inChannelCount = 2;
    this._outGains = [];
    this._outSplitter = null;
    this._outMerger = null;
    this._outChCount = 2;
  }

  async init() {
    if (this.ctx && this.ctx.state !== 'closed') return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1;
    this.masterAnalyser = this.ctx.createAnalyser();
    this.masterAnalyser.fftSize = 1024;
    // Output routing: masterGain → splitter → per-channel Gain → merger → destination
    const outCh = Math.min(this.ctx.destination.maxChannelCount || 2, 8);
    this._outChCount = outCh;
    this._outSplitter = this.ctx.createChannelSplitter(outCh);
    this._outGains = [];
    this._outMerger = this.ctx.createChannelMerger(outCh);
    this.masterGain.connect(this._outSplitter);
    for (let i = 0; i < outCh; i++) {
      const g = this.ctx.createGain();
      g.gain.value = 1;
      this._outGains.push(g);
      this._outSplitter.connect(g, i, 0);
      g.connect(this._outMerger, 0, i);
    }
    this._outMerger.connect(this.masterAnalyser);
    this.masterAnalyser.connect(this.ctx.destination);
    // Default out vol
    this.setOutVolume(-12);
    // Input chain (built after mic starts)
  }

  async startMic(deviceId) {
    if (this.micStream) {
      this.stopMic();
    }
    // Release the pre-granted permission stream before opening the real mic
    if (window._permStream) {
      window._permStream.getTracks().forEach(t => t.stop());
      window._permStream = null;
    }
    const constraints = {
      audio: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      }
    };
    this.micStream = await navigator.mediaDevices.getUserMedia(constraints);
    // Detect input channel count
    try {
      const track = this.micStream.getAudioTracks()[0];
      const settings = track.getSettings();
      this._inChannelCount = settings.channelCount || 2;
    } catch(e) {
      this._inChannelCount = 2;
    }
    this.micSource = this.ctx.createMediaStreamSource(this.micStream);
    this.micGain = this.ctx.createGain();
    this.micGain.gain.value = 1; // 0dB
    this.micAnalyser = this.ctx.createAnalyser();
    this.micAnalyser.fftSize = 2048;
    this.micSource.connect(this.micGain);
    this.micGain.connect(this.micAnalyser);
    // Don't connect mic to destination (no feedback)
    return true;
  }

  stopMic() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    this.micSource = null;
    this.micGain = null;
    this.micAnalyser = null;
    this._inputBuffers = [];
    this._isRecording = false;
  }

  /** Set output volume (dB), cancels scheduled values first (Safari compat) */
  setOutVolume(dB) {
    if (!this.masterGain) return;
    const gain = Math.pow(10, dB / 20);
    this.masterGain.gain.cancelScheduledValues(0);
    this.masterGain.gain.setValueAtTime(gain, this.ctx.currentTime);
  }

  /** Set input gain (dB), cancels scheduled values first */
  setInGain(dB) {
    if (!this.micGain) return;
    const gain = Math.pow(10, dB / 20);
    this.micGain.gain.cancelScheduledValues(0);
    this.micGain.gain.setValueAtTime(gain, this.ctx.currentTime);
  }

  /** Set output channel: 'all' or channel index */
  setOutputChannel(mode) {
    if (!this._outGains || this._outGains.length === 0) return;
    if (mode === 'all') {
      for (const g of this._outGains) g.gain.value = 1;
    } else {
      const idx = parseInt(mode);
      for (let i = 0; i < this._outGains.length; i++) {
        this._outGains[i].gain.value = (i === idx) ? 1 : 0;
      }
    }
  }

  /** Switch output device (Chrome setSinkId only) */
  async setOutputDevice(deviceId) {
    if (!this.ctx || typeof this.ctx.setSinkId !== 'function') return false;
    try {
      await this.ctx.setSinkId(deviceId);
      return true;
    } catch (e) {
      console.warn('输出设备切换失败:', e);
      return false;
    }
  }

  /** Check if browser supports output device switching */
  static supportsOutputSwitch() {
    return typeof AudioContext !== 'undefined' &&
      typeof AudioContext.prototype.setSinkId === 'function';
  }

  // ---- White noise (stereo) ----
  startNoise(volumeDB = -12) {
    if (!this.ctx || !this.masterGain) return;
    this.stopNoise();
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }
    }
    this._noiseSource = this.ctx.createBufferSource();
    this._noiseSource.buffer = buffer;
    this._noiseSource.loop = true;
    this._noiseGain = this.ctx.createGain();
    this._noiseGain.gain.cancelScheduledValues(0);
    this._noiseGain.gain.setValueAtTime(Math.pow(10, volumeDB / 20), this.ctx.currentTime);
    this._noiseSource.connect(this._noiseGain);
    this._noiseGain.connect(this.masterGain);
    this._noiseSource.start();
  }

  stopNoise() {
    if (this._noiseSource) {
      try { this._noiseSource.stop(); } catch(e) {}
      this._noiseSource = null;
    }
    this._noiseGain = null;
  }

  // ---- Sweep measurement (log-sweep + FFT) ----

  /** Generate a log-sweep (exponential chirp) signal */
  _generateSweepSignal(f0, f1, duration) {
    const fs = this.ctx.sampleRate;
    const n = Math.floor(duration * fs);
    const L = duration / Math.log(f1 / f0);
    const sig = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / fs;
      sig[i] = Math.sin(2 * Math.PI * f0 * L * (Math.exp(t / L) - 1));
    }
    return sig;
  }

  /** Radix-2 FFT (in-place). real/imag arrays length must be power of 2 */
  _fft(re, im) {
    const n = re.length;
    // Bit reversal
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const half = len >> 1;
      const wRe = Math.cos(Math.PI / half);
      const wIm = -Math.sin(Math.PI / half);
      for (let i = 0; i < n; i += len) {
        let wr = 1, wi = 0;
        for (let j = 0; j < half; j++) {
          const k = i + j;
          const tRe = wr * re[k + half] - wi * im[k + half];
          const tIm = wr * im[k + half] + wi * re[k + half];
          re[k + half] = re[k] - tRe;
          im[k + half] = im[k] - tIm;
          re[k] += tRe;
          im[k] += tIm;
          const tmp = wr * wRe - wi * wIm;
          wi = wr * wIm + wi * wRe;
          wr = tmp;
        }
      }
    }
  }

  /** Hann window in-place */
  _hannWindow(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      arr[i] *= 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
    }
  }

  /** Compute magnitude spectrum (dB) at 384 log-spaced frequencies from recorded signal */
  _sweepFFT(recorded, refSignal, freqLow, freqHigh) {
    const fs = this.ctx.sampleRate;
    // Use power-of-2 FFT size
    const n = recorded.length;
    const fftSize = Math.pow(2, Math.floor(Math.log2(n)));
    const offset = Math.floor((n - fftSize) / 2);  // take middle section

    // Window and FFT the recorded signal
    const reRec = new Float64Array(fftSize);
    const imRec = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      reRec[i] = recorded[offset + i];
    }
    this._hannWindow(reRec);
    this._fft(reRec, imRec);

    // Window and FFT the reference signal
    const refOffset = Math.floor((refSignal.length - fftSize) / 2);
    const reRef = new Float64Array(fftSize);
    const imRef = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      reRef[i] = refSignal[refOffset + i];
    }
    this._hannWindow(reRef);
    this._fft(reRef, imRef);

    // Build 384 log-spaced results
    const K = 384;
    const logLow = Math.log(freqLow);
    const logHigh = Math.log(freqHigh);
    const results = [];
    for (let i = 0; i < K; i++) {
      const freq = Math.exp(logLow + (logHigh - logLow) * i / (K - 1));
      const bin = Math.round(freq / fs * fftSize);
      if (bin < 1 || bin >= fftSize / 2) continue;
      // Transfer function: H = recorded / reference
      const magRec = Math.sqrt(reRec[bin] * reRec[bin] + imRec[bin] * imRec[bin]);
      const magRef = Math.sqrt(reRef[bin] * reRef[bin] + imRef[bin] * imRef[bin]);
      let phase = Math.atan2(imRec[bin], reRec[bin]) - Math.atan2(imRef[bin], reRef[bin]);
      if (magRef > 1e-12) {
        const h = magRec / magRef;
        const dB = 20 * Math.log10(Math.max(h, 1e-12));
        phase = phase * 180 / Math.PI;
        while (phase < -180) phase += 360;
        while (phase > 180) phase -= 360;
        results.push({ freq, rms: h, dB, phase });
      }
    }
    return results;
  }

  async runSweepMeasure(freqLow, freqHigh, duration, onProgress, onDone, onError, inChan) {
    if (!this.ctx || !this.micGain) {
      onError(tr('selectMicFirst'));
      return;
    }
    if (this._sweepRunning) return;
    this._sweepRunning = true;
    this._inputBuffers = [];
    this._isRecording = true;

    const fs = this.ctx.sampleRate;
    onProgress(0, 1, 'Generating sweep…');

    // Generate log-sweep signal
    const sweepSignal = this._generateSweepSignal(freqLow, freqHigh, duration);
    const totalSamples = sweepSignal.length;

    // Setup ScriptProcessorNode for capture
    const inChCount = this._inChannelCount || 2;
    const scriptNode = this.ctx.createScriptProcessor(2048, inChCount, 1);
    const inputBuffer = [];
    let recordedSamples = 0;
    scriptNode.onaudioprocess = (e) => {
      if (!this._isRecording) return;
      const chIdx = parseInt(inChan);
      if (chIdx >= e.inputBuffer.numberOfChannels) return;
      const data = e.inputBuffer.getChannelData(chIdx);
      inputBuffer.push(new Float32Array(data));
      recordedSamples += data.length;
    };

    // Playback setup
    const sweepBuffer = this.ctx.createBuffer(1, totalSamples, fs);
    sweepBuffer.getChannelData(0).set(sweepSignal);
    const source = this.ctx.createBufferSource();
    source.buffer = sweepBuffer;
    const sweepGain = this.ctx.createGain();
    sweepGain.gain.value = Math.pow(10, -6 / 20);
    source.connect(sweepGain);
    sweepGain.connect(this.masterGain);

    // Mute node to prevent feedback
    const muteGain = this.ctx.createGain();
    muteGain.gain.value = 0;
    this.micGain.connect(scriptNode);
    scriptNode.connect(muteGain);
    muteGain.connect(this.ctx.destination);

    // Play
    source.start();
    onProgress(1, 2, 'Measuring…');

    // Wait for playback + a bit of silence after
    await this._sleep(Math.ceil(duration * 1000) + 500);
    source.stop();
    this._isRecording = false;

    // Cleanup nodes
    this.micGain.disconnect(scriptNode);
    scriptNode.disconnect();
    muteGain.disconnect();
    this._sweepRunning = false;

    // Combine recorded buffers
    onProgress(2, 3, 'Processing FFT…');
    const totalRec = recordedSamples;
    const recorded = new Float64Array(totalRec);
    let pos = 0;
    for (const buf of inputBuffer) {
      recorded.set(buf, pos);
      pos += buf.length;
    }

    // Compute frequency response via FFT
    const results = this._sweepFFT(recorded, sweepSignal, freqLow, freqHigh);

    if (results.length < 10) {
      onError('Insufficient data — check input/output devices and volume');
      return;
    }

    // Normalize: shift so max = 0 dB
    const maxDB = Math.max(...results.map(r => r.dB));
    results.forEach(r => { r.dB_norm = r.dB - maxDB; });

    onProgress(3, 3, 'Done');
    await this._sleep(50);
    onDone(results, false);
  }

  /** RMS from a specific sample range in the flat buffer, skipping settle */
  _measureBlockRMS(buffer, startSample, totalSamples, settleCount, measureCount) {
    let totalLen = 0;
    for (let i = 0; i < buffer.length; i++) totalLen += buffer[i].length;

    const bufBeforeStart = startSample;
    const samplesAfterStart = totalLen - bufBeforeStart;
    if (samplesAfterStart < settleCount + 10) return 0;

    const measureStart = bufBeforeStart + settleCount;
    const available = totalLen - measureStart;
    const take = Math.min(available, measureCount);

    let sumSq = 0;
    let copied = 0;
    let cursor = 0;
    for (let i = 0; i < buffer.length; i++) {
      const chunk = buffer[i];
      const chunkStart = cursor;
      const chunkEnd = cursor + chunk.length;
      cursor = chunkEnd;

      if (chunkEnd <= measureStart) continue;
      if (chunkStart >= measureStart + take) break;

      const localStart = Math.max(0, measureStart - chunkStart);
      const localEnd = Math.min(chunk.length, measureStart + take - chunkStart);
      for (let j = localStart; j < localEnd; j++) {
        sumSq += chunk[j] * chunk[j];
        copied++;
      }
    }

    if (copied < 10) return 0;
    return Math.sqrt(sumSq / copied);
  }

  /** 用正交解调测量信号在指定频率的相位（度）
   *  原理：将输入信号分别乘以 cos(2πft) 和 sin(2πft)，低通滤波后 atan2(Q,I)
   *  freq=信号频率, sampleRate=采样率, buffer=输入数据块数组, startSample=起始采样点
   *  totalLen=总采样数, settleCount=稳定期（跳过）, measureCount=测量窗长 */
  _measurePhase(freq, sampleRate, buffer, startSample, totalLen, settleCount, measureCount) {
    const bufBeforeStart = startSample;
    const samplesAfterStart = totalLen - bufBeforeStart;
    if (samplesAfterStart < settleCount + 10) return null;

    const measureStart = bufBeforeStart + settleCount;
    const available = totalLen - measureStart;
    const take = Math.min(available, measureCount);
    const omega = 2 * Math.PI * freq / sampleRate;

    let sumI = 0, sumQ = 0, count = 0;
    let cursor = 0;
    for (let i = 0; i < buffer.length; i++) {
      const chunk = buffer[i];
      const chunkStart = cursor;
      const chunkEnd = cursor + chunk.length;
      cursor = chunkEnd;

      if (chunkEnd <= measureStart) continue;
      if (chunkStart >= measureStart + take) break;

      const localStart = Math.max(0, measureStart - chunkStart);
      const localEnd = Math.min(chunk.length, measureStart + take - chunkStart);
      for (let j = localStart; j < localEnd; j++) {
        const t = (measureStart + count) * omega;
        sumI += chunk[j] * Math.cos(t);
        sumQ += chunk[j] * Math.sin(t);
        count++;
      }
    }
    if (count < 10) return null;
    return Math.atan2(sumQ, sumI) * 180 / Math.PI;
  }

  abortSweep() {
    this._sweepRunning = false;
    this._isRecording = false;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  close() {
    this.stopNoise();
    this.abortSweep();
    this.stopMic();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// ========================================================================
//  PEQManager — 管理参数均衡器
// ========================================================================
class PEQManager {
  constructor() {
    this.list = []; // {id, freq, gain, Q}
    this._nextId = 1;
    this._onChange = null;
  }

  onChange(cb) { this._onChange = cb; }

  add(freq = 1000, gain = 0, Q = 1.0, type = 'PK') {
    const peq = { id: this._nextId++, freq, gain, Q, type };
    this.list.push(peq);
    this._notify();
    return peq;
  }

  remove(id) {
    this.list = this.list.filter(p => p.id !== id);
    this._notify();
  }

  update(id, props) {
    const peq = this.list.find(p => p.id === id);
    if (!peq) return;
    Object.assign(peq, props);
    this._notify();
  }

  /** 清除所有 PEQ */
  clear() {
    this.list = [];
    this._notify();
  }

  /** 触发变更回调（通知图表重绘等） */
  _notify() {
    if (this._onChange) this._onChange(this.list);
  }

  /** Total gain (dB) at given frequency for all PEQ bands (PK/LSC/HSC) */
  getGainAt(freq, sampleRate = 48000) {
    let totalDB = 0;
    for (const peq of this.list) {
      const type = peq.type === 'LSC' ? AE.LSC : (peq.type === 'HSC' ? AE.HSC : AE.PK);
      totalDB += _filterGainAt(type, peq.freq, peq.gain, peq.Q, freq, sampleRate);
    }
    return totalDB;
  }

  /** 获取所有 PEQ 在多个频率点上的增益数组 */
  getResponse(freqs, sampleRate = 48000) {
    return freqs.map(f => this.getGainAt(f, sampleRate));
  }

  /** 获取 PEQ 组合在频响上的校正结果 */
  applyCorrection(originalFreqs, originalDB, sampleRate = 48000) {
    const peqGains = this.getResponse(originalFreqs, sampleRate);
    return originalDB.map((db, i) => db + peqGains[i]);
  }
}

function updateAutoPeqTarget() {
  if (!freqData || freqData.length < 5) return;
  const fLow = parseFloat(document.getElementById('autoPeqFreqLow').value) || 50;
  const fHigh = parseFloat(document.getElementById('autoPeqFreqHigh').value) || 16000;
  const vals = [];
  for (const d of freqData) {
    if (d.freq >= fLow && d.freq <= fHigh) vals.push(d.dB_norm ?? d.dB);
  }
  vals.sort((a, b) => a - b);
  const target = vals.length > 0 ? vals[Math.floor(vals.length / 2)] : 0;
  document.getElementById('autoPeqTarget').value = Math.round(target * 10) / 10;
}

// ========================================================================
//  自动 PEQ (autoeq-c 算法移植) — 基于梯度优化的多滤波器联合拟合法
//  流程：Preprocessing(残差/平滑/去均值) → Sequential initialization → AdaBelief 联合优化
// ========================================================================
// ========================================================================
// ========================================================================
//  autoeq-c 核心算法（JavaScript 移植）
//  原项目：https://github.com/peqdb/autoeq-c
//  Replaces the original greedy search + grid search with joint gradient optimization (AdaBelief)
//  Supports arbitrary grid size (auto-adapts to measurement data)
// ========================================================================
//  autoeq-c 核心算法 — 辅助函数
// ========================================================================

// ========================================================================
// ========================================================================
class ChartRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._freqData = null; // [{freq, dB_norm}]
    this._peqManager = null;
    this._dpr = window.devicePixelRatio || 1;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    // 监听单/双栏布局断点，确保切换时 canvas 正确缩放
    const mq = window.matchMedia('(max-width: 900px)');
    mq.addEventListener('change', () => {
      requestAnimationFrame(() => this.resize());
    });
  }

  resize() {
    // 重新读取 DPR 以支持浏览器 zoom 缩放
    this._dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = Math.max(260, w * 0.45);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w * this._dpr;
    this.canvas.height = h * this._dpr;
    this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
    this._w = w;
    this._h = h;
    this.draw();
  }

  setFreqData(data) {
    this._freqData = data;
    this.draw();
  }

  setPEQManager(mgr) {
    this._peqManager = mgr;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const w = this._w;
    const h = this._h;
    if (!w || !h) return;

    ctx.clearRect(0, 0, w, h);

    // Grid
    this._drawGrid(ctx, w, h);

    const data = this._freqData;
    if (!data || data.length < 3) {
      this._drawPlaceholder(ctx, w, h);
      return;
    }

    const margin = { top: 18, bottom: 30, left: 50, right: 64 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const freqs = data.map(d => d.freq);
    const rawDB = data.map(d => d.dB_norm);
    const rawPhase = data.map(d => d.phase);
    const hasPhase = rawPhase && rawPhase.some(p => p != null && !isNaN(p));

    // === Dual Y-axis range calculation ===
    let correctedDB = null;
    let peqGains = null;
    if (this._peqManager && this._peqManager.list.length > 0) {
      peqGains = this._peqManager.getResponse(freqs, 48000);
      correctedDB = rawDB.map((db, i) => db + peqGains[i]);
    }

    // Left axis: FR data centered on data range
    let leftVals = [...rawDB];
    if (correctedDB) leftVals = leftVals.concat(correctedDB);
    const lDataMin = Math.min(...leftVals);
    const lDataMax = Math.max(...leftVals);
    let lRange = lDataMax - lDataMin;
    if (lRange < 6) lRange = 6;
    const lCenter = (lDataMin + lDataMax) / 2;
    const lHalf = lRange * 0.75;
    const lMin = lCenter - lHalf;
    const lMax = lCenter + lHalf;

    // Right axis: PEQ data centered on 0dB
    let rightMaxAbs = 5;
    if (peqGains) rightMaxAbs = Math.max(...peqGains.map(v => Math.abs(v)), 5);
    const rightPad = Math.max(3, rightMaxAbs * 0.2);
    const rMin = -(rightMaxAbs + rightPad);
    const rMax = rightMaxAbs + rightPad;

    document.getElementById('yRangeLabel').textContent =
      `L ${lMin.toFixed(0)}~${lMax.toFixed(0)}  R ${rMin.toFixed(0)}~${rMax.toFixed(0)} dB` +
      (hasPhase ? ' · Phase ✓' : '');

    // Axes (双Y + 精细X)
    this._drawAxes(ctx, margin, w, h, plotW, plotH, freqs, lMin, lMax, rMin, rMax);

    const logLow = Math.log(freqs[0]);
    const logHigh = Math.log(freqs[freqs.length - 1]);
    const xScale = (f) => {
      const p = (Math.log(f) - logLow) / (logHigh - logLow);
      return margin.left + p * plotW;
    };
    const yScaleL = (db) => margin.top + plotH - ((db - lMin) / (lMax - lMin)) * plotH;
    const yScaleR = (db) => margin.top + plotH - ((db - rMin) / (rMax - rMin)) * plotH;

    // === Draw original frequency response (左轴) ===
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = xScale(freqs[i]);
      const y = yScaleL(rawDB[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xScale(freqs[0]), margin.top + plotH);
    for (let i = 0; i < data.length; i++) {
      ctx.lineTo(xScale(freqs[i]), yScaleL(rawDB[i]));
    }
    ctx.lineTo(xScale(freqs[freqs.length - 1]), margin.top + plotH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.fill();

    // === Draw PEQ curve (右轴) ===
    if (peqGains) {
      ctx.beginPath();
      for (let i = 0; i < freqs.length; i++) {
        const x = xScale(freqs[i]);
        const y = yScaleR(peqGains[i]);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#da3633';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // === Draw corrected response (左轴) ===
    if (correctedDB) {
      ctx.beginPath();
      for (let i = 0; i < correctedDB.length; i++) {
        const x = xScale(freqs[i]);
        const y = yScaleL(correctedDB[i]);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#3fb950';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // === Draw PEQ markers at bottom ===
    if (this._peqManager && this._peqManager.list.length > 0) {
      for (const peq of this._peqManager.list) {
        if (peq.freq < freqs[0] || peq.freq > freqs[freqs.length - 1]) continue;
        const x = xScale(peq.freq);
        ctx.beginPath();
        ctx.arc(x, margin.top + plotH + 8, 4, 0, Math.PI * 2);
        ctx.fillStyle = peq.gain >= 0 ? '#da3633' : '#3b82f6';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, margin.top + plotH + 4);
        ctx.lineTo(x, margin.top + plotH + 12);
        ctx.strokeStyle = '#30363d';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // === Draw phase curve (深灰，右轴 -360~360) ===
    if (rawPhase) {
      const pMin = -360, pMax = 360;
      const yScaleP = (deg) => margin.top + plotH - ((deg - pMin) / (pMax - pMin)) * plotH;
      ctx.beginPath();
      let started = false;
      let hasAny = false;
      for (let i = 0; i < data.length; i++) {
        if (rawPhase[i] == null || isNaN(rawPhase[i])) continue;
        hasAny = true;
        const x = xScale(freqs[i]);
        const y = yScaleP(rawPhase[i]);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      if (hasAny) {
        ctx.strokeStyle = 'rgba(139, 148, 158, 1)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  _drawGrid(ctx, w, h) {
    const steps = 10;
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= steps; i++) {
      const y = (h / steps) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  _drawAxes(ctx, margin, w, h, plotW, plotH, freqs, lMin, lMax, rMin, rMax) {
    const logLow = Math.log(freqs[0]);
    const logHigh = Math.log(freqs[freqs.length - 1]);
    const xPos = (f) => {
      const p = (Math.log(f) - logLow) / (logHigh - logLow);
      return margin.left + p * plotW;
    };

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'center';

    // ---- X axis 精细频率标注 ----
    // 生成候选标注点
    const candidates = [];
    for (let f = 10; f <= 100; f += 10) candidates.push(f);
    for (let f = 100; f <= 1000; f += 100) candidates.push(f);
    for (let f = 1000; f <= 10000; f += 1000) candidates.push(f);
    for (let f = 10000; f <= 20000; f += 2000) candidates.push(f);
    // 去重 + 过滤范围
    const fMin = freqs[0], fMax = freqs[freqs.length - 1];
    const unique = [...new Set(candidates)].filter(f => f >= fMin && f <= fMax);
    // 按像素位置去重叠（至少间隔 35px）
    const labels = [];
    let lastX = -Infinity;
    for (const f of unique) {
      const x = xPos(f);
      if (x - lastX >= 35) { labels.push(f); lastX = x; }
    }

    for (const f of labels) {
      const x = xPos(f);
      ctx.fillText(f >= 1000 ? `${(f/1000).toFixed(f%1000===0?0:1)}k` : `${f}`, x, h - 8);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + plotH);
      ctx.strokeStyle = '#1c2128';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // ---- 左 Y 轴 (频响) ----
    ctx.textAlign = 'right';
    ctx.fillStyle = '#58a6ff';
    ctx.font = '9px -apple-system, sans-serif';
    const numYL = 6;
    for (let i = 0; i <= numYL; i++) {
      const db = lMin + (lMax - lMin) * i / numYL;
      const y = margin.top + plotH - (i / numYL) * plotH;
      ctx.fillText(`${db.toFixed(1)}`, margin.left - 6, y + 3);
      // 网格线（基于左轴）
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.strokeStyle = i === Math.round(numYL / 2) ? '#30363d' : '#1c2128';
      ctx.lineWidth = i === Math.round(numYL / 2) ? 1 : 0.5;
      ctx.stroke();
    }
    // 左轴标签
    ctx.save();
    ctx.translate(10, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#58a6ff';
    ctx.font = '9px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(typeof tr !== 'undefined' ? tr('axisLeft') : '频响 dB', 0, 0);
    ctx.restore();

    // ---- 右 Y 轴 (PEQ) ----
    ctx.textAlign = 'left';
    ctx.fillStyle = '#da3633';
    ctx.font = '9px -apple-system, sans-serif';
    const numYR = 6;
    for (let i = 0; i <= numYR; i++) {
      const db = rMin + (rMax - rMin) * i / numYR;
      const y = margin.top + plotH - (i / numYR) * plotH;
      ctx.fillText(`${db.toFixed(1)}`, margin.left + plotW + 6, y + 3);
    }
    // 右轴标签
    ctx.save();
    ctx.translate(w - 8, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#da3633';
    ctx.font = '9px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(typeof tr !== 'undefined' ? tr('axisRight') : 'PEQ dB', 0, 0);
    ctx.restore();

    // ---- 第三右 Y 轴 (Phase) ----
    ctx.textAlign = 'left';
    ctx.fillStyle = '#6e7681';
    ctx.font = '9px -apple-system, sans-serif';
    const numYP = 6;
    const pMin = -360, pMax = 360;
    for (let i = 0; i <= numYP; i++) {
      const deg = pMin + (pMax - pMin) * i / numYP;
      const y = margin.top + plotH - (i / numYP) * plotH;
      ctx.fillText(`${deg}°`, margin.left + plotW + 30, y + 3);
    }
    // 相位轴标签
    ctx.save();
    ctx.translate(w - 3, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#6e7681';
    ctx.font = '9px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Phase °', 0, 0);
    ctx.restore();

    // Hz 单位
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6e7681';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillText(typeof tr !== 'undefined' ? tr('hz') : 'Hz', w / 2, h - 2);
  }

  _drawPlaceholder(ctx, w, h) {
    const p1 = typeof tr !== 'undefined' ? tr('placeholder1') : '执行Sweep measurement以获取频率响应';
    const p2 = typeof tr !== 'undefined' ? tr('placeholder2') : '点击左侧「开始扫频」按钮';
    ctx.fillStyle = '#30363d';
    ctx.font = '14px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p1, w / 2, h / 2 - 6);
    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillStyle = '#484f58';
    ctx.fillText(p2, w / 2, h / 2 + 18);
  }
}

// ========================================================================
//  Main App
// ========================================================================
const audio = new AudioEngine();
const peqMgr = new PEQManager();
let chart = null;
let freqData = null; // saved measurement

// ========================================================================
//  Global DOM references — fetch once, avoid repeated queries
// ========================================================================
// ---- DOM refs ----
const $inDevice = document.getElementById('inDevice');
const $outDevice = document.getElementById('outDevice');
const $inChannel = document.getElementById('inChannel');
const $outChannel = document.getElementById('outChannel');
const $audioStatus = document.getElementById('audioStatus');
const $playNoise = document.getElementById('playNoiseBtn');
const $stopNoise = document.getElementById('stopNoiseBtn');

const $inGain = document.getElementById('inGain');
const $inGainVal = document.getElementById('inGainVal');
const $autoLevelBtn = document.getElementById('autoLevelBtn');
const $startSweep = document.getElementById('startSweepBtn');
const $stopSweep = document.getElementById('stopSweepBtn');
const $sweepFreqLow = document.getElementById('sweepFreqLow');
const $sweepFreqHigh = document.getElementById('sweepFreqHigh');
const $sweepDuration = document.getElementById('sweepDuration');
const $measureStatus = document.getElementById('measureStatus');
const $statusDetail = document.getElementById('statusDetail');
const $addPeqBtn = document.getElementById('addPeqBtn');
const $clearPeqBtn = document.getElementById('clearPeqBtn');
const $peqListEl = document.getElementById('peqList');
const $peqEmpty = document.getElementById('peqEmpty');
const $peqCount = document.getElementById('peqCount');
const $refreshDevices = document.getElementById('refreshDevices');
const $exportBtn = document.getElementById('exportBtn');
const $importBtn = document.getElementById('importBtn');
const $importFile = document.getElementById('importFile');
const $dataInfo = document.getElementById('dataInfo');
const $meterFill = document.getElementById('meterFill');
const $levelDB = document.getElementById('levelDB');
const $levelLabel = document.getElementById('levelLabel');

// ---- 输入电平表 (requestAnimationFrame 驱动) ----
let _meterRaf = null;
let _noiseLevelTimer = null;
function updateLevelMeter() {
  _meterRaf = requestAnimationFrame(updateLevelMeter);
  const analyser = audio.micAnalyser;
  if (!analyser) {
    $meterFill.style.width = '0%';
    $levelDB.textContent = '—∞ dB';
    return;
  }
  const buf = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buf);
  // RMS
  let sumSq = 0;
  for (let i = 0; i < buf.length; i++) sumSq += buf[i] * buf[i];
  const rms = Math.sqrt(sumSq / buf.length);
  // dBFS (RMS), reference 1.0 = 0 dB
  const dB = rms > 1e-9 ? 20 * Math.log10(rms) : -100;
  // 显示范围 -70 ~ 0 dB，信号再弱也保留 1% 宽度让条可见
  const clamped = Math.max(-70, Math.min(0, dB));
  const pct = ((clamped + 70) / 70) * 99 + 1;
  $meterFill.style.width = pct + '%';
  if (dB <= -85) {
    $levelDB.textContent = '—∞ dB';
  } else if (dB <= -70) {
    $levelDB.textContent = `< -70 dB`;
  } else {
    $levelDB.textContent = `${dB.toFixed(1)} dB`;
  }
}

function startLevelMeter() {
  if (_meterRaf) cancelAnimationFrame(_meterRaf);
  $levelLabel.textContent = tr('micReady');
  updateLevelMeter();
}
function stopLevelMeter() {
  if (_meterRaf) { cancelAnimationFrame(_meterRaf); _meterRaf = null; }
  $meterFill.style.width = '0%';
  $levelDB.textContent = '—∞ dB';
  $levelLabel.textContent = '—';
}

/** 白噪声播放时每秒读取输入电平，更新目标增益 */
function startNoiseLevelMonitor() {
  stopNoiseLevelMonitor();
  const $target = document.getElementById('autoPeqTarget');
  _noiseLevelTimer = setInterval(() => {
    const analyser = audio.micAnalyser;
    if (!analyser) return;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    let sumSq = 0;
    for (let i = 0; i < buf.length; i++) sumSq += buf[i] * buf[i];
    const rms = Math.sqrt(sumSq / buf.length);
    // dBFS (RMS), 参考 1.0 = 0 dB
    const dB = rms > 1e-9 ? 20 * Math.log10(rms) : -100;
    // 钳位到 -60 ~ 0 范围，保留一位小数
    const clamped = Math.max(-60, Math.min(0, dB));
    $target.value = Math.round(clamped * 10) / 10;
  }, 1000);
}
function stopNoiseLevelMonitor() {
  if (_noiseLevelTimer) {
    clearInterval(_noiseLevelTimer);
    _noiseLevelTimer = null;
  }
}

/**
 * Auto input level adjustment —— 播放白噪声并调整 micGain，使 RMS 电平接近 -15 dB
 * 调整过程中输入增益滑杆不可用，调整完成后恢复
 */
function autoAdjustInputLevel() {
  // 如果扫频正在运行，不执行
  if (audio._sweepRunning) return;

  if (!audio.ctx || audio.ctx.state === 'closed') {
    ensureAudioReady().then(ok => { if (ok) _doAutoAdjust(); });
    return;
  }
  if (audio.ctx.state === 'suspended') {
    audio.ctx.resume().then(() => _doAutoAdjust());
    return;
  }
  _doAutoAdjust();

  function _doAutoAdjust() {
    // 确保白噪声已播放
    const noiseWasPlaying = !!audio._noiseSource;
    if (!noiseWasPlaying) {
      audio.startNoise(0);
      startLevelMeter();
      startNoiseLevelMonitor();
      lockDevices(true);
      $playNoise.disabled = true;
      $stopNoise.disabled = false;
      $startSweep.disabled = true;
    }

    // 禁用滑杆和按钮
    $inGain.disabled = true;
    $autoLevelBtn.disabled = true;
    const origBtnText = $autoLevelBtn.textContent;

    const TARGET_DB = -20;
    const TOLERANCE = 2;        // ±2 dB 视为达标
    const INTERVAL_MS = 200;    // 每 200ms 采样一次
    const MAX_ITERATIONS = 30;  // 最多调整 6 秒

    let iteration = 0;
    let stableCount = 0;
    let timer = null;

    function stopAdjust() {
      if (timer) clearInterval(timer);
      $inGain.disabled = false;
      // 只有白噪声还在播放时才启用自动调整按钮
      $autoLevelBtn.disabled = !audio._noiseSource;
      $autoLevelBtn.textContent = origBtnText;
    }

    timer = setInterval(() => {
      const analyser = audio.micAnalyser;
      if (!analyser) { stopAdjust(); return; }

      // 如果白噪声已停止（用户手动点击了停止），也停止调整
      if (!audio._noiseSource) { stopAdjust(); return; }

      // 读取当前 RMS 电平
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);
      let sumSq = 0;
      for (let i = 0; i < buf.length; i++) sumSq += buf[i] * buf[i];
      const rms = Math.sqrt(sumSq / buf.length);
      const currentDB = rms > 1e-9 ? 20 * Math.log10(rms) : -100;

      // 计算与目标电平的差值
      const deltaDB = TARGET_DB - currentDB;

      // 检查是否达标（连续 3 次稳定在容差内）
      if (Math.abs(deltaDB) <= TOLERANCE) {
        stableCount++;
        if (stableCount >= 3) { stopAdjust(); return; }
        iteration++;
        if (iteration >= MAX_ITERATIONS) { stopAdjust(); return; }
        return;  // 未连续达标则继续观察
      }
      stableCount = 0;  // 未达标，重置稳定计数

      // 计算并应用新增益
      let newGainDB = currentDB < -60 ? Math.min(36, parseFloat($inGain.value) + 12) : parseFloat($inGain.value) + deltaDB;
      newGainDB = Math.round(Math.max(-12, Math.min(36, newGainDB)));

      audio.setInGain(newGainDB);
      $inGain.value = newGainDB;
      $inGainVal.textContent = newGainDB;

      iteration++;
      if (iteration >= MAX_ITERATIONS) { stopAdjust(); }
    }, INTERVAL_MS);
  }
}

// ---- 可拖动分隔条 ----
(function initResizer() {
  const resizer = document.getElementById('resizer');
  const leftCol = document.querySelector('.left-col');
  let startX = 0, startW = 0;

  function onDrag(e) {
    const dx = e.clientX - startX;
    const newW = Math.max(200, Math.min(500, startW + dx));
    leftCol.style.width = newW + 'px';
  }

  function stopDrag() {
    resizer.classList.remove('resizing');
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // 触发 canvas 重绘
    if (chart) setTimeout(() => chart.resize(), 50);
  }

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startW = leftCol.getBoundingClientRect().width;
    resizer.classList.add('resizing');
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });
})();
// ---- Init ----
async function init() {
  chart = new ChartRenderer(document.getElementById('freqChart'));
  peqMgr.onChange(() => {
    renderPEQList();
    chart.setPEQManager(peqMgr);
    if (freqData) chart.setFreqData(freqData);
  });

  // Pre-request mic permission so enumerateDevices can show real device names
  // Note: Chrome blocks this on file://, use http://localhost
  try {
    const permStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    window._permStream = permStream;
  } catch (e) {
    // Permission denied or file://, continue silently
  }

  // Enumerate devices (with real names if permission was granted)
  await enumerateDevices();

  setupEventListeners();
  lockDevices(false);
  // 应用浏览器语言
  const browserLang = detectBrowserLang();
  document.getElementById('langSelect').value = browserLang;
  applyLanguage(browserLang);
  setStatus('idle', tr('ready'), tr('waiting'));

  // 尝试初始化音频（浏览器可能因用户手势要求阻止自动启动）
  // 用户点击任意按钮时会自动初始化
}

// ---- Device enumeration ----
async function enumerateDevices() {
  // 先设置默认选项，确保枚举失败时两个选择框也不为空
  $inDevice.innerHTML = '<option value="">' + tr('defaultDev') + '</option>';
  $outDevice.innerHTML = '<option value="default" selected>' + tr('defaultDev') + '</option>';
  $outDevice.disabled = false;
  $inDevice.disabled = false;

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter(d => d.kind === 'audioinput');
    const audioOutputs = devices.filter(d => d.kind === 'audiooutput');

    // 输入设备
    if (audioInputs.length > 0) {
      $inDevice.innerHTML = audioInputs.map((d, i) =>
        `<option value="${d.deviceId}">${d.label || trf('micLabel', i+1)}</option>`
      ).join('') + '<option value="">' + tr('defaultDev') + '</option>';
    } else {
      $inDevice.innerHTML = '<option value="">' + tr('defaultDev') + '</option>';
    }

    // 输出设备：至少提供一个默认选项
    let outHtml = '';
    if (audioOutputs.length > 0) {
      outHtml = audioOutputs.map((d, i) =>
        `<option value="${d.deviceId}">${d.label || trf('speakerLabel', i+1)}</option>`
      ).join('');
    }
    outHtml += '<option value="default" selected>' + tr('defaultDev') + '</option>';
    $outDevice.innerHTML = outHtml;
  } catch (e) {
    console.warn('设备枚举失败:', e);
  }
  // 检测输出设备切换能力，不支持则隐藏输出设备选择区域
  const canSwitch = AudioEngine.supportsOutputSwitch();
  const outRow = document.getElementById('outDeviceRow');
  if (outRow) outRow.style.display = canSwitch ? '' : 'none';
}

// ---- Audio initialization & mic start ----
async function ensureAudioReady() {
  await audio.init();
  const deviceId = $inDevice.value || undefined;
  try {
    await audio.startMic(deviceId);
    audio.setOutVolume(0);
    audio.setInGain(parseFloat($inGain.value));
    // 重建声道下拉框
    rebuildChannelOptions('inChannel', audio._inChannelCount || 2, false);
    rebuildChannelOptions('outChannel', audio._outChCount || 2, true);
    audio.setOutputChannel(document.getElementById('outChannel').value);
    $audioStatus.className = 'status-badge status-done';
    $audioStatus.textContent = tr('micReady');
    startLevelMeter();
    return true;
  } catch (e) {
    console.error('麦克风启动失败:', e);
    stopLevelMeter();
    $audioStatus.className = 'status-badge status-error';
    $audioStatus.textContent = tr('micErr');
    setStatus('error', tr('micErr'), tr('micFail') + ': ' + e.message);
    return false;
  }
}

function setStatus(type, badge, detail) {
  $measureStatus.className = `status-badge status-${type}`;
  $measureStatus.textContent = badge;
  $statusDetail.textContent = detail;
}

/** Lock/unlock device and channel controls during playback */
function lockDevices(locked) {
  $inDevice.disabled = !!locked;
  $inChannel.disabled = !!locked;
  $outChannel.disabled = !!locked;
  $refreshDevices.disabled = !!locked;
  $outDevice.disabled = !!locked;
  if (!locked) {
    $inGain.disabled = false;
  }
}

/** 弹出确认对话框，返回 Promise<boolean> */
function showConfirmDialog(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn btn-secondary btn-sm confirm-cancel-btn">${tr('confirmCancel')}</button>
          <button class="btn btn-primary btn-sm confirm-ok-btn">${tr('confirmOk')}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const okBtn = overlay.querySelector('.confirm-ok-btn');
    const cancelBtn = overlay.querySelector('.confirm-cancel-btn');

    const close = (result) => {
      overlay.remove();
      resolve(result);
    };

    okBtn.addEventListener('click', () => close(true));
    cancelBtn.addEventListener('click', () => close(false));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
    // ESC 键关闭
    const onKey = (e) => { if (e.key === 'Escape') { close(false); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
  });
}

// ---- Event Listeners ----
function setupEventListeners() {
  // Volume & Gain

  $inGain.addEventListener('input', () => {
    const v = parseFloat($inGain.value);
    $inGainVal.textContent = v;
    audio.setInGain(v);
  });

  // Noise — 播放时禁用扫频按钮（mutual exclusion），开启电平表
  $playNoise.addEventListener('click', async () => {
    if (!audio.ctx || audio.ctx.state === 'closed') {
      const ok = await ensureAudioReady();
      if (!ok) return;
    }
    if (audio.ctx.state === 'suspended') await audio.ctx.resume();
    audio.startNoise(0);
    startLevelMeter();
    startNoiseLevelMonitor();
    lockDevices(true);
    $playNoise.disabled = true;
    $stopNoise.disabled = false;
    $autoLevelBtn.disabled = false;    // 白噪声播放时可自动调整
    $startSweep.disabled = true;       // mutual exclusion
  });
  $stopNoise.addEventListener('click', () => {
    audio.stopNoise();
    stopLevelMeter();
    stopNoiseLevelMonitor();
    lockDevices(false);
    $playNoise.disabled = false;
    $stopNoise.disabled = true;
    $autoLevelBtn.disabled = true;     // 白噪声停止后不可自动调整
    $startSweep.disabled = false;      // 恢复
  });

  // Auto Level — Auto input level adjustment
  $autoLevelBtn.addEventListener('click', () => {
    autoAdjustInputLevel();
  });

  // Sweep — 开始时禁用白噪声按钮（mutual exclusion），开启电平表
  $startSweep.addEventListener('click', async () => {
    if (!audio.ctx || audio.ctx.state === 'closed') {
      const ok = await ensureAudioReady();
      if (!ok) return;
    }
    if (audio.ctx.state === 'suspended') await audio.ctx.resume();
    // 停止白噪声（如有）
    audio.stopNoise();
    stopLevelMeter();
    stopNoiseLevelMonitor();
    $playNoise.disabled = true;        // mutual exclusion
    $stopNoise.disabled = true;

    startLevelMeter();
    lockDevices(true);
    $inGain.disabled = true;
    $autoLevelBtn.disabled = true;

    const lo = parseFloat($sweepFreqLow.value) || 20;
    const hi = parseFloat($sweepFreqHigh.value) || 20000;
    const totalDur = parseFloat($sweepDuration.value) || 5;
    const inChan = $inChannel.value;

    $startSweep.disabled = true;
    $stopSweep.disabled = false;
    setStatus('active', tr('measuring'), tr('preparing'));

    audio.runSweepMeasure(
      lo, hi, totalDur,
      // onProgress
      (phase, total, msg) => {
        if (typeof msg === 'string') {
          setStatus('active', tr('measuring'), msg);
        } else {
          setStatus('active', tr('measuring'), trf('pointFmt', phase, total, msg));
        }
      },
      // onDone
      (results, aborted) => {
        $startSweep.disabled = false;
        $stopSweep.disabled = true;
        $playNoise.disabled = false;
        stopLevelMeter();
        lockDevices(false);
        if (aborted) {
        setStatus('idle', tr('stopped'), tr('aborted'));
          return;
        }
        if (!results || results.length < 3) {
          setStatus('error', tr('failed'), tr('noData'));
          stopLevelMeter();
          lockDevices(false);
          return;
        }
        freqData = results;
        chart.setFreqData(results);
        chart.setPEQManager(peqMgr);
        updateAutoPeqTarget();
        setStatus('done', tr('done'), trf('doneFmt', results.length, lo, hi));
        $dataInfo.textContent = trf('dataInfo', results.length, lo, hi, new Date().toLocaleTimeString());
        document.getElementById('yRangeLabel').textContent = '';
        stopLevelMeter();
        lockDevices(false);
      },
      // onError
      (err) => {
        $startSweep.disabled = false;
        $stopSweep.disabled = true;
        $playNoise.disabled = false;
        stopLevelMeter();
        lockDevices(false);
        setStatus('error', tr('error'), err);
      },
      inChan
    );
  });

  $stopSweep.addEventListener('click', () => {
    audio.abortSweep();
    $startSweep.disabled = false;
    $stopSweep.disabled = true;
    $playNoise.disabled = false;        // 恢复
    stopLevelMeter();
    lockDevices(false);
    setStatus('idle', tr('stopped'), tr('aborted'));
  });

  // Refresh devices
  $refreshDevices.addEventListener('click', enumerateDevices);

  // 输入设备切换
  $inDevice.addEventListener('change', async () => {
    if (!audio.micStream) return; // 未初始化，等按钮点击时自动用新设备
    // 重新启动麦克风
    const ok = await ensureAudioReady();
    stopLevelMeter();  // 切换设备不启动电平表
    if (ok && chart._freqData) chart.draw();
  });

  // 输出设备切换（仅 Chrome）
  const $outDev = document.getElementById('outDevice');
  $outDev.addEventListener('change', async () => {
    if (!audio.ctx) {
      $measureStatus.textContent = tr('startAudioFirst');
      return;
    }
    const ok = await audio.setOutputDevice($outDev.value);
    if (!ok) {
      $measureStatus.textContent = tr('outDevFail');
    }
  });

  // 输出声道切换 — takes effect immediately
  const $outChan = document.getElementById('outChannel');
  $outChan.addEventListener('change', () => {
    audio.setOutputChannel($outChan.value);
  });

  // PEQ
  $addPeqBtn.addEventListener('click', () => {
    peqMgr.add(1000, 2, 1.0);
  });
  $clearPeqBtn.addEventListener('click', () => {
    peqMgr.clear();
  });

  // 自动 PEQ
  document.getElementById('autoPeqBtn').addEventListener('click', async () => {
    if (!freqData || freqData.length < 5) {
      setStatus('error', tr('error'), tr('noSweepData'));
      return;
    }
    // 已有 PEQ 配置时弹出确认对话框
    if (peqMgr && peqMgr.list.length > 0) {
      const confirmed = await showConfirmDialog(tr('confirmClearPeq'));
      if (!confirmed) return;
    }
    const count = parseInt(document.getElementById('autoPeqCount').value) || 5;
    const fLow = parseFloat(document.getElementById('autoPeqFreqLow').value) || 50;
    const fHigh = parseFloat(document.getElementById('autoPeqFreqHigh').value) || 16000;
    const maxGain = parseFloat(document.getElementById('autoPeqMaxGain').value) || 20;
    
    // 锁定控件
    const autoBtn = document.getElementById('autoPeqBtn');
    autoBtn.disabled = true;
    lockDevices(true);
    $playNoise.disabled = true;
    $stopNoise.disabled = true;
    $startSweep.disabled = true;
    $stopSweep.disabled = true;
    $addPeqBtn.disabled = true;
    $clearPeqBtn.disabled = true;
    document.querySelectorAll('#peqList input').forEach(el => el.disabled = true);
    setStatus('active', tr('processing'), tr('processing'));
    
    // 执行计算
    const tiltDB = parseFloat(document.getElementById('autoPeqTilt').value) || 0;
    const useShelving = document.getElementById('autoPeqShelving').checked;
    const peqs = generateAutoPEQ(freqData, count, fLow, fHigh, maxGain, tiltDB, useShelving);
    
    // 恢复控件
    autoBtn.disabled = false;
    lockDevices(false);
    $playNoise.disabled = false;
    $stopNoise.disabled = true;
    $startSweep.disabled = false;
    $stopSweep.disabled = true;
    $addPeqBtn.disabled = false;
    $clearPeqBtn.disabled = false;
    document.querySelectorAll('#peqList input').forEach(el => el.disabled = false);
    
    if (peqs.length === 0) {
      setStatus('error', tr('error'), tr('peqGenFailed'));
      return;
    }
    
    peqMgr.clear();
    for (const p of peqs) {
      peqMgr.add(p.freq, p.gain, p.Q, p.type || 'PK');
    }
    setStatus('done', tr('done'), trf('peqGenDone', peqs.length));
  });

  // Import/Export
  $exportBtn.addEventListener('click', exportData);
  document.getElementById('exportRewBtn').addEventListener('click', exportRew);
  $importBtn.addEventListener('click', () => $importFile.click());
  $importFile.addEventListener('change', importData);

  // 语言切换
  document.getElementById('langSelect').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
}

// ---- PEQ List Rendering ----
function renderPEQList() {
  const list = peqMgr.list;
  $peqCount.textContent = trf('peqCount', list.length);

  if (list.length === 0) {
    $peqListEl.innerHTML = '';
    $peqEmpty.style.display = 'block';
    return;
  }
  $peqEmpty.style.display = 'none';

  $peqListEl.innerHTML = list.map(peq => `
    <div class="peq-item" data-id="${peq.id}">
      <div class="param-group" style="min-width:48px">
        <label>Type</label>
        <select data-param="type" data-id="${peq.id}" style="width:50px;font-size:11px;padding:2px 4px">
          <option value="PK" ${peq.type === 'PK' ? 'selected' : ''}>PK</option>
          <option value="LSC" ${peq.type === 'LSC' ? 'selected' : ''}>LSC</option>
          <option value="HSC" ${peq.type === 'HSC' ? 'selected' : ''}>HSC</option>
        </select>
      </div>
      <div class="param-group">
        <label>${tr('peqFreq')}</label>
        <input type="number" min="20" max="20000" value="${peq.freq}" step="1"
               data-param="freq" data-id="${peq.id}"
               style="width:54px;text-align:center">
        <span style="font-size:10px;color:#8b949e;flex-shrink:0">Hz</span>
      </div>
      <div class="param-group">
        <label>${tr('peqGain')}</label>
        <input type="number" step="0.01" min="-20.0" max="20.0" inputmode="decimal" value="${peq.gain}"
               data-param="gain" data-id="${peq.id}"
               style="width:50px;text-align:center">
        <span style="font-size:10px;color:#8b949e;flex-shrink:0">dB</span>
      </div>
      <div class="param-group">
        <label>Q</label>
        <input type="number" step="any" min="0.01" max="12.0" inputmode="decimal" value="${peq.Q}"
               data-param="Q" data-id="${peq.id}"
               style="width:56px;text-align:center">
      </div>
      <button class="btn btn-danger btn-sm del-peq" data-id="${peq.id}">✕</button>
    </div>
  `).join('');

  // Attach events — 值变化即更新 PEQ
  $peqListEl.querySelectorAll('input[data-param], select[data-param]').forEach(el => {
    // input：边输入边更新数据 + 刷新 chart，但不重建 DOM（避免失焦）
    el.addEventListener('input', (e) => {
      const id = parseInt(el.dataset.id);
      const param = el.dataset.param;
      const val = parseFloat(el.value);
      if (isNaN(val)) return;
      const peq = peqMgr.list.find(p => p.id === id);
      if (peq) {
        peq[param] = val;
        if (chart._freqData) chart.draw();
      }
    });
    // change：失焦时完成完整更新（同步 PEQ 管理器 + 重建列表）
    el.addEventListener('change', (e) => {
      const id = parseInt(el.dataset.id);
      const param = el.dataset.param;
      const val = parseFloat(el.value);
      if (isNaN(val)) return;
      peqMgr.update(id, { [param]: val });
    });
  });
  $peqListEl.querySelectorAll('.del-peq').forEach(el => {
    el.addEventListener('click', () => {
      peqMgr.remove(parseInt(el.dataset.id));
    });
  });
}

// ---- Export / Import ----
function exportData() {
  if (!freqData) {
    alert(tr('noDataExport'));
    return;
  }
  const obj = {
    version: 1,
    exportedAt: new Date().toISOString(),
    measurement: freqData.map(d => ({ freq: +d.freq.toFixed(6), dB: +d.dB_norm.toFixed(4), phase: d.phase != null ? +d.phase.toFixed(4) : null })),
    peq: peqMgr.list.map(p => ({ freq: p.freq, gain: p.gain, Q: p.Q, type: p.type || 'PK' }))
  };
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // 在文件名中加入输入/输出设备和声道信息
  const inDevLabel = ($inDevice.selectedOptions[0]?.textContent || '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_').slice(0, 20);
  const outDevLabel = ($outDevice.selectedOptions[0]?.textContent || '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_').slice(0, 20);
  const inCh = $inChannel.selectedOptions[0]?.textContent || $inChannel.value;
  const outCh = $outChannel.selectedOptions[0]?.textContent || $outChannel.value;
  a.download = `acoustic-${inDevLabel}_${inCh}-${outDevLabel}_${outCh}-${ts()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function ts() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function exportRew() {
  if (!freqData || freqData.length < 5) {
    alert(tr('noDataExport'));
    return;
  }
  const targetSpl = parseFloat(document.getElementById('targetSplInput').value) || 76;
  const targetGain = parseFloat(document.getElementById('autoPeqTarget').value) || 0;
  const tiltDB = parseFloat(document.getElementById('autoPeqTilt').value) || 0;
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
  const lines = [];
  const tiltNote = tiltDB !== 0 ? `, tilt ${tiltDB.toFixed(1)} dB` : '';
  lines.push(`* Exported from Acoustic Measurement Tool at ${dateStr}`);
  lines.push(`* Source: measurement data, target SPL ${targetSpl.toFixed(1)} dB, target gain ${targetGain.toFixed(1)} dB${tiltNote}`);
  lines.push('*');
  lines.push('* Freq(Hz)\tSPL(dB)\tPhase(degrees)');
  for (const d of freqData) {
    const f = d.freq.toFixed(6);
    const spl = (d.dB_norm - targetGain + targetSpl).toFixed(4);
    const phase = d.phase != null ? d.phase.toFixed(4) : '0.0000';
    lines.push(`${f}\t${spl}\t${phase}`);
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // 在文件名中加入输入/输出设备和声道信息
  const inDevLabel = ($inDevice.selectedOptions[0]?.textContent || '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_').slice(0, 20);
  const outDevLabel = ($outDevice.selectedOptions[0]?.textContent || '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_').slice(0, 20);
  const inCh = $inChannel.selectedOptions[0]?.textContent || $inChannel.value;
  const outCh = $outChannel.selectedOptions[0]?.textContent || $outChannel.value;
  a.download = `rew-${inDevLabel}_${inCh}-${outDevLabel}_${outCh}-${ts()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const obj = JSON.parse(ev.target.result);
      if (!obj.measurement || !Array.isArray(obj.measurement)) {
        alert(tr('invalidFile'));
        return;
      }
      // Convert back to full objects with dB_norm
      freqData = obj.measurement.map(d => ({
        freq: d.freq,
        dB: d.dB,
        dB_norm: d.dB,
        rms: Math.pow(10, d.dB / 20),
        phase: d.phase != null ? d.phase : 0
      }));
      chart.setFreqData(freqData);
      chart.setPEQManager(peqMgr);
      updateAutoPeqTarget();

      // 自动设置频率区间：数据覆盖 50-16000 则用默认，否则用数据范围
      const freqs = obj.measurement.map(d => d.freq);
      const minF = Math.min(...freqs);
      const maxF = Math.max(...freqs);
      if (minF <= 50 && maxF >= 16000) {
        document.getElementById('autoPeqFreqLow').value = 50;
        document.getElementById('autoPeqFreqHigh').value = 16000;
      } else {
        document.getElementById('autoPeqFreqLow').value = Math.max(10, Math.round(minF));
        document.getElementById('autoPeqFreqHigh').value = Math.min(24000, Math.round(maxF));
      }

      // Import PEQ too
      peqMgr.clear();
      if (obj.peq && Array.isArray(obj.peq)) {
        for (const p of obj.peq) {
          peqMgr.add(p.freq, p.gain, p.Q, p.type || 'PK');
        }
      }
    setStatus('done', tr('done'), trf('importOk', freqData.length));
      $dataInfo.textContent = trf('importOk', freqData.length) + ' · ' + new Date().toLocaleTimeString();
    } catch (err) {
      alert(tr('importFail') + ': ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
