# Proyecto Mi huerto
Es un sistema web que sirve para planificar un huerto de acuerdo a las condiciones del suelo, espacio y plantas que el usuario seleccione.
el sistema analiza el suelo, condiciones climáticas como exposición solar y forma de riego, y con esos datos calcula y te ofrece una lista de vegetales y hortalizas que puedes sembrar de acuerdo a tu tipo de suelo. Al final te ofrece un plan de siembra con un calendario de siembra y cosecha y recomendaciones para la siembra.
Dirigido a todo tipo de usuario que quiera tener un huerto en su casa, o departamento. El objetivo es incentivar la sustentabilidad alimentaria y mejorar la salud a través de que las personas 

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
