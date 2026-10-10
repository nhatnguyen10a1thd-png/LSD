(() => {
  'use strict';

  /* ==========================================================================
     1986 — BƯỚC NGOẶT ĐỔI MỚI (CHUYÊN ĐỀ LỊCH SỬ ĐẢNG & TƯ LIỆU QUỐC GIA)
     Interactive Client Script: Statistical Charts, Time Navigator & Lightbox
     ========================================================================== */

  const data = window.STORY_DATA;
  const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const precise = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 4 });

  const byId = Object.fromEntries((data?.series || []).map(series => [series.id, series]));
  const meaningful = series => series.points.filter(point => point.value !== null && Number.isFinite(point.value));
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const format = (value, kind) => {
    if (value === null) return 'Chưa có số liệu';
    return kind === 'percent' ? `${decimal.format(value)}%` : number.format(value);
  };

  if (!data || !['gdp', 'agriculture', 'industry', 'services', 'urban'].every(id => byId[id])) {
    document.querySelectorAll('.chart-mount').forEach(mount => {
      mount.textContent = 'Chưa tải được dữ liệu biểu đồ. Bạn có thể đối chiếu tại liên kết nguồn bên dưới.';
    });
    console.error('The bundled World Bank data is missing or invalid.');
  }

  // Bối cảnh lịch sử gắn liền với các mốc niên đại
  const historicalContexts = {
    sectors: {
      1986: 'Năm 1986: Nông nghiệp chiếm tới 38,1% GDP, kinh tế phụ thuộc nặng nề vào sản xuất nông nghiệp truyền thống.',
      1995: 'Năm 1995: Nghị quyết Khoán 10 (1988) cởi trói sức sản xuất, khu vực dịch vụ bứt phá đạt 44% GDP.',
      2007: 'Năm 2007: Thời điểm gia nhập WTO, công nghiệp và dịch vụ vươn lên chiếm lĩnh trên 81% cơ cấu kinh tế.',
      2025: 'Năm 2025: Cơ cấu kinh tế chuyển dịch hiện đại, công nghiệp và dịch vụ chiếm hơn 80% GDP cả nước.'
    },
    gdp: {
      1986: 'Năm 1986: GDP bình quân đầu người thực tế chỉ đạt 608 USD (giá cố định 2015), đất nước trong vòng xoáy khủng hoảng.',
      1995: 'Năm 1995: Việt Nam chính thức gia nhập ASEAN và bình thường hóa quan hệ với Hoa Kỳ; GDP/người vượt 1.000 USD.',
      2007: 'Năm 2007: Trở thành thành viên WTO, làn sóng đầu tư quốc tế đưa quy mô kinh tế trên đầu người tăng vọt.',
      2025: 'Năm 2025: GDP/người thực tế đạt 4.308 USD (cố định 2015), tăng gấp 7,1 lần so với điểm khởi đầu Đổi mới.'
    },
    urban: {
      1986: 'Năm 1986: Gần 81% dân số sống ở nông thôn; tỷ lệ đô thị hóa thấp (19,1%), hạ tầng còn rất sơ khai.',
      1995: 'Năm 1995: Các khu công nghiệp và đô thị kinh tế hình thành, mở đầu làn sóng dịch chuyển lao động.',
      2007: 'Năm 2007: Tốc độ mở rộng đô thị gia tăng nhanh chóng cùng tiến trình mở cửa hội nhập quốc tế.',
      2025: 'Năm 2025: Gần 40% dân số sinh sống tại các đô thị văn minh, hiện đại trên khắp cả nước.'
    }
  };

  const chartConfigs = {
    sectors: {
      ids: ['agriculture', 'industry', 'services'],
      colors: ['#8c6621', '#a82218', '#255d42'],
      ymax: 50,
      ticks: [0, 10, 20, 30, 40, 50],
      kind: 'percent',
      title: 'Tỷ trọng các ngành trong GDP',
      unit: '% GDP'
    },
    gdp: {
      ids: ['gdp'],
      colors: ['#a82218'],
      ymax: 5000,
      ticks: [0, 1000, 2000, 3000, 4000, 5000],
      kind: 'integer',
      title: 'GDP bình quân đầu người theo giá cố định 2015',
      unit: 'USD cố định 2015'
    },
    urban: {
      ids: ['urban'],
      colors: ['#255d42'],
      ymax: 100,
      ticks: [0, 20, 40, 60, 80, 100],
      kind: 'percent',
      title: 'Tỷ lệ dân số đô thị trong tổng dân số',
      unit: '% tổng dân số'
    }
  };

  const models = {};
  const svgNS = 'http://www.w3.org/2000/svg';
  const geometry = { width: 600, height: 300, left: 55, right: 18, top: 23, bottom: 37 };

  function buildChart(name) {
    const config = chartConfigs[name];
    if (config.ids.some(id => !byId[id])) return;

    const series = config.ids.map(id => byId[id]);
    const first = Math.max(...series.map(s => meaningful(s)[0].year));
    const last = Math.min(...series.map(s => meaningful(s).at(-1).year));
    const observations = series.flatMap(s => s.points.filter(p => p.year >= first && p.year <= last && p.value !== null));
    const highest = Math.max(...observations.map(p => p.value));

    const ymax = highest > config.ymax
      ? Math.ceil(highest / (config.kind === 'integer' ? 1000 : 10)) * (config.kind === 'integer' ? 1000 : 10)
      : config.ymax;
    const ticks = ymax === config.ymax ? config.ticks : Array.from({ length: 6 }, (_, i) => (ymax * i) / 5);

    const x = year => geometry.left + ((year - first) / (last - first)) * (geometry.width - geometry.left - geometry.right);
    const y = value => geometry.height - geometry.bottom - (value / ymax) * (geometry.height - geometry.top - geometry.bottom);

    const path = (points, cutoff = last) => {
      let pen = false;
      return points
        .filter(p => p.year >= first && p.year <= Math.min(cutoff, last))
        .map(p => {
          if (p.value === null || !Number.isFinite(p.value)) {
            pen = false;
            return '';
          }
          const command = pen ? 'L' : 'M';
          pen = true;
          return `${command}${x(p.year).toFixed(2)},${y(p.value).toFixed(2)}`;
        })
        .join(' ');
    };

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${geometry.width} ${geometry.height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', `${name}-svg-title ${name}-svg-desc`);

    const grid = ticks.map(value => `
      <line class="chart-grid" x1="${geometry.left}" y1="${y(value)}" x2="${geometry.width - geometry.right}" y2="${y(value)}"/>
      <text class="axis-text" x="${geometry.left - 12}" y="${y(value) + 4}" text-anchor="end">${number.format(value)}</text>
    `).join('');

    const years = [...new Set([first, 1995, 2007, last])].filter(year => year >= first && year <= last);
    const labels = years.map(year => `
      <text class="axis-text" x="${x(year)}" y="${geometry.height - 12}" text-anchor="${year === first ? 'start' : year === last ? 'end' : 'middle'}">${year}</text>
    `).join('');

    const events = name === 'gdp'
      ? [{ year: 1995, label: 'ASEAN 1995' }, { year: 2007, label: 'WTO 2007' }]
          .filter(event => event.year >= first && event.year <= last)
          .map(event => `
            <line class="chart-event-line" x1="${x(event.year)}" y1="${geometry.top + 14}" x2="${x(event.year)}" y2="${geometry.height - geometry.bottom}"/>
            <text class="chart-event-label" x="${x(event.year) + 4}" y="${geometry.top + 6}">${event.label}</text>
          `).join('')
      : '';

    const lines = series.map((s, i) => `
      <path class="chart-path-bg" stroke="${config.colors[i]}" d="${path(s.points)}"/>
      <path class="chart-path" data-series="${s.id}" stroke="${config.colors[i]}" d="${path(s.points)}"/>
      <circle class="chart-marker" data-marker="${s.id}" r="4.5" fill="${config.colors[i]}"/>
    `).join('');

    svg.innerHTML = `
      <title id="${name}-svg-title">${escape(config.title)}</title>
      <desc id="${name}-svg-desc">${escape(config.title)}, ${first}–${last}. ${escape(config.unit)}. Bảng số liệu đầy đủ ở bên dưới biểu đồ.</desc>
      ${grid}
      ${labels}
      ${events}
      <line class="chart-cursor" x1="${x(last)}" x2="${x(last)}" y1="${geometry.top}" y2="${geometry.height - geometry.bottom}"/>
      ${lines}
    `;

    document.getElementById(`${name}-chart`).append(svg);

    models[name] = { config, series, first, last, x, y, path, svg, currentYear: last };

    // Build data table
    const tableYears = Array.from({ length: last - first + 1 }, (_, i) => first + i);
    const table = `
      <table>
        <caption class="sr-only">${escape(config.title)} — ${escape(config.unit)}</caption>
        <thead>
          <tr>
            <th scope="col">Năm</th>
            ${series.map(s => `<th scope="col">${escape(s.label)}<br><small style="color:var(--ink-muted)">${escape(s.unit)}</small></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableYears.map(year => `
            <tr>
              <th scope="row">${year}</th>
              ${series.map(s => {
                const p = s.points.find(point => point.year === year);
                return `<td>${p?.value != null ? precise.format(p.value) : '—'}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById(`${name}-table`).innerHTML = table;

    // Controls
    document.querySelectorAll(`[data-select-chart="${name}"]`).forEach(button => {
      if (Number(button.dataset.selectYear) === 2025) {
        button.dataset.selectYear = last;
        button.textContent = `${last} (Hiện nay)`;
      }
      button.disabled = Number(button.dataset.selectYear) < first || Number(button.dataset.selectYear) > last;
    });

    // Pointer hover interaction
    svg.addEventListener('pointermove', event => {
      const rect = svg.getBoundingClientRect();
      const pointerX = ((event.clientX - rect.left) / rect.width) * geometry.width;
      if (pointerX < geometry.left || pointerX > geometry.width - geometry.right) return;
      const proportion = (pointerX - geometry.left) / (geometry.width - geometry.left - geometry.right);
      const hoveredYear = Math.round(first + proportion * (last - first));
      setChartYear(name, hoveredYear);
    });

    setChartYear(name, last);
  }

  function setChartYear(name, requestedYear) {
    const model = models[name];
    if (!model) return;

    const year = Math.max(model.first, Math.min(model.last, requestedYear));
    model.currentYear = year;

    const cursor = model.svg.querySelector('.chart-cursor');
    if (cursor) {
      cursor.setAttribute('x1', model.x(year));
      cursor.setAttribute('x2', model.x(year));
    }

    const values = model.series.map((series, i) => {
      const seriesPath = model.svg.querySelector(`[data-series="${series.id}"]`);
      if (seriesPath) seriesPath.setAttribute('d', model.path(series.points, year));

      const point = series.points.find(p => p.year === year);
      const marker = model.svg.querySelector(`[data-marker="${series.id}"]`);
      if (marker) {
        marker.style.display = point?.value != null ? '' : 'none';
        if (point?.value != null) {
          marker.setAttribute('cx', model.x(year));
          marker.setAttribute('cy', model.y(point.value));
        }
      }

      return `<span><small>${escape(series.label)}</small><strong style="color:${model.config.colors[i]}">${format(point?.value ?? null, model.config.kind)}</strong></span>`;
    });

    const readout = document.getElementById(`${name}-readout`);
    if (readout) readout.innerHTML = values.join('');

    const yearLabel = document.querySelector(`[data-year-label="${name}"]`);
    if (yearLabel) yearLabel.textContent = year;

    document.querySelectorAll(`[data-select-chart="${name}"]`).forEach(button => {
      button.setAttribute('aria-pressed', Number(button.dataset.selectYear) === year ? 'true' : 'false');
    });

    // Update dynamic historical context card
    const contextEl = document.getElementById(`${name}-context`);
    if (contextEl && historicalContexts[name]) {
      const contextText = historicalContexts[name][year] || `Năm ${year}: Diễn biến số liệu trong giai đoạn Đổi mới.`;
      const contextSpan = contextEl.querySelector('.context-text');
      if (contextSpan) contextSpan.textContent = contextText;
    }

    const desc = model.svg.querySelector('desc');
    if (desc) {
      desc.textContent = `${model.config.title}, ${model.first}–${model.last}. Đang nhấn mạnh dữ liệu đến năm ${year}. Bảng số liệu đầy đủ ở bên dưới.`;
    }
  }

  // Initialize charts
  Object.keys(chartConfigs).forEach(buildChart);

  // Bind values
  document.querySelectorAll('[data-value]').forEach(element => {
    const [id, which, kind] = element.dataset.value.split(':');
    if (!byId[id]) return;
    const points = meaningful(byId[id]);
    const p = which === 'first' ? points[0] : points.at(-1);
    element.textContent = format(p.value, kind);
  });

  if (byId.gdp) {
    const points = meaningful(byId.gdp);
    const gdpRatio = document.getElementById('gdp-ratio');
    if (gdpRatio) {
      gdpRatio.textContent = decimal.format(points.at(-1).value / points[0].value);
    }
    document.querySelectorAll('[data-latest-year]').forEach(el => {
      el.textContent = points.at(-1).year;
    });
  }

  const dateFormat = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Bangkok',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  if (data?.retrievedAt) {
    const t = document.getElementById('retrieved-date');
    if (t) {
      t.textContent = dateFormat.format(new Date(data.retrievedAt));
      t.dateTime = data.retrievedAt;
    }
  }

  if (byId.gdp?.sourceUpdated) {
    const sourceUpdated = document.getElementById('source-updated');
    if (sourceUpdated) {
      sourceUpdated.textContent = dateFormat.format(new Date(`${byId.gdp.sourceUpdated}T00:00:00Z`));
    }
  }

  Object.entries(models).forEach(([name, model]) => {
    const metadata = document.createElement('span');
    metadata.className = 'chart-metadata';
    const updated = model.series.map(series => series.sourceUpdated).filter(Boolean).sort().at(-1);
    metadata.textContent = `Năm cuối: ${model.last} · Lấy dữ liệu: ${dateFormat.format(new Date(data.retrievedAt))}${updated ? ` · WDI: ${dateFormat.format(new Date(`${updated}T00:00:00Z`))}` : ''}`;
    const panelSource = document.querySelector(`#${name}-panel .data-source`);
    if (panelSource) panelSource.append(metadata);
  });

  document.querySelectorAll('[data-select-chart]').forEach(button => {
    button.addEventListener('click', () => {
      setChartYear(button.dataset.selectChart, Number(button.dataset.selectYear));
    });
  });

  // --- SCROLLYTELLING INTERSECTION OBSERVER ---
  if ('IntersectionObserver' in window) {
    const allSteps = document.querySelectorAll('.story-step');
    const stepObserver = new IntersectionObserver(entries => {
      const candidates = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          const aDist = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2);
          const bDist = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2);
          return aDist - bDist;
        });

      if (candidates[0]) {
        const step = candidates[0].target;
        allSteps.forEach(s => s.classList.remove('is-active'));
        step.classList.add('is-active');
        setChartYear(step.dataset.chart, Number(step.dataset.year));
      }
    }, {
      rootMargin: '-30% 0px -30% 0px',
      threshold: [0.1, 0.5]
    });

    allSteps.forEach(step => stepObserver.observe(step));
  }

  // --- IMAGE COMPARISON (SLIDER + DIRECT DRAG + PRESET BUTTONS) ---
  const range = document.getElementById('comparison');
  const comparison = document.querySelector('.image-comparison');
  const comparisonOutput = document.getElementById('comparison-output');
  const presetButtons = document.querySelectorAll('.preset-btn');

  function updateSplit(percentage) {
    const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
    if (comparison) comparison.style.setProperty('--split', `${clamped}%`);
    if (range) {
      range.value = clamped;
      range.setAttribute('aria-valuetext', `Bản phục chế chiếm ${clamped}% ảnh`);
    }
    if (comparisonOutput) comparisonOutput.value = `${clamped}%`;

    presetButtons.forEach(btn => {
      const presetVal = Number(btn.dataset.preset);
      btn.classList.toggle('active', presetVal === clamped);
    });
  }

  if (range) {
    range.addEventListener('input', () => updateSplit(Number(range.value)));
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateSplit(Number(btn.dataset.preset));
    });
  });

  if (comparison) {
    let isDragging = false;

    const handlePointerMove = event => {
      if (!isDragging) return;
      const rect = comparison.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const percent = (pointerX / rect.width) * 100;
      updateSplit(percent);
    };

    const stopDragging = () => {
      if (isDragging) {
        isDragging = false;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', stopDragging);
      }
    };

    comparison.addEventListener('pointerdown', event => {
      isDragging = true;
      const rect = comparison.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      updateSplit((pointerX / rect.width) * 100);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerup', stopDragging);
    });
  }

  // --- TABLE OF CONTENTS & ESCAPE HANDLING ---
  const menu = document.getElementById('contents');
  const toggle = document.querySelector('.contents-toggle');

  function closeMenu(returnFocus = false) {
    if (!menu || !toggle) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
      if (!expanded) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
    });

    document.addEventListener('click', event => {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // --- READING PROGRESS & CHAPTER TITLE TRACKING ---
  const progress = document.querySelector('.reading-progress');
  const fill = progress ? progress.querySelector('span') : null;
  const status = document.getElementById('chapter-status');
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  let scheduled = false;

  function updateProgress() {
    scheduled = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = scrollable > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollable)) : 0;

    if (fill) fill.style.transform = `scaleX(${fraction})`;
    if (progress) progress.setAttribute('aria-valuenow', Math.round(fraction * 100));

    const current = chapters.filter(chapter => chapter.getBoundingClientRect().top < window.innerHeight * 0.45).at(-1);
    if (status) {
      status.textContent = current
        ? `CHƯƠNG ${current.dataset.chapter} / 05 · ĐỔI MỚI 1986`
        : 'HỒ SƠ TƯ LIỆU VÀ DỮ LIỆU LỊCH SỬ';
    }

    if (menu) {
      menu.querySelectorAll('a').forEach(a => {
        if (current && a.getAttribute('href') === `#${current.id}`) {
          a.setAttribute('aria-current', 'location');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }
  }

  const requestProgress = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateProgress);
    }
  };

  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress);
  updateProgress();
})();
