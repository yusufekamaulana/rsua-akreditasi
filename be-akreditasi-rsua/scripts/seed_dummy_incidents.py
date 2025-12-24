"""Seed dummy incidents for each department.

Usage (dari folder backend):
    docker compose exec api python scripts/seed_dummy_incidents.py
"""

from datetime import datetime, timedelta
import random

from sqlmodel import Session, select

from src.app.db import engine
from src.app.models.department import Department
from src.app.models.user import User
from src.app.models.location import Location  # noqa: F401  # ensure Location is registered
from src.app.models.incident import (
    Incident,
    IncidentStatus,
    IncidentCategory,
    IncidentGrading,
    AgeGroup,
    Gender,
    PayerType,
    ReporterType,
    IncidentPlace,
    IncidentSubject,
    PatientContext,
    SKPCode,
    MDPCode,
    ResponderRole,
)


def pick_reporter_for_department(session: Session, dept_id: int) -> User | None:
    """Pilih satu user di department ini sebagai reporter (prioritas perawat, lalu pj, lalu siapa saja)."""
    users = session.exec(
        select(User).where(User.department_id == dept_id)
    ).all()
    if not users:
        return None

    perawat_users = [u for u in users if any(r.name == "perawat" for r in u.roles)]
    pj_users = [u for u in users if any(r.name == "pj" for r in u.roles)]

    if perawat_users:
        return random.choice(perawat_users)
    if pj_users:
        return random.choice(pj_users)
    return random.choice(users)


def age_to_group(age: int) -> AgeGroup:
    if age <= 1:
        return AgeGroup.BAYI
    if age <= 5:
        return AgeGroup.BALITA
    if age <= 12:
        return AgeGroup.ANAK
    if age <= 18:
        return AgeGroup.REMAJA
    if age <= 60:
        return AgeGroup.DEWASA
    return AgeGroup.LANSIA


def run(min_per_dept: int = 3, max_per_dept: int = 10) -> None:
    with Session(engine) as session:
        departments = session.exec(select(Department)).all()
        if not departments:
            print("No departments found. Run scripts/seed.py first.")
            return

        total_created = 0

        for dept in departments:
            reporter = pick_reporter_for_department(session, dept.id)
            if reporter is None:
                print(f"[skip] No users found for department '{dept.name}' (id={dept.id})")
                continue

            # Tentukan reporter_type berdasarkan role user
            if any(r.name == "perawat" for r in reporter.roles):
                reporter_type = ReporterType.PERAWAT
            elif any(r.name == "pj" for r in reporter.roles):
                reporter_type = ReporterType.PETUGAS
            else:
                reporter_type = ReporterType.LAIN

            num_for_dept = random.randint(min_per_dept, max_per_dept)

            for i in range(num_for_dept):
                age = random.randint(1, 80)
                age_group = age_to_group(age)
                gender = random.choice([Gender.L, Gender.P])
                payer_type = random.choice([PayerType.UMUM, PayerType.BPJS_MANDIRI, PayerType.SKTM])
                occurred_at = datetime.utcnow() - timedelta(days=random.randint(0, 60))
                admission_at = occurred_at - timedelta(days=random.randint(0, 3))
                incident_place = random.choice(list(IncidentPlace))
                skp_code = random.choice(list(SKPCode))
                mdp_code = random.choice(list(MDPCode))
                incident_subject = IncidentSubject.PASIEN
                patient_context = random.choice(list(PatientContext))
                responder_roles = [ResponderRole.TIM.value]  # sesuai contoh: ["tim"]
                has_similar_event = random.choice([True, False])
                harm_indicator = random.choice(["ringan", "sedang", "berat"])
                final_category = random.choice(list(IncidentCategory))
                predicted_category = final_category
                predicted_confidence = round(random.uniform(0.5, 0.95), 3)
                grading = random.choice(list(IncidentGrading))

                patient_name = f"Pasien {i + 1} {dept.name}"
                patient_identifier = f"PID-{dept.id:03d}-{i + 1:04d}"

                incident = Incident(
                    reporter_id=reporter.id,
                    patient_name=patient_name,
                    patient_identifier=patient_identifier,
                    reporter_type=reporter_type,
                    age=age,
                    age_group=age_group,
                    gender=gender,
                    payer_type=payer_type,
                    admission_at=admission_at,
                    occurred_at=occurred_at,
                    incident_place=incident_place,
                    skp_code=skp_code,
                    mdp_code=mdp_code,
                    incident_subject=incident_subject,
                    patient_context=patient_context,
                    responder_roles=responder_roles,
                    immediate_action="Tindakan segera dilakukan sesuai prosedur.",
                    has_similar_event=has_similar_event,
                    department_id=dept.id,
                    free_text_description=f"Dummy incident {i + 1} untuk unit {dept.name}.",
                    harm_indicator=harm_indicator,
                    final_category=final_category,
                    last_category_editor_id=reporter.id,
                    predicted_category=predicted_category,
                    predicted_confidence=predicted_confidence,
                    model_version="dummy-seed-1.0",
                    grading=grading,
                    status=IncidentStatus.DRAFT,
                )

                session.add(incident)
                total_created += 1

            print(f"[ok] Created {num_for_dept} incidents for department '{dept.name}'")

        session.commit()
        print(f"Total incidents created: {total_created}")


if __name__ == "__main__":
    run()
