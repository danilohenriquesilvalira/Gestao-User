@echo off
echo.
echo 🚀 Iniciando Backend Go - EDP Portugal
echo ======================================
echo.

REM Verificar se Go está instalado
go version >nul 2>&1
if errorlevel 1 (
    echo ❌ Go não está instalado!
    echo.
    echo 📥 Execute install.bat primeiro para instalar tudo!
    echo.
    pause
    exit /b 1
)

echo ✅ Go encontrado: 
go version

REM Verificar se dependências estão instaladas
if not exist "go.sum" (
    echo ❌ Dependências não instaladas!
    echo.
    echo 📥 Execute install.bat primeiro!
    echo.
    pause
    exit /b 1
)

echo.
echo 📦 Verificando dependências...
go mod verify
if errorlevel 1 (
    echo ⚠️ Reinstalando dependências...
    go mod tidy
)

echo.
echo 🔄 Executando migração de dados do Strapi...
go run migrate/migrate_strapi_data.go
if errorlevel 1 (
    echo ⚠️ Migração falhou, mas servidor pode iniciar mesmo assim
)

echo.
echo 🚀 Iniciando servidor na porta 1337...
echo.
echo 🔗 APIs disponíveis:
echo    http://localhost:1337/health
echo    http://localhost:1337/api/component-layouts
echo    http://localhost:1337/api/user-manager/users
echo.
echo ⏹️  Pressione Ctrl+C para parar o servidor
echo.

go run main.go