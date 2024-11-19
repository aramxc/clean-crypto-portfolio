package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

// Add cache structure
type CachedData struct {
	Data      []CoinData
	Timestamp time.Time
}

type CoinData struct {
	ID          string  `json:"id"`
	Symbol      string  `json:"symbol"`
	Name        string  `json:"name"`
	Price       float64 `json:"current_price"`
	MarketCap   float64 `json:"market_cap"`
	Volume      float64 `json:"total_volume"`
	PriceChange float64 `json:"price_change_percentage_24h"`
}

var (
	cache     *CachedData
	cacheMux  sync.RWMutex
	cacheTime = 5 * time.Minute
)

func GetTickerList(w http.ResponseWriter, r *http.Request) {
	baseURL := "https://api.coingecko.com/api/v3"

	cachedData, err := loadCachedData(baseURL)
	if err != nil {
		http.Error(w, "Failed to fetch ticker data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cachedData.Data)
}

func loadCachedData(baseURL string) (*CachedData, error) {
	cacheMux.RLock()
	if cache != nil && time.Since(cache.Timestamp) < cacheTime {
		defer cacheMux.RUnlock()
		return cache, nil
	}
	cacheMux.RUnlock()

	// Make request to CoinGecko API
	resp, err := http.Get(fmt.Sprintf("%s/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1", baseURL))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var coins []CoinData
	if err := json.NewDecoder(resp.Body).Decode(&coins); err != nil {
		return nil, err
	}

	// Update cache
	cacheMux.Lock()
	cache = &CachedData{
		Data:      coins,
		Timestamp: time.Now(),
	}
	cacheMux.Unlock()

	return cache, nil
}
