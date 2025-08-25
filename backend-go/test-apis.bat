@echo off
echo.
echo 🧪 Testando APIs do Backend Go
echo =============================
echo.

echo 📊 1. Testando Health Check...
curl -s http://localhost:1337/health
echo.
echo.

echo 📋 2. Testando Component Layouts...
curl -s http://localhost:1337/api/component-layouts | jq .
echo.
echo.

echo 👥 3. Testando User Roles...
curl -s http://localhost:1337/api/user-manager/roles | jq .
echo.
echo.

echo 👤 4. Testando Users List...
curl -s http://localhost:1337/api/user-manager/users | jq .
echo.
echo.

echo 🎯 5. Testando Criação de Usuário...
curl -s -X POST http://localhost:1337/api/user-manager/create ^
     -H "Content-Type: application/json" ^
     -d "{\"username\":\"teste\",\"email\":\"teste@edp.pt\",\"password\":\"123456\",\"role\":1}" | jq .
echo.
echo.

echo ✅ Testes concluídos!
echo.
pause