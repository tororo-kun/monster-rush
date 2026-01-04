Add-Type -AssemblyName System.Drawing

$files = @("monster_slime_dark.png", "monster_goblin.png", "monster_skeleton.png")
$tolerance = 10 # Allow slight variation in color

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..."
        
        $bytes = [System.IO.File]::ReadAllBytes("$PWD\$file")
        $ms = New-Object System.IO.MemoryStream(, $bytes)
        $bmp = [System.Drawing.Bitmap]::FromStream($ms)
        $outBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
        $g = [System.Drawing.Graphics]::FromImage($outBmp)
        $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
        $g.Dispose()

        # Get target bg color from top-left
        $bgColor = $outBmp.GetPixel(0, 0)
        Write-Host "  Target BG: $bgColor"

        for ($x = 0; $x -lt $outBmp.Width; $x++) {
            for ($y = 0; $y -lt $outBmp.Height; $y++) {
                $pixel = $outBmp.GetPixel($x, $y)
                
                # Calculate distance
                $diff = [Math]::Abs($pixel.R - $bgColor.R) + [Math]::Abs($pixel.G - $bgColor.G) + [Math]::Abs($pixel.B - $bgColor.B)
                
                if ($diff -lt $tolerance) {
                    $outBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                }
            }
        }

        # Save overwriting the previous _transparent attempt
        $newJsonName = $file.Replace(".png", "_transparent.png")
        $outBmp.Save("$PWD\$newJsonName", [System.Drawing.Imaging.ImageFormat]::Png)
        
        $outBmp.Dispose()
        $bmp.Dispose()
        $ms.Dispose()
        
        Write-Host "  Saved adjusted transparent image: $newJsonName"
    }
}
