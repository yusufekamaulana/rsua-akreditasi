"""Seed default roles, departments, and users."""

import re

from sqlmodel import Session, select

from src.app.db import engine
from src.app.models.location import Location  # noqa: F401  # ensure Location is registered
from src.app.models.department import Department
from src.app.models.role import Role
from src.app.models.user import User
from src.app.security.passwords import hash_password

DEFAULT_ROLES = {
    "perawat": "Perawat - dapat membuat laporan insiden",
    "pj": "Penanggung jawab unit - review awal (kepala departemen)",
    "mutu": "Tim mutu - review lanjutan",
    "admin": "Administrator sistem",
}

DEFAULT_DEPARTMENTS = [
    "ICU",
    "NICU",
    "PICU",
    "ICCU–STROKE UNIT",
    "RAWAT INAP",
    "IRNA 3 RSUA",
    "IRNA 3A RSKI",
    "IRNA 4 RSUA (PEDIATRI)",
    "IRNA 5 RSUA",
    "IRNA 5A RSKI",
    "IRNA 6 RSUA",
    "IRNA 6A RSUA",
    "IRNA 6A RSKI",
    "IRNA 7 RSUA",
    "IRNA 7B RSKI",
    "OK",
    "CATH LAB",
    "LABORATORIUM",
    "RADIOLOGI",
    "DIALISIS–HEMODIALISA",
    "INSTALASI GAWAT DARURAT",
    "POLI REHAB MEDIK",
    "POLI MATA",
    "POLI PENYAKIT DALAM",
    "POLI PENYAKIT DALAM – ENDOKRIN",
    "POLI IHAN – TROPIK INFEKSI",
    "POLI KEMOTERAPI",
]


def _slugify_for_email(name: str) -> str:
    """Buat slug sederhana untuk bagian lokal email dari nama departemen."""
    value = name.strip().lower()
    value = value.replace("–", "-")
    value = re.sub(r"[^a-z0-9]+", ".", value)
    value = value.strip(".")
    return value or "dept"


def run() -> None:
    with Session(engine) as session:
        # Seed roles
        existing_roles = {role.name for role in session.exec(select(Role)).all()}
        for name, description in DEFAULT_ROLES.items():
            if name not in existing_roles:
                session.add(Role(name=name, description=description))
        session.commit()

        # Seed departments
        existing_departments_by_name = {
            d.name: d for d in session.exec(select(Department)).all()
        }
        for name in DEFAULT_DEPARTMENTS:
            if name not in existing_departments_by_name:
                dept = Department(name=name, description=name)
                session.add(dept)
        session.commit()

        # Refresh map departments setelah commit
        existing_departments_by_name = {
            d.name: d for d in session.exec(select(Department)).all()
        }

        # Seed admin user
        admin = session.exec(
            select(User).where(User.email == "admin@rsua.id")
        ).one_or_none()
        if not admin:
            admin_role = session.exec(
                select(Role).where(Role.name == "admin")
            ).one()
            admin = User(
                email="admin@rsua.id",
                full_name="System Admin",
                hashed_password=hash_password("Admin123!"),
                is_active=True,
            )
            admin.roles.append(admin_role)
            session.add(admin)
            session.commit()

        # Seed mutu (tanpa department, global)
        mutu = session.exec(
            select(User).where(User.email == "mutu@rsua.id")
        ).one_or_none()
        if not mutu:
            mutu_role = session.exec(
                select(Role).where(Role.name == "mutu")
            ).one()
            mutu = User(
                email="mutu@rsua.id",
                full_name="User Mutu",
                hashed_password=hash_password("Mutu123!"),
                is_active=True,
                department_id=None,  # eksplisit null
            )
            mutu.roles.append(mutu_role)
            session.add(mutu)
            session.commit()


        # Seed default perawat & PJ (kepala departemen) untuk tiap departemen
        for dept_name, dept in existing_departments_by_name.items():
            slug = _slugify_for_email(dept_name)

            # Perawat di departemen ini
            perawat_email = f"perawat.{slug}@rsua.id"
            perawat_user = session.exec(
                select(User).where(User.email == perawat_email)
            ).one_or_none()
            if not perawat_user:
                perawat_role = session.exec(
                    select(Role).where(Role.name == "perawat")
                ).one()
                perawat_user = User(
                    email=perawat_email,
                    full_name=f"Perawat {dept_name}",
                    hashed_password=hash_password("Perawat123!"),
                    is_active=True,
                    department_id=dept.id,
                )
                perawat_user.roles.append(perawat_role)
                session.add(perawat_user)

            # PJ (kepala departemen) di departemen ini
            pj_email = f"pj.{slug}@rsua.id"
            pj_user = session.exec(
                select(User).where(User.email == pj_email)
            ).one_or_none()
            if not pj_user:
                pj_role = session.exec(
                    select(Role).where(Role.name == "pj")
                ).one()
                pj_user = User(
                    email=pj_email,
                    full_name=f"PJ Unit {dept_name}",
                    hashed_password=hash_password("PjUnit123!"),
                    is_active=True,
                    department_id=dept.id,
                )
                pj_user.roles.append(pj_role)
                session.add(pj_user)

        session.commit()


if __name__ == "__main__":
    run()
