---
title: "Load Testing con Locust"
pubDate: "2026-09-15"
description: "Mi introduccion al Framework Locust."
author: "RossySpike"
category: "2-testing"
tags: ["programacion", "load test", "python", "locust", "tutorial"]
---

# Desarrollando pruebas con Locust

## Por que?

Tengo un [proyecto](https://github.com/RossySpike/hermit-purple) secundario para
guardar imagenes en un `home lab`, escribi todo el parseo de `http` por cuenta propia
(**en C btw**) y me entro la curiosidad de saber que tan mala (o buena) es mi solucion.
Pero, que hace una libreria de `http` buena o mala? Esa es una pregunta que no puedo
responder categoricamente; sin embargo, algo siempre es mejor si mientras logra
los mismos resultados usa menos recursos o tiene un tiempo de vida util mayor, esto
se traduce a: cuantas peticiones por unidad de tiempo puedo soportar?, cuanto me
tardo en responder una peticion?, cuantos recursos utilizo para el objetivo?, entre
otros. Para poder responder esto, necesito poder medir el desempeño del programa.
Una busqueda en Google me arrojo [locust](https://locust.io/), y bajo su propia
definicion: ["Locust is an open source performance/load testing tool for HTTP and
other protocols. Its developer-friendly approach lets you define your tests in
regular Python code."](https://github.com/locustio/locust/blob/master/README.md)
el cual escogi porque permite escribir los tests en Python y mi proyecto ya usa
Python (tambien para ciertos tests).

## Primer intento

Voy a segui este tutorial [^1], sin embargo el autor creo un `mock` de una
api, por obvias razones no seguire esas partes.

### 1. Instalar locust

Elige tu `package manager` favorito, para esto yo usare `yay` porque
estoy en Arch (**btw**).

```bash
yay -S python-locust # version stable
```

Tambien puede ser instalado a traves de pip `pip`.

```bash
pip install locust
```

### 2. Crear un load test simple

Para la prueba elegire el endpoint
[/api/image/cursor/start](https://github.com/RossySpike/hermit-purple/blob/main/backend/docs/backend-api-OAD.yaml)
de mi [projecto](https://github.com/RossySpike/hermit-purple) porque
es un `GET` basico que retorna texto plano, por lo que es perfecto para
enfocarme solo en lo que `locust` ofrece, el autor ofrece el siguiente
**snippet**:

```python
from locust import HttpUser, task, between
class APIUser(HttpUser):
    wait_time = between(1, 3)
    @task
    def call_api_endpoint(self):
        self.client.get("/api/endpoint")
```

Ok, esto da bastante de que hablar, primero,
locust define users [^2]
los cuales son invocados para atacar el endpoint elegido.

Un objeto HtppUser[^3] ofrece como atributo `client` (instancia de `HttpSession`[^4])
el cual permite hacer peticiones HTTP:

```python
# ...
        self.client.get("/api/endpoint")
# ------------------^
```

El decorador `@task` le dice al user que la funcion puede ser elegida como su
`tarea/task` (puedes definir multiples `tareas/task` e incluso un `peso/weight`
a cada una con el fin de aumentar o disminuir las probabilidades de que se elija
dicha tarea), finalmente, el atributo `wait_time` tiene como funcion establecer
una espera para el user, y la funcion `between()` elige un numero dentro del rango.

## Segundo intento

El codigo anterior por obvias razones no cumple con mi objetivo, asi que necesito
modificarlo, para esto use como apoyo este tutorial[^5].

### Modificando el codigo

```python
from typing import Final

from locust import HttpUser, constant, task

HOST: Final = "http://localhost:1600"  # should be env


class HermitUser(HttpUser):
    host = HOST
    wait_time = constant(0)
    abstract = True


class CursorStart(HermitUser):
    @task
    def call_api_endpoint(self):
        with self.client.get("/api/image/cursor/start", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Unexpected status code: {response.status_code}")
            elif response.elapsed.total_seconds() > 0.3:
                response.failure("Request took too long")

```

Mi plan es crear una clase base para luego crear una clase por endpoint
que herede de la misma, sin embargo por ahora solo sera al endpoint acordado.

#### HermitUser

Esta es la clase abstracta de la que hablaba, guarda el prefijo de la url
y establece `wait_time` como un 0 constante por defecto. Guardar el `host`
nos permite llamar a un endpoint sin el prefijo:

```python

# ...
        with self.client.get("/api/image/cursor/start", catch_response=True) as response:
# ---------------------------^
```

#### CursorStart

Esta clase es la que hace el test para `/api/image/cursor/start`, por ahora me
enfocare en el test sino en el codigo. El metodo `call_api_endpoint` sera
llamado como una tarea porque esta decorado, aunque esto no es nuevo, lo
que si es nuevo es el hecho de que con ayuda del `named argument` podemos
definir codiciones de fallo/exito, esto es logrado al llamar al metodo `failure`
o `success` en la instancia de `ResponseContextManager`[^6] (que es lo que
retorna `HttpSession.get`).

## Ejecutar el test

Finalmente, para ejecutar la prueba escribimos en la terminal:

```bash
locust -f ./locust-load-test.py # version web
```

Luego presionar espacio para ejecutar la vista web en tu navegador predeterminado,
ahi puedes modificar algunas configuraciones como el numero de usuarios,
direccion del host y de test, entre otros.

Una vez que terminas la configuracion, veras la vista de monitorizacion, donde
puedes ver estadisticas en tiempo real del test en ejecicion, como fallos,
solicitudes por segundo, tiempo de respuesta por request, entre otros.

[^1]: [Supercharge Your APIs: A Guide to Python-Based Load Testing](https://medium.com/@SrvZ/supercharge-your-apis-a-guide-to-python-based-load-testing-dd42663e1b17)

[^2]: [Locust User class](https://docs.locust.io/en/stable/_modules/locust/user/users.html#User)

[^3]: [Locust HttpUser class](https://docs.locust.io/en/stable/_modules/locust/user/users.html#HttpUser)

[^4]: [Locust HttpSession class](https://docs.locust.io/en/stable/api.html#locust.clients.HttpSession)

[^5]: [Writing a locustfile](https://docs.locust.io/en/stable/writing-a-locustfile.html)

[^6]: [Locust ResponseContextManager](https://docs.locust.io/en/stable/api.html#responsecontextmanager-class)
