#!/usr/bin/env python3
"""
Script universal para atualizar links de tunneling
Funciona com: localhost.run, localtunnel, serveo, cloudflare, etc.
"""

import os
import re
import sys

def update_file(file_path, new_backend_url):
    """Atualiza um arquivo substituindo URLs backend"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Diferentes padrões para diferentes arquivos
        if file_path.endswith('.env'):
            # Para .env
            pattern = r'VITE_STRAPI_URL=.*'
            replacement = f'VITE_STRAPI_URL={new_backend_url}'
        else:
            # Para arquivos .ts/.tsx - busca URLs completas
            # Substitui localhost:1337 OU qualquer URL https existente
            pattern = r'(https?://[^\'"\s]*(?:localhost:1337|ngrok[^\'"\s]*|pinggy[^\'"\s]*|localhost\.run[^\'"\s]*|loca\.lt[^\'"\s]*|serveo[^\'"\s]*))'
            replacement = new_backend_url
        
        updated_content = re.sub(pattern, replacement, content)
        
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        
        print(f"✅ Atualizado: {os.path.basename(file_path)}")
        return True
    except Exception as e:
        print(f"❌ Erro em {os.path.basename(file_path)}: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("❌ USO CORRETO:")
        print("python update_links.py <BACKEND_URL>")
        print()
        print("📝 EXEMPLOS:")
        print("python update_links.py https://abc123.localhost.run")
        print("python update_links.py https://funny-cat-34.loca.lt")  
        print("python update_links.py https://tunnel.serveo.net")
        return
    
    new_backend_url = sys.argv[1].rstrip('/')
    
    print("🔄 ATUALIZADOR UNIVERSAL DE LINKS")
    print("="*50)
    print(f"🔗 Nova URL Backend: {new_backend_url}")
    print()
    
    # 5 arquivos que precisam ser atualizados
    files_to_update = [
        'D:\\Servidor_Backup\\frontend\\src\\api\\auth.ts',
        'D:\\Servidor_Backup\\frontend\\src\\api\\strapiUsers.ts', 
        'D:\\Servidor_Backup\\frontend\\src\\api\\strapi.ts',
        'D:\\Servidor_Backup\\frontend\\src\\pages\\LoginPage.tsx',
        'D:\\Servidor_Backup\\frontend\\.env'
    ]
    
    updated_count = 0
    
    for file_path in files_to_update:
        file_name = os.path.basename(file_path)
        print(f"📁 Atualizando {file_name}...")
        
        if os.path.exists(file_path):
            if update_file(file_path, new_backend_url):
                updated_count += 1
        else:
            print(f"⚠️  Arquivo não encontrado: {file_name}")
    
    print()
    print("="*50)
    print(f"✅ CONCLUÍDO! {updated_count}/5 arquivos atualizados")
    print()
    print("🔄 PRÓXIMOS PASSOS:")
    print("1. Pare o frontend (Ctrl+C)")
    print("2. Reinicie: npm run dev")  
    print("3. Teste login no link do frontend")
    print("4. Verifique /health no backend")
    print()

if __name__ == "__main__":
    main()