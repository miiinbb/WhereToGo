function sanitizeFilenamePart(value) {
  return normalizeString(value)
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function getDateStamp() {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function getDetailedPlansDocxFilename() {
  return `WHERE_TO_GO_TravelPlan_${getDateStamp()}.docx`;
}

function getDetailedPlansPdfFilename() {
  return `WHERE_TO_GO_TravelPlan_${getDateStamp()}.pdf`;
}

function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setExportButtonLoading(button, isLoading, label = "다운로드 중") {
  if (!button) return;

  if (isLoading) {
    if (!button.dataset.originalHtml) {
      button.dataset.originalHtml = button.innerHTML;
    }

    button.classList.add("is-loading");
    button.disabled = true;
    button.innerHTML = `
      <span class="button-loading-text">${escapeHtml(label)}</span>
      <span class="button-loading-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;
    return;
  }

  button.classList.remove("is-loading");
  button.disabled = false;

  if (button.dataset.originalHtml) {
    button.innerHTML = button.dataset.originalHtml;
    delete button.dataset.originalHtml;
  }
}

function getDocxRuntime() {
  const runtime = window.docx;
  if (!runtime?.Document || !runtime?.Packer) {
    throw new Error("DOCX 도구를 불러오지 못했습니다.");
  }
  return runtime;
}

function getJsPdfRuntime() {
  const runtime = window.jspdf?.jsPDF || window.jsPDF;
  if (!runtime) {
    throw new Error("PDF 도구를 불러오지 못했습니다.");
  }
  return runtime;
}

function wrapPdfText(ctx, text, maxWidth) {
  const source = normalizeString(text);
  if (!source) return [""];

  const lines = [];
  let currentLine = "";

  for (const char of source) {
    if (char === "\n") {
      if (currentLine) lines.push(currentLine);
      currentLine = "";
      continue;
    }

    const trialLine = currentLine + char;
    if (ctx.measureText(trialLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char === " " ? "" : char;
      continue;
    }

    currentLine = trialLine;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [""];
}

function drawWrappedPdfText(ctx, text, x, y, maxWidth, options = {}) {
  const {
    fontSize = 24,
    fontWeight = 400,
    fontFamily = '"Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif',
    lineHeight = 1.45,
    color = "#2e2736"
  } = options;

  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "top";

  const lines = wrapPdfText(ctx, text, maxWidth);
  const step = Math.round(fontSize * lineHeight);

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * step);
  });

  ctx.restore();

  return Math.max(step * lines.length, fontSize);
}

function estimatePdfTextHeight(ctx, text, maxWidth, options = {}) {
  const {
    fontSize = 24,
    fontWeight = 400,
    fontFamily = '"Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif',
    lineHeight = 1.45
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const lines = wrapPdfText(ctx, text, maxWidth);
  ctx.restore();

  return Math.max(Math.round(fontSize * lineHeight) * lines.length, fontSize);
}

async function createDetailedPlansDocxBlob(plans) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    VerticalAlign
  } = getDocxRuntime();
  const children = [];
  const revisionSummary = normalizeString(appState.revisionSummary);
  const fontName = "Malgun Gothic";
  const lineColor = "E4D8EB";

  const createTextRun = (text, options = {}) => new TextRun({
    text: normalizeString(text),
    font: fontName,
    ...options
  });

  const createParagraph = (text, options = {}) => new Paragraph({
    children: [createTextRun(text, options)],
    spacing: { after: 120 }
  });

  const createHeaderCell = (text, width) => new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 90, bottom: 90, left: 90, right: 90 },
    shading: { fill: "F5EDF7" },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: lineColor },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: lineColor },
      left: { style: BorderStyle.SINGLE, size: 1, color: lineColor },
      right: { style: BorderStyle.SINGLE, size: 1, color: lineColor }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [createTextRun(text, { bold: true, size: 20 })]
      })
    ]
  });

  const createBodyCell = (text, width, options = {}) => new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 90, bottom: 90, left: 90, right: 90 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: lineColor },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: lineColor },
      left: { style: BorderStyle.SINGLE, size: 1, color: lineColor },
      right: { style: BorderStyle.SINGLE, size: 1, color: lineColor }
    },
    children: [
      new Paragraph({
        alignment: options.align || AlignmentType.LEFT,
        children: [createTextRun(text || "-", { size: 20, ...options.run })]
      })
    ]
  });

  children.push(
    new Paragraph({
      children: [createTextRun("WHERE TO GO?", { bold: true, size: 30 })],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 }
    })
  );

  children.push(
    new Paragraph({
      children: [createTextRun("Travel Plan", { bold: true, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 }
    })
  );

  children.push(
    new Paragraph({
      children: [
        createTextRun(`생성일: ${new Date().toLocaleDateString("ko-KR")}`, {
          size: 18,
          color: "6f6a78"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 }
    })
  );

  if (revisionSummary) {
    children.push(
      new Paragraph({
        children: [
          createTextRun("수정 요약: ", { bold: true, size: 20 }),
          createTextRun(revisionSummary, { size: 20 })
        ],
        spacing: { after: 160 }
      })
    );
  }

  normalizeArray(plans).forEach((plan, planIndex) => {
    const first = planIndex === 0;
    children.push(
      new Paragraph({
        children: [createTextRun(`선택된 Option ${plan.label}`, { bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: !first,
        spacing: { after: 80 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          createTextRun("여행지: ", { bold: true, size: 20 }),
          createTextRun(`${normalizeString(plan.country) || "-"} · ${normalizeString(plan.city) || "-"}`, { size: 20 })
        ],
        spacing: { after: 60 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          createTextRun("기간: ", { bold: true, size: 20 }),
          createTextRun(normalizeString(plan.duration) || "미정", { size: 20 })
        ],
        spacing: { after: 60 }
      })
    );

    children.push(
      new Paragraph({
        children: [createTextRun("날씨", { bold: true, size: 20 })],
        spacing: { after: 40 }
      })
    );

    children.push(createParagraph(`날씨 요약: ${normalizeString(plan.weather.summary) || "-"}`, { size: 20 }));
    children.push(createParagraph(`기온: ${normalizeString(plan.weather.temperature) || "-"}`, { size: 20 }));
    children.push(createParagraph(`강수: ${normalizeString(plan.weather.rainLevel) || "-"}`, { size: 20 }));
    children.push(createParagraph(`복장: ${normalizeString(plan.weather.outfitNote) || "-"}`, { size: 20 }));

    normalizeArray(plan.itinerary).forEach((day, dayIndex) => {
      children.push(
        new Paragraph({
          children: [createTextRun(getDetailDayLabel(day, dayIndex), { bold: true, size: 22 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 120, after: 60 }
        })
      );

      const scheduleRows = [
        new TableRow({
          children: [
            createHeaderCell("Time", 18),
            createHeaderCell("Place", 27),
            createHeaderCell("Activity", 35),
            createHeaderCell("Move", 20)
          ]
        }),
        ...normalizeArray(day?.schedule).map((item) => new TableRow({
          children: [
            createBodyCell(normalizeString(item.time) || "-", 18),
            createBodyCell(normalizeString(item.place) || "-", 27),
            createBodyCell(normalizeString(item.activity) || "-", 35),
            createBodyCell(normalizeString(item.move) || "-", 20)
          ]
        }))
      ];

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: scheduleRows
        })
      );
    });
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: fontName,
            size: 20
          }
        }
      }
    },
    sections: [{ children }]
  });

  return Packer.toBlob(doc);
}

function createPdfPage(width = 1240, height = 1754) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("PDF 캔버스를 만들지 못했습니다.");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  return { canvas, ctx };
}

async function createDetailedPlansPdfBlob(plans) {
  const jsPDF = getJsPdfRuntime();
  const pageWidth = 1240;
  const pageHeight = 1754;
  const pxPerMm = pageWidth / 210;
  const margin = Math.round(20 * pxPerMm);
  const innerWidth = pageWidth - margin * 2;
  const bottomY = pageHeight - margin;
  const pages = [];
  let page = createPdfPage(pageWidth, pageHeight);
  let canvas = page.canvas;
  let ctx = page.ctx;
  const revisionSummary = normalizeString(appState.revisionSummary);
  let cursorY = margin;

  const addPage = () => {
    pages.push(canvas.toDataURL("image/png"));
    page = createPdfPage(pageWidth, pageHeight);
    canvas = page.canvas;
    ctx = page.ctx;
    cursorY = margin;
  };

  const drawRule = (y) => {
    ctx.save();
    ctx.strokeStyle = "#e7dbea";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(pageWidth - margin, y);
    ctx.stroke();
    ctx.restore();
  };

  const drawDocumentHeader = () => {
    ctx.fillStyle = "#7f778a";
    ctx.font = '700 18px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText("WHERE TO GO?", margin, cursorY);
    cursorY += 28;

    ctx.fillStyle = "#2e2736";
    ctx.font = '700 40px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText("Travel Plan", margin, cursorY);
    cursorY += 52;

    ctx.fillStyle = "#7f778a";
    ctx.font = '700 16px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText(`생성일 ${new Date().toLocaleDateString("ko-KR")}`, margin, cursorY);
    cursorY += 30;

    if (revisionSummary) {
      cursorY += drawWrappedPdfText(ctx, `수정 요약: ${revisionSummary}`, margin, cursorY, innerWidth, {
        fontSize: 18,
        fontWeight: 500,
        lineHeight: 1.45,
        color: "#4a4454"
      }) + 18;
    }

    drawRule(cursorY);
    cursorY += 22;
  };

  const drawOptionHeader = (plan, continuation = false) => {
    ctx.fillStyle = "#7f778a";
    ctx.font = '700 18px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText(continuation ? `옵션 ${plan.label} · 계속` : `선택된 Option ${plan.label}`, margin, cursorY);
    cursorY += continuation ? 26 : 28;

    if (!continuation) {
      ctx.fillStyle = "#2e2736";
      ctx.font = '700 34px "Noto Sans KR", "Malgun Gothic", sans-serif';
      ctx.fillText(`${plan.country} · ${plan.city}`, margin, cursorY);
      cursorY += 44;

      ctx.fillStyle = "#7f778a";
      ctx.font = '700 18px "Noto Sans KR", "Malgun Gothic", sans-serif';
      ctx.fillText(`기간 ${normalizeString(plan.duration) || "미정"}`, margin, cursorY);
      cursorY += 28;

      const weatherLines = [
        `날씨 요약: ${normalizeString(plan.weather.summary) || "-"}`,
        `기온: ${normalizeString(plan.weather.temperature) || "-"}`,
        `강수: ${normalizeString(plan.weather.rainLevel) || "-"}`,
        `복장: ${normalizeString(plan.weather.outfitNote) || "-"}`
      ];

      weatherLines.forEach((line) => {
        cursorY += drawWrappedPdfText(ctx, line, margin, cursorY, innerWidth, {
          fontSize: 18,
          fontWeight: 500,
          lineHeight: 1.35,
          color: "#4a4454"
        }) + 8;
      });

      drawRule(cursorY);
      cursorY += 18;
    } else {
      drawRule(cursorY);
      cursorY += 18;
    }
  };

  const drawTableHeader = () => {
    const columns = [
      { label: "시간", width: innerWidth * 0.16 },
      { label: "장소", width: innerWidth * 0.28 },
      { label: "활동", width: innerWidth * 0.36 },
      { label: "이동", width: innerWidth * 0.20 }
    ];
    const headerHeight = 34;
    let x = margin;

    columns.forEach((column) => {
      ctx.save();
      ctx.fillStyle = "#faf6fc";
      ctx.strokeStyle = "#e7dbea";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(x, cursorY, column.width, headerHeight);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#6f6a78";
      ctx.font = '700 15px "Noto Sans KR", "Malgun Gothic", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(column.label, x + column.width / 2, cursorY + headerHeight / 2 + 1);
      x += column.width;
    });

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    cursorY += headerHeight;
  };

  const measureTableRowHeight = (item) => {
    const columns = [
      { text: normalizeString(item.time) || "-", width: innerWidth * 0.16, fontSize: 16, fontWeight: 700 },
      { text: normalizeString(item.place) || "-", width: innerWidth * 0.28, fontSize: 16, fontWeight: 400 },
      { text: normalizeString(item.activity) || "-", width: innerWidth * 0.36, fontSize: 16, fontWeight: 400 },
      { text: normalizeString(item.move) || "-", width: innerWidth * 0.20, fontSize: 16, fontWeight: 400 }
    ];

    return Math.max(
      28,
      ...columns.map((column) => estimatePdfTextHeight(ctx, column.text, column.width - 12, {
        fontSize: column.fontSize,
        fontWeight: column.fontWeight,
        lineHeight: 1.35
      }) + 10)
    );
  };

  const drawTableRow = (item, rowHeight) => {
    const columns = [
      { text: normalizeString(item.time) || "-", width: innerWidth * 0.16, fontSize: 16, fontWeight: 700 },
      { text: normalizeString(item.place) || "-", width: innerWidth * 0.28, fontSize: 16, fontWeight: 400 },
      { text: normalizeString(item.activity) || "-", width: innerWidth * 0.36, fontSize: 16, fontWeight: 400 },
      { text: normalizeString(item.move) || "-", width: innerWidth * 0.20, fontSize: 16, fontWeight: 400 }
    ];

    let x = margin;
    columns.forEach((column, index) => {
      ctx.save();
      ctx.fillStyle = index === 0 ? "#ffffff" : "#fffdfd";
      ctx.strokeStyle = "#e7dbea";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.rect(x, cursorY, column.width, rowHeight);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      drawWrappedPdfText(ctx, column.text, x + 6, cursorY + 7, column.width - 12, {
        fontSize: column.fontSize,
        fontWeight: column.fontWeight,
        lineHeight: 1.35,
        color: "#2e2736"
      });
      x += column.width;
    });

    cursorY += rowHeight;
  };

  const drawDaySection = (plan, day, dayIndex) => {
    const dayLabel = getDetailDayLabel(day, dayIndex);
    ctx.fillStyle = "#2e2736";
    ctx.font = '700 28px "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.fillText(dayLabel, margin, cursorY);
    cursorY += 38;

    drawTableHeader();

    const scheduleItems = normalizeArray(day?.schedule);
    const rows = scheduleItems.length ? scheduleItems : [{ time: "-", place: "-", activity: "-", move: "-" }];

    rows.forEach((item) => {
      const rowHeight = measureTableRowHeight(item);
      if (cursorY + rowHeight > bottomY) {
        addPage();
        drawOptionHeader(plan, true);
        ctx.fillStyle = "#2e2736";
        ctx.font = '700 28px "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillText(dayLabel, margin, cursorY);
        cursorY += 38;
        drawTableHeader();
      }

      drawTableRow(item, rowHeight);
    });

    cursorY += 18;
  };

  drawDocumentHeader();

  normalizeArray(plans).forEach((plan, planIndex) => {
    if (planIndex > 0) {
      addPage();
    }

    drawOptionHeader(plan, false);
    normalizeArray(plan?.itinerary).forEach((day, dayIndex) => {
      const estimatedDayHeight = 84 + normalizeArray(day?.schedule).reduce((sum, item) => sum + measureTableRowHeight(item), 0);
      if (cursorY + estimatedDayHeight > bottomY) {
        addPage();
        drawOptionHeader(plan, true);
      }

      drawDaySection(plan, day, dayIndex);
    });
  });

  pages.push(canvas.toDataURL("image/png"));

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4"
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pages.forEach((pageImage, index) => {
    if (index > 0) {
      pdf.addPage();
    }
    pdf.addImage(pageImage, "PNG", 0, 0, pdfWidth, pdfHeight);
  });

  return pdf.output("blob");
}
