package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"
	
	"backend-go/models"
)

// TagCache gerencia cache em memória para alta performance
type TagCache struct {
	tags     map[string]*models.Tag
	mutex    sync.RWMutex
	jsonPath string
	isDirty  bool
	lastSave time.Time
}

var (
	globalTagCache *TagCache
	cacheOnce      sync.Once
)

// GetTagCache retorna instância singleton do cache
func GetTagCache() *TagCache {
	cacheOnce.Do(func() {
		globalTagCache = &TagCache{
			tags:     make(map[string]*models.Tag),
			jsonPath: filepath.Join("data", "tags_cache.json"),
			lastSave: time.Now(),
		}
		
		// Criar diretório se não existir
		if err := os.MkdirAll("data", 0755); err != nil {
			log.Printf("⚠️ Erro ao criar diretório data: %v", err)
		}
		
		// Carregar tags do arquivo JSON
		globalTagCache.loadFromJSON()
		
		// Iniciar goroutine para salvamento automático
		go globalTagCache.autoSaveRoutine()
	})
	
	return globalTagCache
}

// SetTag atualiza valor de um tag no cache (otimizado)
func (tc *TagCache) SetTag(name string, value float64) {
	tc.mutex.Lock()
	defer tc.mutex.Unlock()
	
	if tag, exists := tc.tags[name]; exists {
		// Otimização: só validar se necessário
		if tag.MinValue != nil && value < *tag.MinValue {
			value = *tag.MinValue // Corrigir automaticamente
		}
		if tag.MaxValue != nil && value > *tag.MaxValue {
			value = *tag.MaxValue // Corrigir automaticamente
		}
		
		// Otimização: só atualizar se valor mudou
		if tag.Value != value {
			tag.Value = value
			tag.UpdatedAt = time.Now()
			tc.isDirty = true
		}
	} else {
		// Tag não existe, criar automaticamente
		tc.tags[name] = &models.Tag{
			Name:        name,
			Value:       value,
			Type:        "real",
			Description: fmt.Sprintf("Tag automático: %s", name),
			IsActive:    true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}
		tc.isDirty = true
	}
}

// GetTag recupera valor de um tag do cache
func (tc *TagCache) GetTag(name string) (*models.Tag, bool) {
	tc.mutex.RLock()
	defer tc.mutex.RUnlock()
	
	tag, exists := tc.tags[name]
	if exists {
		// Retornar cópia para evitar modificações externas
		tagCopy := *tag
		return &tagCopy, true
	}
	
	return nil, false
}

// GetAllTags retorna todos os tags do cache
func (tc *TagCache) GetAllTags() map[string]*models.Tag {
	tc.mutex.RLock()
	defer tc.mutex.RUnlock()
	
	result := make(map[string]*models.Tag)
	for name, tag := range tc.tags {
		tagCopy := *tag
		result[name] = &tagCopy
	}
	
	return result
}

// AddTag adiciona novo tag ao cache
func (tc *TagCache) AddTag(tag *models.Tag) error {
	tc.mutex.Lock()
	defer tc.mutex.Unlock()
	
	if _, exists := tc.tags[tag.Name]; exists {
		return fmt.Errorf("tag %s já existe", tag.Name)
	}
	
	tag.CreatedAt = time.Now()
	tag.UpdatedAt = time.Now()
	tc.tags[tag.Name] = tag
	tc.isDirty = true
	
	log.Printf("✅ Tag adicionado: %s", tag.Name)
	return nil
}

// RemoveTag remove tag do cache
func (tc *TagCache) RemoveTag(name string) bool {
	tc.mutex.Lock()
	defer tc.mutex.Unlock()
	
	if _, exists := tc.tags[name]; exists {
		delete(tc.tags, name)
		tc.isDirty = true
		log.Printf("🗑️ Tag removido: %s", name)
		return true
	}
	
	return false
}

// UpdateTag atualiza propriedades de um tag
func (tc *TagCache) UpdateTag(name string, updates map[string]interface{}) error {
	tc.mutex.Lock()
	defer tc.mutex.Unlock()
	
	tag, exists := tc.tags[name]
	if !exists {
		return fmt.Errorf("tag %s não encontrado", name)
	}
	
	// Aplicar atualizações
	if desc, ok := updates["description"].(string); ok {
		tag.Description = desc
	}
	if unit, ok := updates["unit"].(string); ok {
		tag.Unit = unit
	}
	if minVal, ok := updates["min_value"].(float64); ok {
		tag.MinValue = &minVal
	}
	if maxVal, ok := updates["max_value"].(float64); ok {
		tag.MaxValue = &maxVal
	}
	if active, ok := updates["is_active"].(bool); ok {
		tag.IsActive = active
	}
	
	tag.UpdatedAt = time.Now()
	tc.isDirty = true
	
	log.Printf("🔧 Tag atualizado: %s", name)
	return nil
}

// SaveToJSON força salvamento no JSON
func (tc *TagCache) SaveToJSON() error {
	tc.mutex.RLock()
	defer tc.mutex.RUnlock()
	
	data, err := json.MarshalIndent(tc.tags, "", "  ")
	if err != nil {
		return fmt.Errorf("erro ao serializar tags: %v", err)
	}
	
	if err := ioutil.WriteFile(tc.jsonPath, data, 0644); err != nil {
		return fmt.Errorf("erro ao salvar arquivo JSON: %v", err)
	}
	
	tc.lastSave = time.Now()
	tc.isDirty = false
	
	log.Printf("💾 Cache salvo em JSON: %d tags", len(tc.tags))
	return nil
}

// loadFromJSON carrega tags do arquivo JSON
func (tc *TagCache) loadFromJSON() error {
	if _, err := os.Stat(tc.jsonPath); os.IsNotExist(err) {
		log.Printf("📄 Arquivo JSON não existe, iniciando com cache vazio")
		return nil
	}
	
	data, err := ioutil.ReadFile(tc.jsonPath)
	if err != nil {
		return fmt.Errorf("erro ao ler arquivo JSON: %v", err)
	}
	
	if err := json.Unmarshal(data, &tc.tags); err != nil {
		return fmt.Errorf("erro ao deserializar tags: %v", err)
	}
	
	log.Printf("📂 Cache carregado do JSON: %d tags", len(tc.tags))
	return nil
}

// autoSaveRoutine salva automaticamente quando há mudanças
func (tc *TagCache) autoSaveRoutine() {
	ticker := time.NewTicker(5 * time.Second) // Salvar a cada 5 segundos se dirty
	defer ticker.Stop()
	
	for range ticker.C {
		if tc.isDirty && time.Since(tc.lastSave) > 3*time.Second {
			if err := tc.SaveToJSON(); err != nil {
				log.Printf("❌ Erro no salvamento automático: %v", err)
			}
		}
	}
}

// GetStats retorna estatísticas do cache
func (tc *TagCache) GetStats() map[string]interface{} {
	tc.mutex.RLock()
	defer tc.mutex.RUnlock()
	
	activeTags := 0
	for _, tag := range tc.tags {
		if tag.IsActive {
			activeTags++
		}
	}
	
	return map[string]interface{}{
		"total_tags":    len(tc.tags),
		"active_tags":   activeTags,
		"last_save":     tc.lastSave,
		"is_dirty":      tc.isDirty,
		"cache_file":    tc.jsonPath,
	}
}