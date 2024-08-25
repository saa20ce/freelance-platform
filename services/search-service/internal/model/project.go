package model

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type ProjectStatus string

const (
    StatusCreated    ProjectStatus = "CREATED"
    StatusInProgress ProjectStatus = "IN_PROGRESS"
    StatusPaused     ProjectStatus = "PAUSED"
    StatusCompleted  ProjectStatus = "COMPLETED"
)

type Project struct {
    ID              uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Title           string         `gorm:"type:varchar(55);not null" json:"title"`
    Description     string         `gorm:"type:text;not null" json:"description"`
    Category        string         `gorm:"type:varchar(50);not null" json:"category"`
    Price           float64        `gorm:"type:numeric;not null" json:"price"`
    AllowHigherPrice bool          `gorm:"not null" json:"allow_higher_price"`
    CreatedAt       time.Time      `gorm:"not null;autoCreateTime" json:"created_at"`
    UpdatedAt       time.Time      `gorm:"not null;autoUpdateTime" json:"updated_at"`
    UserID          uint           `gorm:"not null" json:"user_id"`
    Status          ProjectStatus  `gorm:"type:varchar(20);not null" json:"status"`
}

func (p *Project) BeforeCreate(tx *gorm.DB) (err error) {
    p.ID = uuid.New()
    return
}

func (p *Project) BeforeUpdate(tx *gorm.DB) (err error) {
    p.UpdatedAt = time.Now()
    return
}
