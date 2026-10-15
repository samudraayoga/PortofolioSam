(() => {
  'use strict';

  const FRAME_BUDGET = 1000 / 60;
  const SCROLL_TAIL = 180;
  const samples = [];
  const chapters = new Map();
  const longTasks = [];
  const longFrames = [];
  const layoutShifts = [];
  const layoutShiftEvents = [];
  const startedAt = performance.now();
  let lastFrame = startedAt;
  let scrollActiveUntil = 0;
  let snapshotTimer = 0;
  let rafId = 0;

  function chapterName() {
    return document.body?.dataset.worldChapter || 'unknown';
  }

  function record(delta) {
    if (!Number.isFinite(delta) || delta <= 0 || delta > 1000) return;
    const chapter = chapterName();
    samples.push({delta, chapter});
    if (!chapters.has(chapter)) chapters.set(chapter, []);
    chapters.get(chapter).push(delta);
  }

  function frame(now) {
    const delta = now - lastFrame;
    lastFrame = now;
    if (now <= scrollActiveUntil) record(delta);
    rafId = requestAnimationFrame(frame);
  }

  function percentile(values, ratio) {
    if (!values.length) return 0;
    const ordered = [...values].sort((a, b) => a - b);
    return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * ratio))];
  }

  function summarize(values) {
    if (!values.length) {
      return {
        frames: 0,
        averageFps: 0,
        medianFrameMs: 0,
        p95FrameMs: 0,
        worstFrameMs: 0,
        estimatedDroppedFrames: 0,
        framesBelow30Fps: 0,
        framesBelow20Fps: 0
      };
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    const averageFrame = total / values.length;
    return {
      frames: values.length,
      averageFps: Number((1000 / averageFrame).toFixed(1)),
      medianFrameMs: Number(percentile(values, .5).toFixed(2)),
      p95FrameMs: Number(percentile(values, .95).toFixed(2)),
      worstFrameMs: Number(Math.max(...values).toFixed(2)),
      estimatedDroppedFrames: values.reduce((sum, value) => sum + Math.max(0, Math.round(value / FRAME_BUDGET) - 1), 0),
      framesBelow30Fps: values.filter(value => value >= 1000 / 30).length,
      framesBelow20Fps: values.filter(value => value >= 50).length
    };
  }

  function resourceSummary() {
    const resources = performance.getEntriesByType('resource');
    return {
      requests: resources.length,
      transferredKb: Number((resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0) / 1024).toFixed(1)),
      decodedKb: Number((resources.reduce((sum, entry) => sum + (entry.decodedBodySize || 0), 0) / 1024).toFixed(1))
    };
  }

  function snapshot() {
    const frameValues = samples.map(sample => sample.delta);
    return {
      mode: 'scroll-baseline',
      measuredForMs: Number((performance.now() - startedAt).toFixed(0)),
      viewport: {
        width: innerWidth,
        height: innerHeight,
        devicePixelRatio
      },
      scroll: summarize(frameValues),
      chapters: Object.fromEntries([...chapters].map(([name, values]) => [name, summarize(values)])),
      longTasks: {
        count: longTasks.length,
        totalBlockingMs: Number(longTasks.reduce((sum, value) => sum + Math.max(0, value - 50), 0).toFixed(2)),
        worstMs: Number(Math.max(0, ...longTasks).toFixed(2))
      },
      longFrames: longFrames.slice(-20).sort((a, b) => b.durationMs - a.durationMs).slice(0, 8),
      cumulativeLayoutShift: Number(layoutShifts.reduce((sum, value) => sum + value, 0).toFixed(4)),
      layoutShiftEvents: layoutShiftEvents
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      runningAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
      supportsLongAnimationFrames: typeof PerformanceObserver !== 'undefined'
        && PerformanceObserver.supportedEntryTypes?.includes('long-animation-frame') || false,
      resources: resourceSummary()
    };
  }

  function observe(type, handler) {
    if (!('PerformanceObserver' in window)) return;
    if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return;
    const observer = new PerformanceObserver(list => list.getEntries().forEach(handler));
    observer.observe({type, buffered: true});
  }

  function publishSnapshot() {
    document.documentElement.dataset.performanceSnapshot = JSON.stringify(snapshot());
  }

  observe('longtask', entry => longTasks.push(entry.duration));
  observe('long-animation-frame', entry => {
    longFrames.push({
      chapter: chapterName(),
      durationMs: Number(entry.duration.toFixed(1)),
      renderMs: Number(Math.max(0, entry.duration - (entry.renderStart - entry.startTime)).toFixed(1)),
      afterStyleStartMs: Number(Math.max(0, entry.duration - (entry.styleAndLayoutStart - entry.startTime)).toFixed(1)),
      scripts: [...entry.scripts].sort((a, b) => b.duration - a.duration).slice(0, 3).map(script => ({
        file: script.sourceURL?.split('/').pop() || 'unknown',
        function: script.sourceFunctionName || script.invoker || 'unknown',
        durationMs: Number(script.duration.toFixed(1)),
        forcedLayoutMs: Number(script.forcedStyleAndLayoutDuration.toFixed(1))
      }))
    });
    if (longFrames.length > 60) longFrames.shift();
  });
  observe('layout-shift', entry => {
    if (entry.hadRecentInput) return;
    layoutShifts.push(entry.value);
    layoutShiftEvents.push({
      value: Number(entry.value.toFixed(4)),
      sources: (entry.sources || []).slice(0, 4).map(source => {
        const node = source.node;
        if (!node) return 'unknown';
        if (node.id) return `#${node.id}`;
        const classes = typeof node.className === 'string'
          ? node.className.trim().split(/\s+/).slice(0, 3).join('.')
          : '';
        return `${node.localName || 'node'}${classes ? `.${classes}` : ''}`;
      })
    });
  });

  addEventListener('scroll', () => {
    scrollActiveUntil = performance.now() + SCROLL_TAIL;
    clearTimeout(snapshotTimer);
    snapshotTimer = setTimeout(publishSnapshot, SCROLL_TAIL + 80);
  }, {passive: true});

  addEventListener('pagehide', () => {
    cancelAnimationFrame(rafId);
    clearTimeout(snapshotTimer);
  }, {once: true});

  document.documentElement.dataset.performanceAudit = 'active';
  publishSnapshot();
  rafId = requestAnimationFrame(frame);

  window.__celestialPerformanceAudit = Object.freeze({snapshot});
  console.info('[Performance Audit] Scroll baseline recorder active.');
})();
