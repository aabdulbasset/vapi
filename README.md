
# vapi

A valorant api with several endpoints and MFA implemented.


## Tech Stack

**Server:** Node, Express  
**Database:** Postgres

## -> Deployment

To build this project run

```bash
  npm run build
```

To start this project run

```bash
  npm run start
```
To use tsc-watch run

```bash
  npm run watch
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`  
  
Postgress database url 

## -> API Reference

### Normal Login request

```http
  POST /auth
```

| Body data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Valorant username |
| `password` | `string` | **Required**. Valorant password |

returns tokens if no 2fa otherwise returns a cookie array

#### MFA request

```http
  POST /auth
```

| Body data | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `code`      | `string` | **Required**. MFA code |
| `cookie`      | `array` | **Required**. Cookies list |

returns tokens
### Store 

```http
  POST /store
```

| Body data | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authToken`      | `string` | **Required**. Auth token |
| `entToken`      | `string` | **Required**. Ent token |
| `sub`      | `string` | **Required**. SUB token |

Example response

```
{
    "daily":[{"name":"Elderflame Vandal" , "icon":"link-to-icon"}]
    "hasnight":false
}
```

### Collection 

```http
  POST /skins
```

| Body data | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authToken`      | `string` | **Required**. Auth token |
| `entToken`      | `string` | **Required**. Ent token |
| `sub`      | `string` | **Required**. SUB token |

returns user collection in  
``` 
[
    {"name":"Elderflame Vandal" , "icon":"link-to-icon"},
] 
```
### Settings 

```http
  GET /settings
```

| Body data | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `authToken`      | `string` | **Required**. Auth token |

returns a base64 encoded user settings string