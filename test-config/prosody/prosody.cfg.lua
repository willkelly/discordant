-- Prosody XMPP Server Configuration for Testing
-- This is a minimal configuration for running tests

-- Server-wide settings
admins = { "admin@localhost" }

-- Enable useful modules for testing
modules_enabled = {
    -- Generally required
    "roster";           -- Allow users to have a roster (contact list)
    "saslauth";         -- Authentication
    "tls";              -- TLS support
    "dialback";         -- s2s dialback support
    "disco";            -- Service discovery

    -- Nice to have
    "carbons";          -- Keep multiple clients in sync
    "pep";              -- Enables users to publish their avatar, mood, activity, etc.
    "private";          -- Private XML storage (for bookmarks, etc.)
    "blocklist";        -- Allow users to block communications
    "vcard4";           -- User profiles (vcard4)
    "vcard_legacy";     -- Conversion between old and new vCard formats

    -- Admin interfaces
    "admin_adhoc";      -- Allows administration via an XMPP client

    -- HTTP modules
    "bosh";             -- Enable BOSH clients
    "websocket";        -- Enable WebSocket connections
    "http_files";       -- Serve static files from a directory

    -- Other useful modules
    "version";          -- Replies to server version requests
    "uptime";           -- Report how long server has been running
    "time";             -- Let others know the time here
    "ping";             -- Replies to XMPP pings with pongs
    "register";         -- Allow users to register on this server
    "mam";              -- Message Archive Management
}

-- Disable some modules for testing
modules_disabled = {
    -- "offline";       -- Store offline messages
    -- "c2s";           -- Handle client connections
    -- "s2s";           -- Handle server-to-server connections
}

-- Allow registration
allow_registration = true

-- Force clients to use encrypted connections?
c2s_require_encryption = false

-- Force servers to use encrypted connections?
s2s_require_encryption = false

-- Use self-signed certificates for testing
-- In production, use real certificates!
c2s_ssl = {
    certificate = "/etc/prosody/certs/localhost.crt";
    key = "/etc/prosody/certs/localhost.key";
}

-- Logging configuration
log = {
    info = "*console";
}

-- HTTP configuration
http_ports = { 5280 }
http_interfaces = { "*", "::" }
https_ports = { 5281 }
https_interfaces = { "*", "::" }

-- WebSocket configuration
consider_websocket_secure = true
cross_domain_websocket = true

-- VirtualHost configuration
VirtualHost "localhost"
    authentication = "internal_plain"

    -- Allow all users to register
    allow_registration = true
    min_seconds_between_registrations = 0

    -- Create admin user
    -- Note: You still need to register this user manually or via script

-- Component configuration (optional)
-- Component "conference.localhost" "muc"
--     modules_enabled = { "muc_mam" }
--     restrict_room_creation = false

-- Storage configuration (use memory for testing)
storage = "internal"

-- Set the authentication method
authentication = "internal_plain"

-- Disable rate limiting for testing
limits = {
    c2s = {
        rate = "10000kb/s";
    };
    s2sin = {
        rate = "10000kb/s";
    };
}

-- Disable account creation throttling
registration_throttle_max = 100000
registration_throttle_period = 1
