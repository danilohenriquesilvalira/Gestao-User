@echo off
echo.
echo 🚀 Instalação Completa Backend Go - EDP Portugal
echo ==============================================
echo.

REM Verificar se Go está instalado
go version >nul 2>&1
if errorlevel 1 (
    echo ❌ Go não está instalado!
    echo.
    echo 📥 Baixando Go...
    echo Vá para: https://golang.org/dl/
    echo Baixe: go1.21.x.windows-amd64.msi
    echo Instale e reinicie o terminal
    echo.
    pause
    exit /b 1
)

echo ✅ Go encontrado: 
go version

echo.
echo 📁 Verificando diretório...
if not exist "go.mod" (
    echo ❌ go.mod não encontrado! Criando projeto...
    go mod init backend-go
    echo ✅ go.mod criado
) else (
    echo ✅ go.mod existe
)

echo.
echo 📦 Instalando TODAS as dependências...
echo    - Gin framework...
go get github.com/gin-gonic/gin@v1.9.1

echo    - CORS middleware...
go get github.com/gin-contrib/cors@v1.4.0

echo    - GORM ORM...
go get gorm.io/gorm@v1.25.5

echo    - PostgreSQL driver...
go get gorm.io/driver/postgres@v1.5.4

echo    - JWT tokens...
go get github.com/golang-jwt/jwt/v4@v4.5.0

echo    - Crypto (bcrypt)...
go get golang.org/x/crypto@v0.17.0

echo    - Environment variables...
go get github.com/joho/godotenv@v1.5.1

echo.
echo 🔄 Verificando e baixando dependências indiretas...
go mod tidy

echo.
echo 📋 Verificando dependências instaladas...
go list -m all

echo.
echo ✅ INSTALAÇÃO COMPLETA!
echo.
echo 🎯 Próximos passos:
echo    1. Verificar .env (configurações do banco)
echo    2. Executar: start.bat
echo.
pause