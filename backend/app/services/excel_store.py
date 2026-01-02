"""excel_store.py

This file reads the Excel sheets and provides simple functions to:
- find a user by name/displayName
- list that user's activity timeline
- filter the timeline by time range (24h/7d/30d/1y)

We keep Excel logic separate from API routes so the code is easy to follow.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from datetime import timedelta
from typing import Any

import pandas as pd

from app.core.paths import activity_timeline_path, user_info_path


@dataclass(frozen=True)
class Identity:
    name: str
    displayName: str | None
    firstname: str | None
    lastname: str | None
    email: str | None
    location: str | None
    manager_name: str | None
    escalation_manager: str | None


@dataclass(frozen=True)
class Activity:
    name: str
    activity: str | None
    date: str | None
    time: str | None
    activity_detail: str | None


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    # Pandas may represent empty Excel cells as NaN/NaT.
    # Converting those to strings yields "nan", which breaks matching.
    if pd.isna(value):
        return ""
    text = str(value)
    return text.strip()


def _lower(value: Any) -> str:
    return _clean_text(value).lower()


@lru_cache(maxsize=1)
def _load_user_df() -> pd.DataFrame:
    # Read user_info.xlsx once and cache it (fast for repeated searches).
    df = pd.read_excel(user_info_path())
    df.columns = [str(c).strip() for c in df.columns]
    return df


@lru_cache(maxsize=1)
def _load_activity_df() -> pd.DataFrame:
    # Read activity_timeline.xlsx once and cache it.
    df = pd.read_excel(activity_timeline_path())
    df.columns = [str(c).strip() for c in df.columns]

    # Many Excel sheets keep the "name" only on the first row of a block
    # (subsequent rows are blank/merged). Forward-fill so filtering works.
    if "name" in df.columns:
        df["name"] = df["name"].ffill()

    return df


def refresh_cache() -> None:
    # Clear caches so the next request re-reads the Excel files.
    _load_user_df.cache_clear()
    _load_activity_df.cache_clear()


def find_identity(query: str) -> Identity | None:
    # Find the first matching user by exact match, else partial match.
    q = _lower(query)
    if not q:
        return None

    df = _load_user_df().copy()
    # Expected columns (from your sheets):
    # ['name','displayName','firstname','lastname','email','location','manager_name','escalation_manager']

    df["_name_l"] = df["name"].map(_lower)
    if "displayName" in df.columns:
        df["_dn_l"] = df["displayName"].map(_lower)
    else:
        df["_dn_l"] = ""

    # Prefer exact matches first.
    exact = df[(df["_name_l"] == q) | (df["_dn_l"] == q)]
    if len(exact) == 0:
        # Fallback to partial contains.
        partial = df[(df["_name_l"].str.contains(q, na=False)) | (df["_dn_l"].str.contains(q, na=False))]
        if len(partial) == 0:
            return None
        row = partial.iloc[0]
    else:
        row = exact.iloc[0]

    def g(col: str) -> str | None:
        if col not in df.columns:
            return None
        val = row[col]
        txt = _clean_text(val)
        return txt if txt else None

    return Identity(
        name=g("name") or "",
        displayName=g("displayName"),
        firstname=g("firstname"),
        lastname=g("lastname"),
        email=g("email"),
        location=g("location"),
        manager_name=g("manager_name"),
        escalation_manager=g("escalation_manager"),
    )


def list_activities_for_name(name: str) -> list[Activity]:
    df = _load_activity_df().copy()

    df["_name_l"] = df["name"].map(_lower)
    target = _lower(name)
    rows = df[df["_name_l"] == target]

    activities: list[Activity] = []
    for _, r in rows.iterrows():
        activities.append(
            Activity(
                name=_clean_text(r.get("name")),
                activity=_clean_text(r.get("activity")) or None,
                date=_clean_text(r.get("date")) or None,
                time=_clean_text(r.get("time")) or None,
                activity_detail=_clean_text(r.get("activity_detail")) or None,
            )
        )

    # Simple sort: date then time as strings (works for your sheet format).
    activities.sort(key=lambda a: (a.date or "", a.time or ""), reverse=True)
    return activities


def _range_to_timedelta(range_key: str) -> timedelta | None:
    key = _lower(range_key)
    if key in {"24h", "24hr", "24hrs", "1d", "1day"}:
        return timedelta(hours=24)
    if key in {"7d", "7day", "7days"}:
        return timedelta(days=7)
    if key in {"30d", "30day", "30days"}:
        return timedelta(days=30)
    if key in {"1y", "1yr", "1year", "365d"}:
        return timedelta(days=365)
    return None


def _parse_activity_datetimes(df: pd.DataFrame) -> pd.Series:
    # Build a single datetime column from the Excel 'date' + 'time' columns.
    # We keep it resilient because Excel cells can be real datetimes or strings.
    date_part = df.get("date")
    time_part = df.get("time")

    if date_part is None and time_part is None:
        return pd.to_datetime(pd.Series([pd.NaT] * len(df)), errors="coerce")

    if date_part is None:
        combined = time_part.astype(str)
    elif time_part is None:
        combined = date_part.astype(str)
    else:
        combined = date_part.astype(str) + " " + time_part.astype(str)

    return pd.to_datetime(combined, errors="coerce")


def list_activities_for_name_in_range(name: str, range_key: str | None) -> list[Activity]:
    """Return activities filtered to a relative time window.

    The window is calculated from the most recent activity timestamp for that user.
    This makes the filter work even if the Excel data is from the past.
    """
    df = _load_activity_df().copy()
    df["_name_l"] = df["name"].map(_lower)
    rows = df[df["_name_l"] == _lower(name)].copy()

    if len(rows) == 0:
        return []

    delta = _range_to_timedelta(range_key or "")
    if delta is not None:
        dt = _parse_activity_datetimes(rows)
        # Use the latest valid datetime as the reference point.
        ref = dt.dropna().max()
        if pd.notna(ref):
            cutoff = ref - delta
            # Keep rows with missing/unparseable datetime so the UI still shows them.
            rows = rows[dt.isna() | (dt >= cutoff)]

    activities: list[Activity] = []
    for _, r in rows.iterrows():
        activities.append(
            Activity(
                name=_clean_text(r.get("name")),
                activity=_clean_text(r.get("activity")) or None,
                date=_clean_text(r.get("date")) or None,
                time=_clean_text(r.get("time")) or None,
                activity_detail=_clean_text(r.get("activity_detail")) or None,
            )
        )

    activities.sort(key=lambda a: (a.date or "", a.time or ""), reverse=True)
    return activities


def severity_from_activity_text(text: str | None) -> str:
    t = _lower(text)
    if any(k in t for k in ["revoke", "revoked", "violation", "denied", "failed"]):
        return "critical"
    if any(k in t for k in ["high", "warning"]):
        return "high"
    if any(k in t for k in ["modify", "modified", "change", "changed", "update", "updated"]):
        return "medium"
    return "safe"
