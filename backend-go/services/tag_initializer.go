package services

import (
	"fmt"
	"log"
	"backend-go/models"
)

// InitializeDefaultTags cria todos os tags padrão do sistema WebSocket atual
func InitializeDefaultTags() {
	cache := GetTagCache()
	
	defaultTags := []*models.Tag{
		// NÍVEIS DE ÁGUA
		{
			Name:        "nivelCaldeiraValue",
			Type:        "real",
			Offset:      0,
			Description: "Nível de água da caldeira principal",
			Unit:        "%",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       75.0,
		},
		{
			Name:        "nivelMontanteValue", 
			Type:        "real",
			Offset:      2,
			Description: "Nível de água montante",
			Unit:        "%",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       68.0,
		},
		{
			Name:        "nivelJusanteValue",
			Type:        "real", 
			Offset:      4,
			Description: "Nível de água jusante",
			Unit:        "%",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       82.0,
		},
		
		// PORTAS
		{
			Name:        "eclusaPortaMontanteValue",
			Type:        "real",
			Offset:      6,
			Description: "Abertura percentual da porta montante",
			Unit:        "%", 
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		{
			Name:        "eclusaPortaJusanteValue",
			Type:        "real",
			Offset:      8,
			Description: "Abertura percentual da porta jusante", 
			Unit:        "%",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		{
			Name:        "portaMontanteValue",
			Type:        "real",
			Offset:      10,
			Description: "Status da porta montante",
			Unit:        "%",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		
		// MOTORES E CONTROLES
		{
			Name:        "motorValue",
			Type:        "real",
			Offset:      12,
			Description: "Status do motor principal",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		{
			Name:        "motorDireitoValue",
			Type:        "real",
			Offset:      14,
			Description: "Motor direito - porta jusante",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		{
			Name:        "motorEsquerdoValue",
			Type:        "real",
			Offset:      16,
			Description: "Motor esquerdo - porta jusante",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		{
			Name:        "contrapesoDirectoValue",
			Type:        "real",
			Offset:      18,
			Description: "Contrapeso direto",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		{
			Name:        "contrapesoEsquerdoValue",
			Type:        "real",
			Offset:      20,
			Description: "Contrapeso esquerdo",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(100),
			IsActive:    true,
			Value:       0.0,
		},
		
		// RADAR
		{
			Name:        "radarDistanciaValue",
			Type:        "real",
			Offset:      22,
			Description: "Distância detectada pelo radar",
			Unit:        "m",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(50),
			IsActive:    true,
			Value:       12.5,
		},
		
		// STATUS DA ECLUSA
		{
			Name:        "comunicacaoPLCValue",
			Type:        "bool",
			Offset:      24,
			Description: "Status da comunicação com PLC",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(1),
			IsActive:    true,
			Value:       1,
		},
		{
			Name:        "operacaoValue",
			Type:        "bool",
			Offset:      26,
			Description: "Sistema em operação",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(1),
			IsActive:    true,
			Value:       1,
		},
		{
			Name:        "alarmesAtivoValue",
			Type:        "bool",
			Offset:      28,
			Description: "Alarmes ativos no sistema",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(1),
			IsActive:    true,
			Value:       0,
		},
		{
			Name:        "emergenciaAtivaValue",
			Type:        "bool",
			Offset:      30,
			Description: "Emergência ativa",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(1),
			IsActive:    true,
			Value:       0,
		},
		{
			Name:        "inundacaoValue",
			Type:        "bool",
			Offset:      32,
			Description: "Detecção de inundação",
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(1),
			IsActive:    true,
			Value:       0,
		},
	}
	
	// SEMÁFOROS [0..11]
	for i := 0; i < 12; i++ {
		defaultTags = append(defaultTags, &models.Tag{
			Name:        fmt.Sprintf("semaforo_%d", i),
			Type:        "int",
			Offset:      float64(34 + i*2),
			Description: fmt.Sprintf("Semáforo %d (0=vermelho, 1=amarelo, 2=verde)", i),
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(2),
			IsActive:    true,
			Value:       0,
		})
	}
	
	// PIPE SYSTEM [0..23]
	for i := 0; i < 24; i++ {
		defaultTags = append(defaultTags, &models.Tag{
			Name:        fmt.Sprintf("pipe_system_%d", i),
			Type:        "bool",
			Offset:      float64(60 + i),
			Description: fmt.Sprintf("Pipe System %d - Estado da tubulação", i),
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(1),
			IsActive:    true,
			Value:       0,
		})
	}
	
	// VÁLVULAS ONOFF [0..5]
	for i := 0; i < 6; i++ {
		defaultTags = append(defaultTags, &models.Tag{
			Name:        fmt.Sprintf("valvulas_onoff_%d", i),
			Type:        "int",
			Offset:      float64(85 + i*2),
			Description: fmt.Sprintf("Válvula OnOff %d", i),
			Unit:        "",
			MinValue:    floatPtr(0),
			MaxValue:    floatPtr(3),
			IsActive:    true,
			Value:       0,
		})
	}
	
	// Adicionar todos os tags ao cache
	addedCount := 0
	for _, tag := range defaultTags {
		if err := cache.AddTag(tag); err == nil {
			addedCount++
		} else {
			log.Printf("⚠️ Tag %s já existe ou erro: %v", tag.Name, err)
		}
	}
	
	// Forçar salvamento
	if err := cache.SaveToJSON(); err != nil {
		log.Printf("❌ Erro ao salvar tags padrão: %v", err)
	} else {
		log.Printf("✅ Tags padrão inicializados: %d novos tags adicionados", addedCount)
	}
}

// Helper function para criar ponteiro float64
func floatPtr(f float64) *float64 {
	return &f
}

