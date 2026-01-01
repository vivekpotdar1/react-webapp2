"""paths.py

Small helper functions for building absolute file paths.
We keep paths in one place so other files don't hard-code directories.
"""

from __future__ import annotations

from pathlib import Path


def repo_root() -> Path:
    # We compute repo root by walking up from this file:
    # backend/app/core/paths.py -> backend/app/core -> backend/app -> backend -> repo
    return Path(__file__).resolve().parents[3]


def input_data_dir() -> Path:
    return repo_root() / "input_data_sheets"


def user_info_path() -> Path:
    return input_data_dir() / "user_info.xlsx"


def activity_timeline_path() -> Path:
    # Excel file containing user activity timeline.
    return input_data_dir() / "activity_timeline.xlsx"
