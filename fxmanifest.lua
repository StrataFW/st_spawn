fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'st_spawn'
author 'Strata Framework'
description 'Strata spawn selector — runs after character pick for new characters (or always, per config).'
version '1.0.0'
repository 'https://github.com/StrataFW/st_spawn'

shared_scripts {
    '@ox_lib/init.lua',
    'shared/types.lua',
    'shared/config.lua',
}

client_scripts {
    'client/camera.lua',
    'client/intro.lua',
    'client/main.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    '@ox_core/lib/init.lua',
    '@st_log/lib/init.lua',
    'server/db.lua',
    'server/identity.lua',
    'server/selector.lua',
    'server/main.lua',
}

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/*',
}

dependencies {
    'ox_lib',
    'ox_core',
}
