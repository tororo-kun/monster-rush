Add-Type -AssemblyName System.Drawing

$files = @("monster_slime_dark.png", "monster_goblin.png", "monster_skeleton.png")
$tolerance = 25 # High tolerance for noise

function Get-ColorDiff($c1, $c2) {
    return [Math]::Abs($c1.R - $c2.R) + [Math]::Abs($c1.G - $c2.G) + [Math]::Abs($c1.B - $c2.B)
}

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file with Flood Fill..."
        
        $bytes = [System.IO.File]::ReadAllBytes("$PWD\$file")
        $ms = New-Object System.IO.MemoryStream(, $bytes)
        $bmp = [System.Drawing.Bitmap]::FromStream($ms)
        $outBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
        $g = [System.Drawing.Graphics]::FromImage($outBmp)
        $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
        $g.Dispose()
        
        $w = $outBmp.Width
        $h = $outBmp.Height
        $visited = New-Object 'bool[,]' $w, $h
        $queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

        # Start points: 4 corners
        $corners = @(
            New-Object System.Drawing.Point(0, 0),
            New-Object System.Drawing.Point(($w - 1), 0),
            New-Object System.Drawing.Point(0, ($h - 1)),
            New-Object System.Drawing.Point(($w - 1), ($h - 1))
        )

        foreach ($p in $corners) {
            $queue.Enqueue($p)
            $visited[$p.X, $p.Y] = $true
        }

        $bgColor = $outBmp.GetPixel(0, 0)
        Write-Host "  Base BG: $bgColor"

        while ($queue.Count -gt 0) {
            $pt = $queue.Dequeue()
            $x = $pt.X
            $y = $pt.Y
            
            # Check color match
            $pixel = $outBmp.GetPixel($x, $y)
            if ((Get-ColorDiff $pixel $bgColor) -lt $tolerance) {
                # Make transparent
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                
                # Add neighbors
                $neighbors = @(
                    New-Object System.Drawing.Point(($x + 1), $y),
                    New-Object System.Drawing.Point(($x - 1), $y),
                    New-Object System.Drawing.Point($x, ($y + 1)),
                    New-Object System.Drawing.Point($x, ($y - 1))
                )

                foreach ($n in $neighbors) {
                    if ($n.X -ge 0 -and $n.X -lt $w -and $n.Y -ge 0 -and $n.Y -lt $h) {
                        if (-not $visited[$n.X, $n.Y]) {
                            $visited[$n.X, $n.Y] = $true
                            $queue.Enqueue($n)
                        }
                    }
                }
            }
        }

        # Save as _v3 to avoid cache
        $newJsonName = $file.Replace(".png", "_v3.png")
        $outBmp.Save("$PWD\$newJsonName", [System.Drawing.Imaging.ImageFormat]::Png)
        
        $outBmp.Dispose()
        $bmp.Dispose()
        $ms.Dispose()
        
        Write-Host "  Saved $newJsonName"
    }
}
