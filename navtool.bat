@ECHO OFF
del errorflash.log
fcusb_console.exe -SCRIPT -FILE NavTool.fcs -LOG status.txt -EXIT
IF not %ERRORLEVEL%==0 goto FLASHCAT_ERROR
echo SUCCESS
timeout 2
if %2==4 (
	UV4 -f "C:\Keil_v5\17XX_ALL\17XX_ALL\hid_bootloader_UM132CU.uvproj" -t"%1"
) else (
	UV4 -f "C:\Keil_v5\18XX_ALL\18XX_ALL.uvprojx" -t"%1"
)
goto END
:FLASHCAT_ERROR
echo "FLASHCAT_ERROR">errorflash.log
:END
EXIT 9