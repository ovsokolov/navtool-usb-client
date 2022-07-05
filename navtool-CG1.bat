@ECHO OFF
del errorflash.log
REM timeout 2
UV4 -f "C:\Keil_v5\18XX_ALL\18XX_ALL.uvprojx" -t"%1"

EXIT 9