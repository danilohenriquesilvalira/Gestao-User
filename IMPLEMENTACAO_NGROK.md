# 🚀 IMPLEMENTAÇÃO NGROK - GUIA COMPLETO

## ⚙️ **CONFIGURAÇÃO INICIAL (APENAS UMA VEZ)**

### 1. **Criar arquivo de configuração ngrok:**
Arquivo: `C:\Users\Admin\.ngrok2\ngrok.yml`
```yaml
authtoken: 2fdMurN9l1Ynl2lWlDpAmO1gBw6_7VLuWsBy7nhrzLBNwj8zy
version: "2"
tunnels:
  frontend:
    proto: http
    addr: 3001
  backend:
    proto: http
    addr: 1337
```

### 2. **Configurar CORS no Backend (APENAS UMA VEZ):**
Arquivo: `D:\Servidor_Backup\backend-go\routes\routes.go`
```go
// Configure CORS
config := cors.Config{
    AllowOrigins:     []string{"*"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
    ExposeHeaders:    []string{"Content-Length", "Authorization"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
    AllowWildcard:    false,
}
```

### 3. **Configurar allowedHosts no Frontend (APENAS UMA VEZ):**
Arquivo: `D:\Servidor_Backup\frontend\vite.config.ts`
```typescript
server: {
  port: 3001,
  host: '0.0.0.0',
  allowedHosts: ['localhost', '.ngrok.io', '.ngrok-free.app', '.ngrok.app'],
  hmr: {
    clientPort: 443
  },
  cors: {
    origin: '*',
    credentials: true
  }
},
```

---

## 🔄 **TODA VEZ QUE USAR NGROK:**

### 1. **INICIAR SERVIÇOS:**
```cmd
# Terminal 1 - Frontend
cd D:\Servidor_Backup\frontend
npm run dev

# Terminal 2 - Backend
cd D:\Servidor_Backup\backend-go
go run main.go

# Terminal 3 - Ngrok (os 2 juntos)
ngrok start --all
```

### 2. **PEGAR OS LINKS GERADOS:**
No terminal do ngrok aparecerá:
```
frontend    https://abc123.ngrok-free.app -> http://localhost:3001
backend     https://def456.ngrok-free.app -> http://localhost:1337
```

### 3. **ATUALIZAR 5 ARQUIVOS COM OS NOVOS LINKS:**

#### **📁 Arquivo 1:** `D:\Servidor_Backup\frontend\src\api\auth.ts`
```typescript
// LINHA 6 - Substituir pelo link do BACKEND
? 'https://SEU_LINK_BACKEND_NGROK_AQUI'  // Backend ngrok
```

#### **📁 Arquivo 2:** `D:\Servidor_Backup\frontend\src\api\strapiUsers.ts`
```typescript
// LINHA 5 - Substituir pelo link do BACKEND
? 'https://SEU_LINK_BACKEND_NGROK_AQUI'  // Backend ngrok
```

#### **📁 Arquivo 3:** `D:\Servidor_Backup\frontend\src\api\strapi.ts`
```typescript
// LINHA 6 - Substituir pelo link do BACKEND
? 'https://SEU_LINK_BACKEND_NGROK_AQUI'  // Backend ngrok
```

#### **📁 Arquivo 4:** `D:\Servidor_Backup\frontend\src\pages\LoginPage.tsx`
```typescript
// LINHA 135 - Substituir pelo link do BACKEND
: 'https://SEU_LINK_BACKEND_NGROK_AQUI';
```

#### **📁 Arquivo 5:** `D:\Servidor_Backup\frontend\.env`
```env
VITE_STRAPI_URL=https://SEU_LINK_BACKEND_NGROK_AQUI
```

### 4. **REINICIAR FRONTEND (OBRIGATÓRIO):**
```cmd
# Para o frontend (Ctrl+C)
npm run dev
```

---

## 📋 **EXEMPLO PRÁTICO:**

Se o ngrok gerar:
- Frontend: `https://d460cb3732ef.ngrok-free.app`
- Backend: `https://c009668a8a39.ngrok-free.app`

**Substituir em todos os 5 arquivos:**
```
SEU_LINK_BACKEND_NGROK_AQUI = c009668a8a39.ngrok-free.app
```

**Enviar para cliente:**
```
🔗 Link: https://d460cb3732ef.ngrok-free.app
👤 Login: visitante
🔐 Senha: senha_visitante
```

---

## ⚡ **COMANDOS RÁPIDOS:**

### **Buscar onde trocar os links:**
```cmd
# Buscar todos os localhost:1337 no frontend
grep -r "localhost:1337" D:\Servidor_Backup\frontend\src\
```

### **Verificar se backend funciona:**
```
https://SEU_BACKEND_NGROK/health
```
**Deve retornar:** `{"status":"ok","message":"Backend Go is running"}`

---

## 🚨 **PROBLEMAS COMUNS:**

### **1. Login não funciona:**
- ✅ Verificar se atualizou os 5 arquivos
- ✅ Reiniciar frontend após mudanças
- ✅ Testar backend direto: `/health`

### **2. CORS Error:**
- ✅ Verificar CORS no `routes.go`
- ✅ Reiniciar backend após mudanças

### **3. Host blocked:**
- ✅ Verificar `allowedHosts` no `vite.config.ts`
- ✅ Reiniciar frontend

---

## 📝 **CHECKLIST COMPLETO:**

**Antes de enviar para cliente:**
- [ ] Frontend rodando (`npm run dev`)
- [ ] Backend rodando (`go run main.go`)
- [ ] Ngrok ativo (`ngrok start --all`)
- [ ] 5 arquivos atualizados com novos links
- [ ] Frontend reiniciado após mudanças
- [ ] Testado login localmente
- [ ] Backend `/health` funcionando

---

## 💡 **DICA PRO:**

**Para não atualizar arquivos toda vez, pode usar variável de ambiente:**

### **Windows:**
```cmd
set VITE_STRAPI_URL=https://SEU_BACKEND_NGROK
npm run dev
```

### **PowerShell:**
```powershell
$env:VITE_STRAPI_URL="https://SEU_BACKEND_NGROK"
npm run dev
```

---

**🎯 AGORA É SÓ SEGUIR O PASSO A PASSO TODA VEZ!** 🚀