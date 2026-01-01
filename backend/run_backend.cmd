@echo off
setlocal

REM run_backend.cmd
REM Run the FastAPI backend using the backend virtual environment.
REM This avoids "ModuleNotFoundError" issues caused by using the wrong Python.

set "ROOT=%~dp0.."
set "PY=%ROOT%\backend\.venv\Scripts\python.exe"

if not exist "%PY%" (
  echo Backend venv not found: %PY%
  echo Create it by running:
  echo   python -m venv backend\.venv
  echo   backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
  exit /b 1
)

"%PY%" -m uvicorn app.main:app --reload --app-dir "%ROOT%\backend"
