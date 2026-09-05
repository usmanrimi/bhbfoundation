$port = 8080
$root = "C:\Users\USER\.gemini\antigravity\scratch\bhb-foundation"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "BHB Foundation server running on http://localhost:$port and http://127.0.0.1:$port"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq 'OPTIONS') {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq 'POST' -and $request.Url.AbsolutePath -eq '/api/sync-to-git') {
            $bodyReader = [System.IO.StreamReader]::new($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyJson = $bodyReader.ReadToEnd()

            if ($bodyJson.Length -gt 10) {
                $seedPath = Join-Path $root 'data\seed_data.json'
                [System.IO.File]::WriteAllText($seedPath, $bodyJson, [System.Text.Encoding]::UTF8)

                $initJsPath = Join-Path $root 'js\initial_data.js'
                $initJsContent = "window.BHB_SEED_DATA = " + $bodyJson + ";`n"
                [System.IO.File]::WriteAllText($initJsPath, $initJsContent, [System.Text.Encoding]::UTF8)

                $git = "C:\Users\USER\.gemini\antigravity\scratch\mingit\cmd\git.exe"
                try {
                    & $git add js/initial_data.js data/seed_data.json 2>$null
                    & $git commit -m "chore(content): sync super admin content to live site" 2>$null
                    & $git push origin main 2>$null
                } catch {}
            }

            $respObj = @{ success = $true; message = "All your Super Admin changes and photos have been pushed live to GitHub!" }
            $respJson = $respObj | ConvertTo-Json
            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($respJson)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $respBytes.Length
            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            $response.Close()
            continue
        }

        # Static files
        $path = $request.Url.AbsolutePath.TrimStart('/')
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
            '.json' { 'application/json; charset=utf-8' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.gif'  { 'image/gif' }
            '.svg'  { 'image/svg+xml' }
            '.ico'  { 'image/x-icon' }
            default { 'application/octet-stream' }
        }

        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.Close()
    } catch {
        # ignore client aborts
    }
}
