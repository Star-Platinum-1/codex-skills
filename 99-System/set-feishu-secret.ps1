$secret = Read-Host "Enter Feishu App Secret (input is hidden)" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    [Environment]::SetEnvironmentVariable("FEISHU_APP_SECRET", $plain, "User")
    $env:FEISHU_APP_SECRET = $plain
    Write-Host "FEISHU_APP_SECRET was set for the current user."
}
finally {
    if ($ptr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
    $plain = $null
}

$node = "C:\Users\13615\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node "D:\codex\obsidian\99-System\feishu-sync.mjs" check
