/***************************************
 * Gmail Cleanup Helper v4.0.0
 * ────────────────────────────────
 * Objetivo:
 * - Varrer o Gmail do mais antigo para o mais novo
 * - Contar mensagens por remetente de forma incremental
 * - Preservar "resolvidos" para sempre
 * - Excluir resolvidos do digest, mas continuar contando
 * - Manter a operação segura: nada é apagado automaticamente
 *
 * Observação importante:
 * - "threads" aqui significa conversas no Gmail.
 * - O ranking principal usa msg_count, porque isso reflete volume real.
 ***************************************/

var CONFIG = {
  SHEET_NAME: "senders",

  // Scan incremental
  SCAN_BATCH_THREADS: 25,
  SCAN_WINDOW_DAYS: 30,
  SCAN_START_DATE: "2004-04-01",
  SCAN_QUERY_EXTRA: 'in:anywhere -in:spam -in:trash',
  MAX_RUNTIME_MS: 3 * 60 * 1000,

  // Digest
  DIGEST_TOP_N: 3,
  CLEAN_INBOX_THRESHOLD: 10,
  DELTA_POINTS_DIVISOR: 25,

  // Triggers
  SCAN_TRIGGER_HOUR: 4,
  DIGEST_TRIGGER_HOUR: 8,
  TIMEZONE: "America/Sao_Paulo"
};

var THEME = {
  bg: "#0f172a",
  page: "#f1f5f9",
  card: "#ffffff",
  border: "#e2e8f0",
  shadow: "0 4px 16px rgba(15,23,42,0.07)",
  text: "#0f172a",
  muted: "#64748b",
  subtle: "#94a3b8",
  primary: "#2563eb",
  primaryText: "#ffffff",
  okBg: "#ecfdf5",
  okText: "#065f46",
  chipBg: "#eef2ff",
  chipText: "#3730a3",
  doneBg: "#16a34a",
  doneText: "#ffffff"
};

/* ═══════════════════════════════════════
   MENU
   ═══════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Gmail Helper")
    .addItem("Setup / preparar tudo", "setup")
    .addSeparator()
    .addItem("Rodar scan agora", "menuRunScan")
    .addItem("Enviar digest agora", "menuSendDigest")
    .addSeparator()
    .addItem("Ver estatísticas", "menuShowStats")
    .addItem("Mover remetente da linha ativa para lixeira", "menuTrashActiveSender")
    .addSeparator()
    .addItem("Resetar scanner (preserva resolvidos)", "resetScan")
    .addItem("Hard reset (apaga tudo)", "hardReset")
    .addSeparator()
    .addItem("Recriar triggers", "createOrReplaceTriggers_")
    .addToUi();
}

function menuRunScan() {
  var ui = SpreadsheetApp.getUi();
  ui.alert("Scan iniciado", "Executando scan incremental. Pode levar alguns minutos.", ui.ButtonSet.OK);
  runScannerBatch();

  var props = PropertiesService.getScriptProperties();
  var batch = props.getProperty("LAST_SCAN_BATCH") || "0";
  var complete = props.getProperty("SCAN_COMPLETE") === "true";
  var windowStart = props.getProperty("SCAN_WINDOW_START") || "";

  ui.alert(
    "Scan finalizado",
    "Processadas neste lote: " + batch + "\n" +
      "Janela atual: " + (windowStart || "não definida") + "\n" +
      "Ciclo completo: " + (complete ? "Sim" : "Ainda não"),
    ui.ButtonSet.OK
  );
}

function menuSendDigest() {
  sendDailyDigest();
  SpreadsheetApp.getUi().alert("Digest enviado", "Verifique sua caixa de entrada.", SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuShowStats() {
  ensureSheet_();
  ensureProperties_();

  var sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert("Estatísticas", "Planilha vazia. Rode o scanner primeiro.", SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  var totalSenders = data.length;
  var totalMsgs = data.reduce(function(sum, r) {
    return sum + Number(r[1] || 0);
  }, 0);

  var resolvedCount = data.filter(function(r) {
    return isResolvedStatus_(r[4]);
  }).length;

  var active = data
    .map(function(r) {
      return {
        sender: String(r[0] || ""),
        msg: Number(r[1] || 0),
        resolved: isResolvedStatus_(r[4])
      };
    })
    .filter(function(x) {
      return x.sender && !x.resolved && x.msg > 0;
    })
    .sort(function(a, b) {
      return b.msg - a.msg;
    });

  var top = active[0] ? (active[0].sender + " (" + active[0].msg + " msgs)") : "nenhum";

  var props = PropertiesService.getScriptProperties();
  var complete = props.getProperty("SCAN_COMPLETE") === "true";
  var lastScanAt = props.getProperty("LAST_SCAN_AT") || "";
  var windowStart = props.getProperty("SCAN_WINDOW_START") || "";
  var pageOffset = props.getProperty("SCAN_PAGE_OFFSET") || "0";

  SpreadsheetApp.getUi().alert(
    "Estatísticas",
    "Remetentes na planilha: " + totalSenders + "\n" +
      "Total msgs (estimado): " + totalMsgs + "\n" +
      "Resolvidos: " + resolvedCount + "\n" +
      "Top atual: " + top + "\n" +
      "Janela do scan: " + (windowStart || "não definida") + "\n" +
      "Offset da página: " + pageOffset + "\n" +
      "Scan completo: " + (complete ? "Sim" : "Não") + "\n" +
      "Último scan: " + (lastScanAt ? lastScanAt : "nunca"),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function menuTrashActiveSender() {
  ensureSheet_();
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  var range = sheet.getActiveRange();

  if (!range) {
    ui.alert("Mover para lixeira", "Selecione uma linha da planilha primeiro.", ui.ButtonSet.OK);
    return;
  }

  var row = range.getRow();
  if (row <= 1) {
    ui.alert("Mover para lixeira", "Selecione uma linha de remetente, não o cabeçalho.", ui.ButtonSet.OK);
    return;
  }

  var sender = String(sheet.getRange(row, 1).getValue() || "").trim();
  if (!sender) {
    ui.alert("Mover para lixeira", "A linha selecionada não tem remetente válido.", ui.ButtonSet.OK);
    return;
  }

  var response = ui.alert(
    "Mover para lixeira",
    "Isso vai mover para a lixeira as conversas encontradas para:\n\n" + sender + "\n\n" +
      "O remetente será pesquisado em All Mail, excluindo spam e lixeira.\n" +
      "Deseja continuar?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  var moved = trashSenderFromRow_(sheet, row);
  ui.alert(
    "Mover para lixeira",
    moved
      ? ("Foram movidas " + moved + " conversas para a lixeira.\n\n" +
         "Se o remetente ainda tiver e-mails novos no futuro, eles continuarão aparecendo no scanner.")
      : "Nenhuma conversa encontrada para esse remetente.",
    ui.ButtonSet.OK
  );
}

function handleSheetEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  if (!sheet || sheet.getName() !== CONFIG.SHEET_NAME) return;

  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (row <= 1 || col !== 6) return;

  var value = String(e.value || "").toUpperCase().trim();
  if (value !== "TRUE") return;

  trashSenderFromRow_(sheet, row);
  sheet.getRange(row, 6).setValue(false);
}

function trashSenderFromRow_(sheet, row) {
  var sender = String(sheet.getRange(row, 1).getValue() || "").trim();
  if (!sender) return 0;

  var query = buildSenderSearchQuery_(sender);
  var total = 0;
  var batch = 0;

  while (true) {
    var threads = GmailApp.search(query, 0, 500);
    if (!threads.length) break;

    GmailApp.moveThreadsToTrash(threads);
    total += threads.length;
    batch += 1;

    if (threads.length < 500) break;
    if (batch >= 20) break;
  }

  if (total > 0) {
    SpreadsheetApp.getActive().toast(
      "Remetente movido para a lixeira: " + sender,
      "Gmail Cleanup Helper",
      5
    );
  }

  return total;
}

/* ═══════════════════════════════════════
   SETUP & RESET
   ═══════════════════════════════════════ */

function setup() {
  ensureSheet_();
  ensureProperties_();
  createOrReplaceTriggers_();
  SpreadsheetApp.getActive().toast("Setup concluído. Recarregue a planilha.", "Gmail Cleanup Helper", 6);
}

function ensureProperties_() {
  var props = PropertiesService.getScriptProperties();
  var defaults = {
    SCAN_WINDOW_START: CONFIG.SCAN_START_DATE,
    SCAN_PAGE_OFFSET: "0",
    SCAN_COMPLETE: "false",
    LAST_SCAN_AT: "",
    LAST_SCAN_BATCH: "0",
    DIGEST_SNAPSHOT_JSON: "",
    STREAK_DAYS: "0",
    POINTS: "0"
  };

  Object.keys(defaults).forEach(function(k) {
    if (props.getProperty(k) === null) props.setProperty(k, defaults[k]);
  });
}

function resetScan() {
  ensureProperties_();
  var props = PropertiesService.getScriptProperties();
  props.setProperty("SCAN_WINDOW_START", CONFIG.SCAN_START_DATE);
  props.setProperty("SCAN_PAGE_OFFSET", "0");
  props.setProperty("SCAN_COMPLETE", "false");
  clearSenderCounts_();
  SpreadsheetApp.getActive().toast("Scanner resetado. Counts zerados, resolvidos preservados.", "Gmail Cleanup Helper", 4);
}

function hardReset() {
  ensureProperties_();
  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    SCAN_WINDOW_START: CONFIG.SCAN_START_DATE,
    SCAN_PAGE_OFFSET: "0",
    SCAN_COMPLETE: "false",
    LAST_SCAN_AT: "",
    LAST_SCAN_BATCH: "0",
    DIGEST_SNAPSHOT_JSON: "",
    STREAK_DAYS: "0",
    POINTS: "0"
  });

  var sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);
  if (sheet && sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).clearContent();
  }

  SpreadsheetApp.getActive().toast("Hard reset concluído.", "Gmail Cleanup Helper", 4);
}

/* ═══════════════════════════════════════
   SCANNER
   ═══════════════════════════════════════ */

function runScannerBatch() {
  ensureSheet_();
  ensureProperties_();

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  var startedAt = Date.now();

  try {
    var props = PropertiesService.getScriptProperties();
    var state = loadScanState_(props);
    var loaded = loadSenderIndex_();
    var sheet = loaded.sheet;
    var senderIndex = loaded.senderIndex;
    var processedThreads = 0;

    while (Date.now() - startedAt < CONFIG.MAX_RUNTIME_MS) {
      if (state.complete) break;

      var query = buildWindowQuery_(state.windowStart);
      var threads = GmailApp.search(query, state.pageOffset, CONFIG.SCAN_BATCH_THREADS);

      if (!threads.length) {
        state = advanceScanWindow_(state);
        saveScanState_(props, state, processedThreads);
        continue;
      }

      var batchUpdates = new Map();

      for (var t = 0; t < threads.length; t++) {
        if (Date.now() - startedAt >= CONFIG.MAX_RUNTIME_MS) break;
        var thread = threads[t];
        var threadUpdates = aggregateThreadBySender_(thread);
        mergeUpdateMaps_(batchUpdates, threadUpdates);
      }

      batchUpsertSenders_(sheet, senderIndex, batchUpdates);
      processedThreads += threads.length;

      if (threads.length < CONFIG.SCAN_BATCH_THREADS) {
        state = advanceScanWindow_(state);
      } else {
        state.pageOffset += threads.length;
      }

      saveScanState_(props, state, processedThreads);
    }

    saveScanState_(props, state, processedThreads);
  } catch (err) {
    Logger.log("Erro Scanner: " + err.message);
  } finally {
    lock.releaseLock();
  }
}

function loadScanState_(props) {
  var start = props.getProperty("SCAN_WINDOW_START") || CONFIG.SCAN_START_DATE;
  var pageOffset = parseInt(props.getProperty("SCAN_PAGE_OFFSET") || "0", 10);
  return {
    windowStart: parseGmailDate_(start),
    pageOffset: isNaN(pageOffset) ? 0 : pageOffset,
    complete: props.getProperty("SCAN_COMPLETE") === "true"
  };
}

function saveScanState_(props, state, lastBatchSize) {
  props.setProperty("SCAN_WINDOW_START", formatGmailDate_(state.windowStart));
  props.setProperty("SCAN_PAGE_OFFSET", String(state.pageOffset));
  props.setProperty("SCAN_COMPLETE", state.complete ? "true" : "false");
  props.setProperty("LAST_SCAN_AT", new Date().toISOString());
  props.setProperty("LAST_SCAN_BATCH", String(lastBatchSize || 0));
}

function advanceScanWindow_(state) {
  var nextStart = addDays_(state.windowStart, CONFIG.SCAN_WINDOW_DAYS);
  var today = startOfDay_(new Date());

  if (nextStart > addDays_(today, 1)) {
    return {
      windowStart: nextStart,
      pageOffset: 0,
      complete: true
    };
  }

  return {
    windowStart: nextStart,
    pageOffset: 0,
    complete: false
  };
}

function buildWindowQuery_(windowStart) {
  var afterDate = addDays_(windowStart, -1);
  var beforeDate = addDays_(windowStart, CONFIG.SCAN_WINDOW_DAYS);

  return [
    CONFIG.SCAN_QUERY_EXTRA,
    "after:" + formatGmailDate_(afterDate),
    "before:" + formatGmailDate_(beforeDate)
  ].join(" ");
}

function aggregateThreadBySender_(thread) {
  var messages = thread.getMessages();
  var updates = {};
  var senderSeenInThread = {};

  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];
    var sender = normalizeEmail_(msg.getFrom());
    if (!sender) continue;

    if (!updates[sender]) {
      updates[sender] = {
        addMsgs: 0,
        addThreads: 0,
        lastSeen: msg.getDate()
      };
    }

    updates[sender].addMsgs += 1;
    if (!senderSeenInThread[sender]) {
      updates[sender].addThreads += 1;
      senderSeenInThread[sender] = true;
    }

    if (msg.getDate() > updates[sender].lastSeen) {
      updates[sender].lastSeen = msg.getDate();
    }
  }

  return updates;
}

function mergeUpdateMaps_(target, source) {
  Object.keys(source).forEach(function(senderKey) {
    var incoming = source[senderKey];
    var current = target.get(senderKey);

    if (current) {
      current.addMsgs += incoming.addMsgs;
      current.addThreads += incoming.addThreads;
      if (incoming.lastSeen > current.lastSeen) current.lastSeen = incoming.lastSeen;
    } else {
      target.set(senderKey, {
        addMsgs: incoming.addMsgs,
        addThreads: incoming.addThreads,
        lastSeen: incoming.lastSeen
      });
    }
  });
}

/* ═══════════════════════════════════════
   DIGEST
   ═══════════════════════════════════════ */

function sendDailyDigest() {
  ensureSheet_();
  ensureProperties_();

  try {
    var ss = SpreadsheetApp.getActive();
    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (sheet.getLastRow() <= 1) return;

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();

    var candidates = rows
      .map(function(r, idx) {
        return {
          row: idx + 2,
          sender: String(r[0] || "").trim(),
          msgCount: Number(r[1] || 0),
          threadCount: Number(r[2] || 0),
          lastSeen: r[3],
          resolved: isResolvedStatus_(r[4])
        };
      })
      .filter(function(x) {
        return x.sender && !x.resolved && x.msgCount > 0;
      })
      .sort(function(a, b) {
        return b.msgCount - a.msgCount;
      });

    var top = candidates.slice(0, CONFIG.DIGEST_TOP_N);
    var isClean = (top.length === 0) || (top[0].msgCount < CONFIG.CLEAN_INBOX_THRESHOLD);

    var props = PropertiesService.getScriptProperties();
    var prev = safeJsonParse_(props.getProperty("DIGEST_SNAPSHOT_JSON") || "");
    var deltas = computeDeltas_(top, snapshotToMap_(prev));
    var streak = parseInt(props.getProperty("STREAK_DAYS") || "0", 10);
    var points = parseInt(props.getProperty("POINTS") || "0", 10);

    if (deltas[0] && deltas[0].delta > 0) {
      streak++;
      points += Math.max(1, Math.floor(deltas[0].delta / CONFIG.DELTA_POINTS_DIVISOR));
    } else if (prev && prev.top && prev.top.length) {
      streak = 0;
    }

    props.setProperty("STREAK_DAYS", String(streak));
    props.setProperty("POINTS", String(points));
    props.setProperty("DIGEST_SNAPSHOT_JSON", JSON.stringify({
      ts: new Date().toISOString(),
      top: top.map(function(s) {
        return { sender: s.sender, msgCount: s.msgCount };
      })
    }));

    var html = buildDigestHtml_({
      scanState: props.getProperty("SCAN_COMPLETE") === "true" ? "complete" : "in_progress",
      isClean: isClean,
      top: top,
      deltas: deltas,
      messScore: calculateMessScore_(candidates),
      streak: streak,
      points: points,
      totalSenders: candidates.length,
      totalMsgs: candidates.reduce(function(sum, c) { return sum + c.msgCount; }, 0),
      sheetUrl: ss.getUrl(),
      sheetId: sheet.getSheetId()
    });

    var recipient = props.getProperty("DIGEST_RECIPIENT") || Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
    if (!recipient) {
      Logger.log("Digest não enviado: destinatário indisponível.");
      return;
    }

    GmailApp.sendEmail(
      recipient,
      isClean ? "Inbox Radar diário: caixa sob controle" : "Inbox Radar diário: prioridade de hoje",
      "",
      { htmlBody: html }
    );
  } catch (e) {
    Logger.log("Erro Digest: " + e.message);
  }
}

function buildDigestHtml_(d) {
  var T = THEME;
  var now = new Date().toLocaleString("pt-BR", { timeZone: CONFIG.TIMEZONE });
  var badge = badgeForScanState_(d.scanState);
  var headerTitle = d.isClean ? "Caixa sob controle hoje" : "Prioridade de hoje";
  var headerSubtitle = d.isClean
    ? "Nada urgente apareceu no radar hoje."
    : "Ataque os principais remetentes de hoje e resolva grande parte do problema.";

  var h = '<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:' + T.page + ';">';
  h += '<table width="100%" style="background:' + T.page + ';"><tr><td align="center" style="padding:32px 16px;">';
  h += '<table width="640" style="width:640px;max-width:100%;">';

  h += '<tr><td style="background:' + T.bg + ';border-radius:20px 20px 0 0;padding:40px;">';
  h += '<div style="color:' + T.subtle + ';font-size:12px;letter-spacing:2px;">INBOX RADAR DIÁRIO</div>';
  h += '<div style="font-size:32px;font-weight:800;color:#fff;margin:15px 0;">' + escapeHtml_(headerTitle) + '</div>';
  h += '<div style="color:#cbd5e1;line-height:1.6;">' + escapeHtml_(headerSubtitle) + '</div><br>' + badge;
  h += '</td></tr>';

  h += '<tr><td style="padding:28px 0;">';
  h += scoreboardRow3_(
    statCard_("Mensagens", formatNumber_(d.totalMsgs), "Volume"),
    statCard_("Remetentes", String(d.totalSenders), "Ativos"),
    statCard_("Nivel", d.messScore, "Foco")
  );
  h += '</td></tr>';

  h += '<tr><td><table width="100%" style="background:#fff;border-radius:16px;box-shadow:' + T.shadow + ';border:1px solid ' + T.border + ';"><tr><td style="padding:28px;">';

  if (d.isClean) {
    h += '<div style="font-size:22px;font-weight:800;color:' + T.okText + ';">Tudo em ordem</div>';
    h += '<p style="color:' + T.muted + ';">Parabéns. Sua caixa está limpa conforme os critérios.</p>';
  } else {
    h += '<div style="font-size:13px;color:' + T.subtle + ';font-weight:600;">TOP REMETENTES DE HOJE</div>';
    h += '<div style="font-size:24px;font-weight:800;color:' + T.text + ';margin:10px 0 6px 0;">Ataque os próximos ' + d.top.length + '</div>';
    h += '<p style="color:' + T.muted + ';margin-bottom:12px;">Marcar a caixa como resolvida remove o remetente dos próximos digests, mas o contador continua acumulando.</p>';

    for (var i = 0; i < d.top.length; i++) {
      h += senderRow_(i + 1, d.top[i], d.sheetUrl, d.sheetId);
    }
  }

  h += '</td></tr></table></td></tr>';
  h += '<tr><td align="center" style="padding:40px;color:' + T.subtle + ';font-size:12px;">Gmail Cleanup Helper v4.0.0 &middot; ' + now + '</td></tr>';
  h += '</table></td></tr></table></body></html>';

  return h;
}

function senderRow_(pos, s, sheetUrl, sheetId) {
  var T = THEME;
  var label = senderLabelFromFrom_(s.sender);
  var meta = formatNumber_(s.msgCount) + " msgs • " + formatNumber_(s.threadCount) + " conversas";
  var gmailUrl = gmailSearchUrl_(buildSenderSearchQuery_(s.sender));
  var statusCell = "E" + s.row;
  var statusUrl = sheetCellUrl_(sheetUrl, sheetId, statusCell);

  var h = '<div style="padding:16px 0;border-top:1px solid ' + T.border + ';">';
  h += '<div style="font-weight:800;color:' + T.text + ';font-size:16px;">#' + pos + ' ' + escapeHtml_(label) + '</div>';
  h += '<div style="font-size:13px;color:' + T.muted + ';margin:6px 0 14px 0;">' + escapeHtml_(s.sender) + '<br>' + escapeHtml_(meta) + '</div>';

  h += '<a href="' + gmailUrl + '" style="display:inline-block;padding:10px 16px;background:' + T.primary + ';color:#fff;border-radius:999px;text-decoration:none;font-weight:700;font-size:13px;margin-right:8px;">Abrir no Gmail</a>';
  h += '<a href="' + statusUrl + '" style="display:inline-block;padding:10px 16px;background:' + T.doneBg + ';color:#fff;border-radius:999px;text-decoration:none;font-weight:700;font-size:13px;">Abrir status no Sheets</a>';

  h += '<div style="font-size:12px;color:' + T.subtle + ';margin-top:10px;">Se a checkbox da célula <b>' + statusCell + '</b> estiver marcada, ele não volta mais no digest.</div>';
  h += '</div>';

  return h;
}

function statCard_(title, value, hint) {
  var T = THEME;
  return '<table width="100%" style="background:#fff;border:1px solid ' + T.border + ';border-radius:14px;padding:15px;"><tr><td>' +
    '<div style="font-size:10px;color:' + T.subtle + ';font-weight:600;">' + title + '</div>' +
    '<div style="font-size:22px;font-weight:900;color:' + T.text + ';margin:5px 0;">' + value + '</div>' +
    '<div style="font-size:11px;color:' + T.muted + ';">' + hint + '</div>' +
    '</td></tr></table>';
}

function scoreboardRow3_(a, b, c) {
  return '<table width="100%"><tr><td width="33%">' + a + '</td><td width="33%">' + b + '</td><td width="33%">' + c + '</td></tr></table>';
}

function badgeForScanState_(state) {
  var bg = state === "complete" ? THEME.okBg : THEME.chipBg;
  var col = state === "complete" ? THEME.okText : THEME.chipText;
  return '<span style="padding:5px 12px;background:' + bg + ';color:' + col + ';border-radius:20px;font-size:12px;font-weight:700;">Scan: ' + (state === "complete" ? "Completo" : "Rodando") + '</span>';
}

/* ═══════════════════════════════════════
   SHEET / STORAGE HELPERS
   ═══════════════════════════════════════ */

function ensureSheet_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);

  if (sh.getMaxColumns() < 6) {
    sh.insertColumnsAfter(sh.getMaxColumns(), 6 - sh.getMaxColumns());
  }

  sh.getRange("A1:F1")
    .setValues([["sender", "msg_count", "conversation_count", "last_seen", "status", "trash_now"]])
    .setBackground("#1a73e8")
    .setFontColor("#fff")
    .setFontWeight("bold");

  sh.setFrozenRows(1);

  if (sh.getMaxRows() > 1) {
    sh.getRange(2, 5, sh.getMaxRows() - 1, 1).insertCheckboxes();
    sh.getRange(2, 6, sh.getMaxRows() - 1, 1).insertCheckboxes();
  }
}

function loadSenderIndex_() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);
  var index = {};

  if (sheet.getLastRow() > 1) {
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    data.forEach(function(r, i) {
      var sender = String(r[0] || "").trim().toLowerCase();
      if (!sender) return;
      index[sender] = {
        row: i + 2,
        msgCount: Number(r[1] || 0),
        threadCount: Number(r[2] || 0),
        lastSeen: r[3],
        status: r[4]
      };
    });
  }

  return { sheet: sheet, senderIndex: index };
}

function batchUpsertSenders_(sheet, index, updates) {
  var newRows = [];

  updates.forEach(function(data, sKey) {
    var exist = index[sKey];

    if (exist) {
      var nextMsgCount = Number(exist.msgCount || 0) + Number(data.addMsgs || 0);
      var nextThreadCount = Number(exist.threadCount || 0) + Number(data.addThreads || 0);
      var nextLastSeen = exist.lastSeen;
      if (!nextLastSeen || data.lastSeen > nextLastSeen) {
        nextLastSeen = data.lastSeen;
      }

      sheet.getRange(exist.row, 2, 1, 3).setValues([[
        nextMsgCount,
        nextThreadCount,
        nextLastSeen
      ]]);

      exist.msgCount = nextMsgCount;
      exist.threadCount = nextThreadCount;
      exist.lastSeen = nextLastSeen;
    } else {
      newRows.push([sKey, data.addMsgs, data.addThreads, data.lastSeen, false]);
    }
  });

  if (newRows.length) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, newRows.length, 5).setValues(newRows);
    sheet.getRange(startRow, 5, newRows.length, 1).insertCheckboxes();
    sheet.getRange(startRow, 5, newRows.length, 1).setValue(false);
  }
}

function clearSenderCounts_() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME);
  if (sheet && sheet.getLastRow() > 1) {
    sheet.getRange(2, 2, sheet.getLastRow() - 1, 2)
      .setValues(
        sheet.getRange(2, 2, sheet.getLastRow() - 1, 2)
          .getValues()
          .map(function() { return [0, 0]; })
      );
  }
}

function createOrReplaceTriggers_() {
  var ts = ScriptApp.getProjectTriggers();
  ts.forEach(function(t) {
    if (
      t.getHandlerFunction() === "runScannerBatch" ||
      t.getHandlerFunction() === "sendDailyDigest" ||
      t.getHandlerFunction() === "handleSheetEdit"
    ) {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger("runScannerBatch")
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.SCAN_TRIGGER_HOUR)
    .create();

  ScriptApp.newTrigger("sendDailyDigest")
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.DIGEST_TRIGGER_HOUR)
    .create();

  ScriptApp.newTrigger("handleSheetEdit")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
}

/* ═══════════════════════════════════════
   HELPERS GERAIS
   ═══════════════════════════════════════ */

function isResolvedStatus_(v) {
  return v === true || String(v || "").toUpperCase().trim() === "TRUE";
}

function buildSenderSearchQuery_(sender) {
  return CONFIG.SCAN_QUERY_EXTRA + " from:" + quoteIfNeeded_(sender);
}

function gmailSearchUrl_(q) {
  return "https://mail.google.com/mail/u/0/#search/" + encodeURIComponent(q);
}

function sheetCellUrl_(sheetUrl, sheetId, a1) {
  return sheetUrl + "#gid=" + sheetId + "&range=" + encodeURIComponent(a1);
}

function quoteIfNeeded_(s) {
  return /[^\w.@+\-]/.test(s) ? '"' + s + '"' : s;
}

function senderLabelFromFrom_(fromValue) {
  var match = String(fromValue || "").match(/^"?(.+?)"?\s*<([^>]+)>$/);
  if (match && match[1]) return match[1].replace(/"/g, "").trim();
  return normalizeEmail_(fromValue);
}

function formatNumber_(n) {
  n = Number(n || 0);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function escapeHtml_(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeJsonParse_(s) {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function snapshotToMap_(sn) {
  var m = {};
  if (sn && sn.top) {
    sn.top.forEach(function(t) {
      m[t.sender] = t.msgCount;
    });
  }
  return m;
}

function computeDeltas_(top, prev) {
  return top.map(function(t) {
    var p = prev[t.sender] || 0;
    return { sender: t.sender, delta: p - t.msgCount };
  });
}

function calculateMessScore_(c) {
  if (!c.length) return "Top";
  var total = c.reduce(function(s, x) { return s + x.msgCount; }, 0);
  if (!total) return "Top";
  var r = c[0].msgCount / total;
  return r > 0.5 ? "Crítico" : "Ok";
}

function normalizeEmail_(fromValue) {
  var text = String(fromValue || "").trim();
  if (!text) return "";
  var m = text.match(/<([^>]+)>/);
  var email = (m ? m[1] : text).trim().toLowerCase();
  if (!email || email.indexOf("@") === -1) return "";
  return email;
}

function parseGmailDate_(value) {
  if (value instanceof Date) {
    return startOfDay_(value);
  }

  var text = String(value || "").trim();
  if (!text) return startOfDay_(new Date());

  var parts = text.split("-");
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  return new Date(text);
}

function formatGmailDate_(date) {
  return Utilities.formatDate(startOfDay_(date), CONFIG.TIMEZONE, "yyyy/MM/dd");
}

function addDays_(date, days) {
  var next = new Date(date.getTime());
  next.setDate(next.getDate() + Number(days || 0));
  return startOfDay_(next);
}

function startOfDay_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
