# backend-43340

## Run Project

To run project:

```bash
npm run dev
```

## Clase 6

Urls to check:

http://localhost:8080/products

http://localhost:8080/realtimeproducts

## Clase 13

Urls to check:

http://localhost:8080/api/auth/login

http://localhost:8080/api/sessions/current

http://localhost:8080/login --> GITHUB login passport strategy

## Clase 16

Una vez que el usuario se loguea se le crea un carrito si es que ya no tiene uno existente, esto lo hace la view products con un js custom.

Para probar en POSTMAN las validaciones de isAdmin, etc, primero hacer un login desde el browser
http://localhost:8080/api/auth/login

Si hace falta registrarse ir a:
http://localhost:8080/api/auth/register

y copiar desde la consola/applications/storage/cookies el valor de la variable connect.sid, ejemplo de valor generado: s%3AxjBoLDVbU8rjPPFLtASEbz7O3VSl89b6.C2oGst5mvj3No%2B0TgH4rpdjNGRNpp6frPYBp9R0toqI

Luego ir a Postman/Environment Quick Look (icono arriba a la derecha con ojito) y settear la variable global connect.sid del entorno creado para el host con dicho valor, para que las apis actuen con esa sesion

Para llenar el carrito generado para el usuario logguead, con productos, llamar a la api PUT
http://localhost:8080/api/carts/{cartId}
Y por body enviarle el array de productos con sus cantidades, ejemplo:
{
"prodsArray": [
{
"prodId": "648bae59b7b670f1a3a09660",
"quantity": 10
},
{
"prodId": "648bae59b7b670f1a3a09664",
"quantity": 5
},
{
"prodId": "648bae59b7b670f1a3a09668",
"quantity": 2
}
]
}

En esta instancia contamos con un carrito con productos, y se puede llamar a la api POST:
http://localhost:8080/api/carts/{cartId}/purchase

## Clase 17

Nuevo endpoint:
http://localhost:8080/api/products/mockingproducts


## Clase 18

Nuevo endpoint:
http://localhost:8080/loggerTest


## Clase 19

Nuevo endpoint:
http://localhost:8080/api/recovers/email

Se agregó la funcionalidad Premium y Owner


