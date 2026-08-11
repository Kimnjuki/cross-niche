Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap(1200, 630)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(15, 23, 42))

$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(59, 130, 246))
$g.FillRectangle($brush, 50, 50, 200, 200)

$font = New-Object System.Drawing.Font("Arial", 48, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString("The Grid Nexus", $font, $textBrush, 300, 100)

$subFont = New-Object System.Drawing.Font("Arial", 24)
$g.DrawString("Tech + Security + Gaming Intelligence", $subFont, $textBrush, 300, 170)

$g.Dispose()
$bmp.Save("public/og-image.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Write-Host "og-image.jpg generated successfully"
