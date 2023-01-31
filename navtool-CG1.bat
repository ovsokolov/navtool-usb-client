@ECHO OFF
del errorflash.log
REM timeout 2
if %2==4 (
	UV4 -f "C:\Keil_v5\17XX_ALL\17XX_ALL\hid_bootloader_UM132CU.uvproj" -t"%1"
) else (
	UV4 -f "C:\Keil_v5\18XX_ALL\18XX_ALL.uvprojx" -t"%1"
)

EXIT 9