#!/bin/bash
# Helper script to manage the XMPP test server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.test.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

start_server() {
    log_info "Starting XMPP test server..."

    # Generate certificates if they don't exist
    if [ ! -f "$PROJECT_DIR/test-config/prosody/certs/localhost.crt" ]; then
        log_info "Generating SSL certificates..."
        bash "$PROJECT_DIR/test-config/prosody/generate-certs.sh"
    fi

    # Start the server
    docker compose -f "$COMPOSE_FILE" up -d

    log_info "Waiting for server to be ready..."
    sleep 5

    # Wait for health check
    for i in {1..30}; do
        if docker compose -f "$COMPOSE_FILE" ps | grep -q "healthy"; then
            log_info "XMPP test server is ready!"
            log_info "WebSocket endpoint: ws://localhost:5280/xmpp-websocket"
            log_info "Client port: localhost:5222"
            return 0
        fi
        sleep 1
    done

    log_warn "Server started but health check not confirmed"
    return 0
}

stop_server() {
    log_info "Stopping XMPP test server..."
    docker compose -f "$COMPOSE_FILE" down
    log_info "XMPP test server stopped"
}

restart_server() {
    stop_server
    start_server
}

show_logs() {
    docker compose -f "$COMPOSE_FILE" logs -f
}

create_user() {
    local username="$1"
    local password="$2"

    if [ -z "$username" ] || [ -z "$password" ]; then
        log_error "Usage: $0 create-user <username> <password>"
        exit 1
    fi

    log_info "Creating user: $username@localhost"
    docker compose -f "$COMPOSE_FILE" exec xmpp prosodyctl register "$username" localhost "$password"
    log_info "User created successfully"
}

delete_user() {
    local username="$1"

    if [ -z "$username" ]; then
        log_error "Usage: $0 delete-user <username>"
        exit 1
    fi

    log_info "Deleting user: $username@localhost"
    docker compose -f "$COMPOSE_FILE" exec xmpp prosodyctl deluser "$username@localhost"
    log_info "User deleted successfully"
}

list_users() {
    log_info "Registered users on localhost:"
    docker compose -f "$COMPOSE_FILE" exec xmpp prosodyctl registered localhost
}

server_status() {
    if docker compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_info "XMPP test server is running"
        docker compose -f "$COMPOSE_FILE" ps
        echo ""
        log_info "WebSocket endpoint: ws://localhost:5280/xmpp-websocket"
        log_info "Client port: localhost:5222"
    else
        log_warn "XMPP test server is not running"
    fi
}

setup_test_users() {
    log_info "Setting up test users..."
    create_user "testuser1" "password123" 2>/dev/null || true
    create_user "testuser2" "password123" 2>/dev/null || true
    create_user "alice" "alicepass" 2>/dev/null || true
    create_user "bob" "bobpass" 2>/dev/null || true
    create_user "admin" "admin123" 2>/dev/null || true
    log_info "Test users created"
}

show_help() {
    cat << EOF
XMPP Test Server Management Script

Usage: $0 <command> [options]

Commands:
    start               Start the XMPP test server
    stop                Stop the XMPP test server
    restart             Restart the XMPP test server
    status              Show server status
    logs                Show server logs (follow mode)
    create-user         Create a new user: $0 create-user <username> <password>
    delete-user         Delete a user: $0 delete-user <username>
    list-users          List all registered users
    setup-test-users    Create default test users (testuser1, testuser2, alice, bob, admin)
    help                Show this help message

Examples:
    $0 start
    $0 create-user john password123
    $0 logs

Server Endpoints:
    WebSocket:  ws://localhost:5280/xmpp-websocket
    Client:     localhost:5222
    HTTP:       http://localhost:5280

EOF
}

# Main command handling
case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        server_status
        ;;
    logs)
        show_logs
        ;;
    create-user)
        create_user "$2" "$3"
        ;;
    delete-user)
        delete_user "$2"
        ;;
    list-users)
        list_users
        ;;
    setup-test-users)
        setup_test_users
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
