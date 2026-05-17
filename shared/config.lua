---@class st_spawn.Config
Config = {}

Config.Brand = {
    title    = 'STRATA',
    subtitle = 'CHOOSE YOUR ARRIVAL',
    accent   = '#228BE6',
    version  = 'v1.0.0',
}

Config.MapImage       = './assets/map.jpg'
Config.MapAspectRatio = 1.494

---@type st_spawn.ShowMode
Config.ShowMode = 'always'

Config.CinematicCamera = true
Config.FadeInMs        = 2200

---@type st_spawn.Spawn[]
Config.Spawns = {
    {
        id          = 'paleto',
        name        = 'Paleto Bay',
        district    = 'Blaine County',
        description = 'A coastal town in the far north. Slow pace, strong community, mountain views.',
        image       = './assets/spawn-paleto.jpg',
        coords      = vec4(150.642, 6640.891, 31.572, 166.909),
        map         = { x = 0.179, y = 0.541 },
    },
    {
        id          = 'sandy',
        name        = 'Sandy Shores',
        district    = 'Blaine County',
        description = 'Desert flats, trailer parks, and a long horizon.',
        image       = './assets/spawn-sandy.png',
        coords      = vec4(1989.505, 3779.345, 32.18, 118.298),
        map         = { x = 0.363, y = 0.333 },
    },
    {
        id          = 'vinewood',
        name        = 'Vinewood Hills',
        district    = 'Los Santos',
        description = 'Hilltop neighborhood with sweeping views of the city below.',
        image       = './assets/spawn-vinewood.jpg',
        coords      = vec4(-959.974, 314.868, 70.991, 100.695),
        map         = { x = 0.606, y = 0.583 },
    },
    {
        id          = 'mission_row',
        name        = 'Mission Row',
        district    = 'Los Santos · Downtown',
        description = 'The Mission Row precinct. Central, walkable, surrounded by businesses.',
        image       = './assets/spawn-mission-row.jpeg',
        coords      = vec4(428.99, -983.40, 30.71, 90.0),
        map         = { x = 0.691, y = 0.481 },
    },
    {
        id          = 'grove',
        name        = 'Grove Street',
        district    = 'Los Santos · Davis',
        description = 'South-central. Real, lived-in, no pretense.',
        image       = './assets/spawn-grove.jpeg',
        coords      = vec4(114.83, -1948.13, 20.61, 305.0),
        map         = { x = 0.751, y = 0.524 },
    },
    {
        id          = 'lsia',
        name        = 'Los Santos International',
        district    = 'Los Santos · LSIA',
        description = 'The international terminal. Taxis, rentals, and public transit are minutes away.',
        image       = './assets/spawn-lsia.jpeg',
        coords      = vec4(-1038.0, -2738.0, 20.17, 330.0),
        map         = { x = 0.822, y = 0.665 },
    },
}
