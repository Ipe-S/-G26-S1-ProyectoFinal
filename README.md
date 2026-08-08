# Proyecto Mi huerto
Un sistema inteligente para planificar tu huerto en casa.

### Participantes:
##### - Felipe Saldiax 

##### - Ligia Cautela

### Detalle del proyecto:
Nuestra plataforma web analiza las condiciones de tu suelo, el nivel de luz solar y el tipo de riego disponible para decirte exactamente qué y cómo cultivar. A partir de estos datos, genera una lista optimizada de verduras y hortalizas, junto con un calendario personalizado de siembra, cosecha y cuidados.

Diseñada para cualquier tipo de espacio —desde un jardín hasta el balcón de un departamento—, nuestro objetivo es impulsar la sustentabilidad alimentaria y la alimentación saludable, permitiendo que todos puedan cultivar sus propios alimentos orgánicos y libres de químicos desde cero.

### Características del proyecto:

- Proyecto solicita al cliente loguearse para poder generar el plan, no tiene ningun costo para el usuario mas que su correo.
- Se realizo una database o base con la lógica de negocio y cálculos con los datos ingresados por el usuario en el formulario, a fin de entregar una recomendación siembra segun condiciones ambientales y de suelo.
- APIs que están interactuando con el sistema:
   1.	Open-Meteo Forecast	https://api.open-meteo.com/v1/forecast: nos da las recomendaciones según el clima: temperatura, humedad, lluvia, UV, suelo, evapotranspiración. Api gratis sin API Key.
   2.	Open-Meteo Geocoding, es la Api publica sin api key se utiliza para obtener los datos de la ubicación ingresada por el usuario en el primer paso del formulario. https://geocoding-api.open-meteo.com/v1/search	
   3.	Api Supabase	https://jkwhzkpbhwaxewdhpswy.supabase.co, en una api privada que requiere URL + key en .env.local. Se esta utilizando para el login y registro de usuarios.
      
### Tecnologias utilizadas:
- React
- Next.js
- Typescript
- Tailwind
- Vercel
- Github
- Git

### Despliegue en Vercel
https://g26-s1-proyecto-final-silk.vercel.app/
