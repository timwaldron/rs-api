# RS-API
Unofficial Old School / RuneScape 3 API written in Node.js using Express.  
This README is still being made.

# How to use
## Endpoints
    https://rs-api.cloud/api/:game/:username

<strong>game</strong> parameters
* osrs
* rs3
## Example
    Endpoint: https://rs-api.cloud/api/osrs/test
    
    {
    "username": "test",
    "combat_level": 126,
      "skills": {
        "overall": {
          "experience": 1038978276,
          "level": 2069,
          "rank": 38455
        },
        "attack": {
          "experience": 109464513,
          "level": 99,
          "rank": 250
        },
        "defence": { ... },
      },
      "...": { ... },
      "...": { ... },
      "...": { ... },
    }

