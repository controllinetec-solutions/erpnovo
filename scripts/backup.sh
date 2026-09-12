#!/bin/bash

# ============================================
# ERP Lite - Script de Backup Automático
# ============================================

# Configurações
BACKUP_DIR="/backups/erp-lite"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
DB_NAME="erp_lite"
DB_USER="erp_user"
CONTAINER_NAME="erp-lite-postgres-1"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================
# FUNÇÕES
# ============================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker não encontrado. Instale o Docker primeiro."
        exit 1
    fi
}

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log_info "Criando diretório de backup: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

backup_database() {
    log_info "Iniciando backup do banco de dados..."
    
    BACKUP_FILE="$BACKUP_DIR/erp_lite_$DATE.sql.gz"
    
    # Verificar se o container está rodando
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        log_error "Container PostgreSQL não está rodando"
        exit 1
    fi
    
    # Executar backup
    docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        log_info "Backup criado com sucesso: $BACKUP_FILE"
        log_info "Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
    else
        log_error "Falha ao criar backup"
        exit 1
    fi
}

backup_uploads() {
    log_info "Iniciando backup de uploads..."
    
    UPLOADS_DIR="./uploads"
    UPLOADS_BACKUP="$BACKUP_DIR/uploads_$DATE.tar.gz"
    
    if [ -d "$UPLOADS_DIR" ]; then
        tar -czf "$UPLOADS_BACKUP" "$UPLOADS_DIR"
        log_info "Backup de uploads criado: $UPLOADS_BACKUP"
    else
        log_warn "Diretório de uploads não encontrado, pulando..."
    fi
}

cleanup_old_backups() {
    log_info "Limpando backups antigos (mais de $RETENTION_DAYS dias)..."
    
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
    
    log_info "Limpeza concluída"
}

list_backups() {
    log_info "Backups disponíveis:"
    ls -lh "$BACKUP_DIR" | grep -E "\.(sql|tar)\.gz$"
}

verify_backup() {
    log_info "Verificando integridade do último backup..."
    
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql.gz | head -1)
    
    if [ -f "$LATEST_BACKUP" ]; then
        gunzip -t "$LATEST_BACKUP" 2>/dev/null
        if [ $? -eq 0 ]; then
            log_info "Backup válido: $LATEST_BACKUP"
        else
            log_error "Backup corrompido: $LATEST_BACKUP"
            exit 1
        fi
    else
        log_warn "Nenhum backup encontrado para verificar"
    fi
}

# ============================================
# EXECUÇÃO PRINCIPAL
# ============================================

main() {
    log_info "=========================================="
    log_info "ERP Lite - Backup Automático"
    log_info "Data: $(date)"
    log_info "=========================================="
    
    check_dependencies
    create_backup_dir
    backup_database
    backup_uploads
    cleanup_old_backups
    verify_backup
    
    log_info "=========================================="
    log_info "Backup concluído com sucesso!"
    log_info "=========================================="
    
    list_backups
}

# Executar função principal
main "$@"
