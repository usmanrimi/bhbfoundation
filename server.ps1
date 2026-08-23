$port = 8080
$root = "C:\Users\USER\.gemini\antigravity\scratch\bhb-foundation"
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "BHB Foundation server running on http://localhost:$port"

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $writer = [System.IO.StreamWriter]::new($stream)
        $writer.AutoFlush = $true

        $line = $reader.ReadLine()
        if (-not $line) {
            $client.Close()
            continue
        }

        $parts = $line.Split(' ')
        if ($parts.Length -lt 2) {
            $client.Close()
            continue
        }

        $method = $parts[0]
        $rawUrl = $parts[1].Split('?')[0]
        $path = $rawUrl.TrimStart('/')
        if ([string]::IsNullOrEmpty($path) -or $path -eq '/') {
            $path = 'index.html'
        }

        $fullPath = Join-Path $root ($path -replace '/', '\')
        if (-not (Test-Path $fullPath -PathType Leaf)) {
            $fullPath = Join-Path $root 'index.html'
        }

        $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
        $contentType = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.svg'  { 'image/svg+xml' }
            '.json' { 'application/json; charset=utf-8' }
            default { 'application/octet-stream' }
        }

        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $writer.WriteLine("HTTP/1.1 200 OK")
        $writer.WriteLine("Content-Type: $contentType")
        $writer.WriteLine("Content-Length: $($bytes.Length)")
        $writer.WriteLine("Connection: close")
        $writer.WriteLine("Access-Control-Allow-Origin: *")
        $writer.WriteLine("")
        $writer.Flush()

        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Flush()
        $client.Close()
    } catch {
        # continue loop
    }
}
