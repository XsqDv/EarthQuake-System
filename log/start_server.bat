@echo off
title Deprem Uyarı Sistemi - XsqDev
color 0a

:: Node.js sunucu başlatılıyor
echo [SERVER] server.js başlatılıyor...
start cmd /k "node server.js"

echo Tum sistem baslatildi. Tarayicidan http://localhost:3000 adresine gidin!
pause
