fcusb_console.exe -SCRIPT -FILE NavTool.fcs -LOG status.txt -EXIT
timeout 2
UV4 -f "C:\Keil_v5\18XX_ALL\18XX_ALL.uvprojx" -t"%1"
exit 9