@echo off
cd /d "%~dp0"
echo Starting Tingo Server...
start http://localhost:3000
node server.js
pause
