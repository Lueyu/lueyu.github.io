$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$zip = Join-Path $root "fc-code.zip"
if (Test-Path $zip) { Remove-Item -Force $zip }
$sources = @("index.js")
# fc/snapshot 不纳入打包：快照内是 AIDR 第三方仓库代码与 lueyu-* 个人笔记等私有材料，
# 而 fc-code.zip 会部署到对公网开放的腾讯云函数——Git 忽略不等于不对外提供。
# index.js 对缺失快照已做优雅降级（list_repo_files 会提示“项目材料还没就位”），
# 如需恢复 AIDR 代码浏览，应先整理脱敏后的公开材料子集，再显式加入 $sources。
tar -caf $zip -C (Join-Path $root "fc") @sources
Write-Output "packed: $zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($zip)
$archive.Entries | ForEach-Object { Write-Output "entry: [$($_.FullName)]" }
$archive.Dispose()
Get-Item $zip | Select-Object Name, Length
