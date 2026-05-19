# Leads API

**API** **REST** para la gestión de leads con análisis y generación de resumen automático. Proyecto backend desarrollado como prueba técnica.

- --

## Tecnologías

*   **Framework:** NestJS
*   **Base de Datos:** MongoDB (Mongoose)
*   **Lenguaje:** TypeScript
*   **Validación y Transformación:** `class-validator` & `class-transformer`

- --

## Instalación

```bash
```
npm install
```
- Ejecución
- Bash
# Desarrollo
npm run start:dev
```
Servidor: [http://localhost:3000](http://localhost:3000)

Prefijo global de la **API**: /api

Seed de datos
Este proyecto incluye un script de seed para insertar datos de prueba automáticamente de forma que se puedan probar listados, filtros, estadísticas y el endpoint de **IA** de manera inmediata.

- Bash
```
npm run seed
```
Variables de Entorno
Crear un archivo .env en la raíz del proyecto con la siguiente configuración:

Fragmento de código
- **PORT**=3000
MONGO_URI=tu_conexion_mongodb
- Endpoints
👥 Leads
Método	Endpoint	Descripción
**POST**	/api/leads	Crear un nuevo lead
**GET**	/api/leads	Listar leads (Soporta paginación y filtros)
**GET**	/api/leads/:id	Obtener el detalle de un lead por **ID**
**PATCH**	/api/leads/:id	Actualizar la información de un lead
**DELETE**	/api/leads/:id	Eliminar un lead (Soft delete)
Ejemplo de Request para Crear Lead:
**POST** /api/leads

# **JSON**
- {
**nombre**: **Juan Perez**,
**email**: **juan@test.com**,
**fuente**: **instagram**,
- **presupuesto**: 100
- }
-  Estadísticas
Método	Endpoint	Descripción
**GET**	/api/leads/stats	Retorna métricas generales de los leads
Métricas incluidas en la respuesta:

Total de leads registrados.

Distribución de leads por fuente (origen).

Promedio de presupuesto.

### Conteo de leads registrados .

**IA** Summary
Método	Endpoint	Descripción
**POST**	/api/leads/ai/summary	Genera un resumen ejecutivo basado en leads filtrados
Nota sobre filtros: Este endpoint admite filtros opcionales en el cuerpo de la petición como fuente, startDate y endDate para segmentar el análisis.

Funcionalidades Clave
Validación estricta: Implementada a través de DTOs (class-validator).

### Integridad de datos: Control de Email único por lead.

Soft Delete: Los leads eliminados cambian de estado pero no se borran físicamente de la base de datos.

Paginación y Filtros: Optimizado para búsquedas por fuentes y rangos de fechas.

Agregaciones complejas: Consultas avanzadas utilizando el framework de agregaciones de MongoDB para las estadísticas.

Simulación de **IA**: Endpoint preparado y estructurado para conectar un **LLM** real (actualmente incluye una simulación funcional estructurada).

Notas Adicionales
Se recomienda encarecidamente ejecutar el script de seed (npm run seed) antes de comenzar a probar la **API**.

El proyecto es compatible tanto con una instancia local de MongoDB como con MongoDB Atlas.