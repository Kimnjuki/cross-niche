Get-ChildItem -Recurse -File | Sort-Object Length -Descending | Select-Object -First 20 | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    Write-Host "$sizeMB MB - $($_.FullName)"
}
