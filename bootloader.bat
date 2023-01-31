@ECHO OFF
IF %1=="UMA" (
	UV4 -f "C:\Keil_v5\18XX_ALL\18XX_ALL.uvprojx" -t"UMBTLR"
) ELSE (
	UV4 -f "C:\Keil_v5\17XX_ALL\17XX_ALL\hid_bootloader_UM132CU.uvproj" -t"UMBTLR"
)
EXIT 9