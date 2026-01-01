"""API routes.

These endpoints are what the React frontend calls.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.services.excel_store import (
    find_identity,
    list_activities_for_name_in_range,
    severity_from_activity_text,
)

router = APIRouter(prefix="/api")


@router.get("/identity")
def get_identity(query: str, range: str | None = None):
    """Search a user by name or displayName and return identity + filtered timeline.

    - query: name or displayName from user_info.xlsx
    - range: time window like 24h / 7d / 30d / 1y
    """
    identity = find_identity(query)
    if identity is None:
        raise HTTPException(status_code=404, detail="User not found")

    activities = list_activities_for_name_in_range(identity.name, range)

    # Normalize timeline items for the frontend.
    timeline = []
    for idx, a in enumerate(activities):
        title = a.activity or "Activity"
        when = " ".join([p for p in [a.date, a.time] if p])
        timeline.append(
            {
                "id": f"evt-{idx}",
                "title": title,
                "time": when or "",
                "severity": severity_from_activity_text(title),
                "description": a.activity_detail or "",
                "meta": "",
            }
        )

    return {
        "identity": {
            "name": identity.name,
            "displayName": identity.displayName,
            "firstname": identity.firstname,
            "lastname": identity.lastname,
            "email": identity.email,
            "location": identity.location,
            "manager_name": identity.manager_name,
            "escalation_manager": identity.escalation_manager,
        },
        "timeline": timeline,
    }


@router.post("/refresh")
def refresh():
    """Clear cached Excel reads.

    Useful when the XLSX files are updated while the server is running.
    """
    from app.services.excel_store import refresh_cache

    refresh_cache()
    return {"status": "ok"}
