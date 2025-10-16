# PowerShell script for Windows to install dependencies
Write-Host "🚀 Installing dependencies with React 19 compatibility..." -ForegroundColor Green

try {
    Write-Host "🧹 Cleaning previous installation..." -ForegroundColor Yellow
    
    # Remove node_modules and package-lock.json
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "✅ Removed node_modules" -ForegroundColor Green
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
        Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
    }
    
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    # Try with legacy peer deps first
    try {
        npm install --legacy-peer-deps
        Write-Host "✅ Dependencies installed successfully with --legacy-peer-deps!" -ForegroundColor Green
    } catch {
        Write-Host "🔄 Trying with --force flag..." -ForegroundColor Yellow
        npm install --force
        Write-Host "✅ Dependencies installed successfully with --force!" -ForegroundColor Green
    }
    
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: npm run dev" -ForegroundColor White
    Write-Host "2. Run: npm test (to verify testing setup)" -ForegroundColor White
    Write-Host "3. Run: npm run type-check (to verify TypeScript)" -ForegroundColor White
    Write-Host "`n💡 Note: Some peer dependency warnings are expected with React 19" -ForegroundColor Yellow
    
} catch {
    Write-Host "`n❌ Installation failed!" -ForegroundColor Red
    Write-Host "`n🔧 Manual installation steps:" -ForegroundColor Yellow
    Write-Host "1. Delete node_modules folder and package-lock.json" -ForegroundColor White
    Write-Host "2. Run: npm cache clean --force" -ForegroundColor White
    Write-Host "3. Run: npm install --legacy-peer-deps" -ForegroundColor White
    Write-Host "4. If still failing, try: npm install --force" -ForegroundColor White
    exit 1
}
