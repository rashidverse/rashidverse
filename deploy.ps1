Write-Host "Starting RashidVerse deployment..." -ForegroundColor Cyan

wsl bash -lc "cd /mnt/c/Users/arclu/Desktop/rashidverse && ./deploy.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Deployment completed successfully." -ForegroundColor Green
Write-Host "https://rashidverse.me" -ForegroundColor Cyan
