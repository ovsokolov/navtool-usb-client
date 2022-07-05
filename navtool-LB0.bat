@ECHO OFF
del errorflash.log
fcusb_console.exe -SCRIPT -FILE NavTool-LB0.fcs -LOG status.txt -EXIT
IF not %ERRORLEVEL%==0 goto FLASHCAT_ERROR
echo SUCCESS
timeout 2
UV4 -f "C:\Keil_v5\18XX_ALL\18XX_ALL.uvprojx" -t"%1"
goto END
:FLASHCAT_ERROR
echo "FLASHCAT_ERROR">errorflash.log
:END
EXIT 9