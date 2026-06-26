@echo off
REM ============================================================
REM  Backup & Restore Script for myGRC Database
REM  Exports your local PostgreSQL DB to a SQL dump file
REM  that can be imported into Railway's managed PostgreSQL.
REM ============================================================

setlocal

REM --- Configuration ---
set CONTAINER_NAME=postgreslocal
set DB_USER=postgres
set DB_NAME=mygrc
set BACKUP_FILE=mygrc_backup.sql

echo.
echo ==========================================
echo   myGRC Database Backup Tool
echo ==========================================
echo.
echo Container : %CONTAINER_NAME%
echo Database  : %DB_NAME%
echo Output    : %BACKUP_FILE%
echo.

REM Step 1: Create the dump
echo [1/3] Creating backup from Docker container...
docker exec %CONTAINER_NAME% pg_dump -U %DB_USER% -d %DB_NAME% --no-owner --no-acl --clean --if-exists > %BACKUP_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backup failed!
    exit /b 1
)
echo       Done: %BACKUP_FILE% created.

REM Step 2: Show file size
for %%A in (%BACKUP_FILE%) do echo [2/3] Backup size: %%~zA bytes

REM Step 3: Instructions
echo [3/3] Backup complete!
echo.
echo ==========================================
echo   NEXT STEPS - Import into Railway
echo ==========================================
echo.
echo 1. Get your Railway PostgreSQL connection string:
echo    - Go to your Railway project dashboard
echo    - Click on your PostgreSQL service
echo    - Copy the "DATABASE_URL" from the Connect tab
echo.
echo 2. Import the backup into Railway:
echo    railway connect
echo    railway run psql -h YOUR_RAILWAY_HOST -U postgres -d railwy -f %BACKUP_FILE%
echo.
echo    OR using psql directly:
echo    psql "%RAILWAY_DATABASE_URL%" -f %BACKUP_FILE%
echo.
echo ==========================================

endlocal
