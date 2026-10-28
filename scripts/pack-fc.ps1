$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$zip = Join-Path $root "fc-code.zip"
if (Test-Path $zip) { Remove-Item -Force $zip }
tar -caf $zip -C (Join-Path $root "fc") index.js
Write-Output "packed: $zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($zip)
$archive.Entries | ForEach-Object { Write-Output "entry: [$($_.FullName)]" }
$archive.Dispose()
Get-Item $zip | Select-Object Name, Length
