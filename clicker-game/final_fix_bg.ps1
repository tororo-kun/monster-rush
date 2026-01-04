Add-Type -AssemblyName System.Drawing

$files = @("monster_slime_dark.png", "monster_goblin.png", "monster_skeleton.png")
$tolerance = 30

function Get-ColorDiff($c1, $c2) {
    return [Math]::Abs($c1.R - $c2.R) + [Math]::Abs($c1.G - $c2.G) + [Math]::Abs($c1.B - $c2.B)
}

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
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

        # Use 0,0 as start point (Top Left)
        $p1 = New-Object System.Drawing.Point 0, 0
        $queue.Enqueue($p1)
        $visited[0, 0] = $true

        $bgColor = $outBmp.GetPixel(0, 0)
        
        while ($queue.Count -gt 0) {
            $pt = $queue.Dequeue()
            $x = $pt.X
            $y = $pt.Y
            
            $pixel = $outBmp.GetPixel($x, $y)
            if ((Get-ColorDiff $pixel $bgColor) -lt $tolerance) {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                
                # Neighbor 1: Right
                $nx = $x + 1; $ny = $y
                if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                    if (-not $visited[$nx, $ny]) {
                        $visited[$nx, $ny] = $true; $queue.Enqueue((New-Object System.Drawing.Point $nx, $ny))
                    }
                }
                
                # Neighbor 2: Left
                $nx = $x - 1; $ny = $y
                if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                    if (-not $visited[$nx, $ny]) {
                        $visited[$nx, $ny] = $true; $queue.Enqueue((New-Object System.Drawing.Point $nx, $ny))
                    }
                }
                
                # Neighbor 3: Down
                $nx = $x; $ny = $y + 1
                if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                    if (-not $visited[$nx, $ny]) {
                        $visited[$nx, $ny] = $true; $queue.Enqueue((New-Object System.Drawing.Point $nx, $ny))
                    }
                }
                
                # Neighbor 4: Up
                $nx = $x; $ny = $y - 1
                if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                    if (-not $visited[$nx, $ny]) {
                        $visited[$nx, $ny] = $true; $queue.Enqueue((New-Object System.Drawing.Point $nx, $ny))
                    }
                }
            }
        }

        $newJsonName = $file.Replace(".png", "_final.png")
        $outBmp.Save("$PWD\$newJsonName", [System.Drawing.Imaging.ImageFormat]::Png)
        
        $outBmp.Dispose()
        $bmp.Dispose()
        $ms.Dispose()
        
        Write-Host "  Success: $newJsonName"
    }
    else {
        Write-Host "  File Not Found: $file"
    }
}
