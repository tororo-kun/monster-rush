Add-Type -AssemblyName System.Drawing

$files = @("monster_slime_dark.png", "monster_goblin.png", "monster_skeleton.png")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Load image
        # Using a stream to avoid file locking issues if we overwrite (though we are saving as new)
        $bytes = [System.IO.File]::ReadAllBytes("$PWD\$file")
        $ms = New-Object System.IO.MemoryStream(,$bytes)
        $bmp = [System.Drawing.Bitmap]::FromStream($ms)

        # Get background color from top-left pixel
        $bgColor = $bmp.GetPixel(0, 0)
        Write-Host "  Background Color: $bgColor"

        # Make transparent
        $bmp.MakeTransparent($bgColor)

        # Save as new file
        $newJsonName = $file.Replace(".png", "_transparent.png")
        $bmp.Save("$PWD\$newJsonName", [System.Drawing.Imaging.ImageFormat]::Png)
        
        $bmp.Dispose()
        $ms.Dispose()
        
        Write-Host "  Saved as $newJsonName"
    } else {
        Write-Host "  File not found: $file"
    }
}
