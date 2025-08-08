/**
 * Script para migrar configurações do localStorage para PostgreSQL
 * Execute no Console do navegador (F12) para migrar dados existentes
 */

async function migrateLocalStorageToPostgres() {
  console.log('🚀 Iniciando migração localStorage → PostgreSQL...');
  
  const baseURL = window.location.origin.includes('localhost') 
    ? 'http://localhost:1337' 
    : process?.env?.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  
  // Lista todos os componentes no localStorage
  const componentKeys = Object.keys(localStorage).filter(key => key.startsWith('component-'));
  
  console.log(`📋 Encontrados ${componentKeys.length} componentes no localStorage`);
  
  let migratedCount = 0;
  let errorCount = 0;
  
  for (const key of componentKeys) {
    try {
      const componentId = key.replace('component-', '');
      const configString = localStorage.getItem(key);
      
      if (!configString) continue;
      
      const configs = JSON.parse(configString);
      console.log(`📦 Migrando ${componentId}...`);
      
      // Para cada breakpoint no config
      for (const [breakpoint, config] of Object.entries(configs)) {
        const strapiBreakpoint = breakpoint === '2xl' ? 'xxl' : 
                                breakpoint === '3xl' ? 'xxxl' : 
                                breakpoint === '4xl' ? 'xxxxl' : breakpoint;
        
        // Verifica se já existe
        const checkResponse = await fetch(
          `${baseURL}/api/component-layouts?filters[componentId][$eq]=${componentId}&filters[breakpoint][$eq]=${strapiBreakpoint}`
        );
        
        if (!checkResponse.ok) {
          console.warn(`⚠️ Erro ao verificar ${componentId} - ${breakpoint}`);
          continue;
        }
        
        const checkData = await checkResponse.json();
        const existingEntry = checkData?.data && checkData.data.length > 0 ? checkData.data[0] : null;
        
        const configData = {
          componentId,
          breakpoint: strapiBreakpoint,
          x: Number(config.x) || 74,
          y: Number(config.y) || 70,
          width: Number(config.width) || 400,
          height: Number(config.height) || 200,
          scale: Number(config.scale) || 1,
          zIndex: Number(config.zIndex) || 1,
          opacity: Number(config.opacity) || 1,
          rotation: Number(config.rotation) || 0
        };
        
        let saveResponse;
        
        if (existingEntry?.documentId) {
          // Atualiza
          saveResponse = await fetch(`${baseURL}/api/component-layouts/${existingEntry.documentId}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ data: configData })
          });
          console.log(`🔄 ${componentId} - ${breakpoint}: ATUALIZADO`);
        } else {
          // Cria
          saveResponse = await fetch(`${baseURL}/api/component-layouts`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ data: configData })
          });
          console.log(`🆕 ${componentId} - ${breakpoint}: CRIADO`);
        }
        
        if (saveResponse.ok) {
          migratedCount++;
        } else {
          console.error(`❌ Erro ao salvar ${componentId} - ${breakpoint}:`, saveResponse.status);
          errorCount++;
        }
        
        // Pequeno delay para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      console.error(`❌ Erro ao migrar ${key}:`, error);
      errorCount++;
    }
  }
  
  console.log(`✅ Migração concluída:`);
  console.log(`   📊 ${migratedCount} configurações migradas`);
  console.log(`   ❌ ${errorCount} erros`);
  
  if (migratedCount > 0) {
    console.log(`🧹 Você pode limpar o localStorage agora se quiser:`);
    console.log(`   componentKeys.forEach(key => localStorage.removeItem(key))`);
  }
}

// Para executar a migração, chame:
// migrateLocalStorageToPostgres();

console.log('🛠️ Script de migração carregado. Execute: migrateLocalStorageToPostgres()');
