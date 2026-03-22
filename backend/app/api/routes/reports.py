import csv
import io
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import security
from ...domain import models, schemas
from ...repositories import report_repository

try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    REPORTLAB_AVAILABLE = True
except Exception:
    REPORTLAB_AVAILABLE = False

router = APIRouter()


@router.get("/patient", response_model=schemas.FullReportResponse)
async def get_patient_report(
    days: int = Query(default=7, ge=1, le=365),
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await report_repository.build_report(db, user_id=current_user.id, days=days)


@router.get("/patient/export/csv")
async def export_patient_report_csv(
    days: int = Query(default=7, ge=1, le=365),
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    report = await report_repository.build_report(db, user_id=current_user.id, days=days)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["DEMENTIA CARE - PATIENT REPORT"])
    writer.writerow([f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"])
    writer.writerow([f"Patient ID: {report.patient_id}", f"Period: Last {report.days} days"])
    writer.writerow([])
    writer.writerow(["=== SUMMARY ==="])
    writer.writerow(["Total Activities", report.summary.total_activities])
    writer.writerow(["Avg Activities / Day", report.summary.avg_activities_per_day])
    writer.writerow(["Medication Events", report.summary.medication_count])
    writer.writerow(["Emergency Calls", report.summary.call_count])
    writer.writerow(["Mood Entries", report.summary.mood_count])
    writer.writerow([])
    writer.writerow(["=== MEDICATION ADHERENCE ==="])
    writer.writerow(["Medications Taken", report.medication.taken])
    writer.writerow(["Expected", report.medication.expected])
    writer.writerow(["Adherence Rate (%)", report.medication.rate])
    writer.writerow([])
    writer.writerow(["=== ACTIVITY BREAKDOWN ==="])
    writer.writerow(["Activity Type", "Count"])
    for item in report.activity_breakdown:
        writer.writerow([item.name, item.value])
    writer.writerow([])
    writer.writerow(["=== MOOD DISTRIBUTION ==="])
    writer.writerow(["Mood", "Count"])
    for item in report.mood_distribution:
        writer.writerow([item.mood, item.count])
    writer.writerow([])
    writer.writerow(["=== DAILY ACTIVITY TREND ==="])
    writer.writerow(["Date", "Activities"])
    for item in report.daily_trend:
        writer.writerow([item.date, item.activities])
    writer.writerow([])
    writer.writerow(["=== INSIGHTS ==="])
    for insight in report.insights:
        writer.writerow([f"[{insight.type.upper()}]", insight.message])

    output.seek(0)
    filename = f"patient_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/patient/export/pdf")
async def export_patient_report_pdf(
    days: int = Query(default=7, ge=1, le=365),
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    if not REPORTLAB_AVAILABLE:
        raise HTTPException(status_code=400, detail="PDF export requires reportlab")

    report = await report_repository.build_report(db, user_id=current_user.id, days=days)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.6 * inch, bottomMargin=0.6 * inch)
    styles = getSampleStyleSheet()
    elements = []

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontSize=22,
        textColor=colors.HexColor("#1e40af"),
        spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=16,
    )
    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=13,
        textColor=colors.HexColor("#374151"),
        spaceAfter=6,
        spaceBefore=14,
    )

    elements.append(Paragraph("Dementia Care - Patient Report", title_style))
    elements.append(
        Paragraph(
            f"Patient ID: {report.patient_id} | Period: Last {report.days} days | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            subtitle_style,
        )
    )
    elements.append(HRFlowable(width="100%", color=colors.HexColor("#e5e7eb")))

    summary_data = [
        ["Metric", "Value"],
        ["Total Activities", str(report.summary.total_activities)],
        ["Avg Activities / Day", report.summary.avg_activities_per_day],
        ["Medication Events", str(report.summary.medication_count)],
        ["Emergency Calls", str(report.summary.call_count)],
        ["Mood Entries", str(report.summary.mood_count)],
    ]
    elements.append(Paragraph("Summary", section_style))
    summary_table = Table(summary_data, colWidths=[3.5 * inch, 2 * inch])
    summary_table.setStyle(_table_style())
    elements.append(summary_table)

    med_data = [
        ["Taken", "Expected", "Adherence Rate"],
        [str(report.medication.taken), str(report.medication.expected), f"{report.medication.rate}%"],
    ]
    elements.append(Paragraph("Medication Adherence", section_style))
    med_table = Table(med_data, colWidths=[1.8 * inch, 1.8 * inch, 2 * inch])
    med_table.setStyle(_table_style())
    elements.append(med_table)

    if report.activity_breakdown:
        elements.append(Paragraph("Activity Breakdown", section_style))
        ab_data = [["Activity Type", "Count"]] + [[item.name, str(item.value)] for item in report.activity_breakdown]
        ab_table = Table(ab_data, colWidths=[3.5 * inch, 2 * inch])
        ab_table.setStyle(_table_style())
        elements.append(ab_table)

    if report.insights:
        elements.append(Paragraph("Key Insights", section_style))
        for insight in report.insights:
            elements.append(Paragraph(f"- {insight.message}", styles["Normal"]))
            elements.append(Spacer(1, 4))

    doc.build(elements)
    buffer.seek(0)
    filename = f"patient_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


def _table_style() -> TableStyle:
    return TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e40af")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f3f4f6")]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("FONTSIZE", (0, 1), (-1, -1), 10),
        ]
    )
