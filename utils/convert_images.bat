@echo off

set SRC=img\src
set DST=img\dst

if not exist %DST% mkdir %DST%
::for %%f in (%SRC%\*) do echo %%~nxf
for %%f in (%SRC%\*) do libwebp\bin\cwebp "%SRC%\%%~nxf" -q 80 -o "%DST%\%%~nxf.webp"

pause