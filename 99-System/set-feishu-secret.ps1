$secret = Read-Host "请输入飞书 App Secret（输入时不会显示）" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    [Environment]::SetEnvironmentVariable("FEISHU_APP_SECRET", $plain, "User")
    $env:FEISHU_APP_SECRET = $plain
    Write-Host "已写入当前用户环境变量 FEISHU_APP_SECRET。"
} finally {
    if ($ptr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
    $plain = $null
}

$node = "C:\Users\13615\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node "D:\codex\obsidian\99-System\feishu-sync.mjs" check
