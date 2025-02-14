@echo off &setlocal
setlocal enabledelayedexpansion

set "search1=<<NAME>>"
set "search2=<<BARCODE>>"
set "replace1=%~1"
set "replace2=%~2"
set "textfile=qrcode1.txt"
set "newfile=qroutput.txt"
IF EXIST %newfile%  del %newfile%
(for /f "delims=" %%i in (%textfile%) do (
    set "line=%%i"
    set "line=!line:%search1%=%replace1%!"
    set "line=!line:%search2%=%replace2%!"
    echo(!line!
))>"%newfile%"
COPY /B C:\navtool\usbclient\navtool-usb-client\qroutput.txt \\DESKTOP-4GAMS74\ZPLPRINTER
endlocal
exit