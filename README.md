# Flores Costa Cuca

Web informativa sobre la Municipalidad y el municipio de Flores Costa Cuca, Quetzaltenango, Guatemala. Diseño adaptable, historia interactiva, buscador de alcaldes, fichas con fuentes, galería ampliable, mapa y modo oscuro.

Sitio: https://erick-cloudq.github.io/municipalidad-flores-costa-cuca/

## Contenido documentado

La investigación del 6 de octubre de 2026 identifica seis alcaldes. La lista anterior a 1985 todavía no está completa. Cada ficha distingue períodos electorales, adjudicaciones y años observados. No se inventaron retratos ni obras de autoridades.

`historia-documentada.json` contiene la investigación, las fuentes y las lagunas. `data.js` contiene los datos de presentación. Para editar textos de interfaz, usar `index.html` y `app.js`; para apariencia, `styles.css`.

## Fotografías y créditos

- Parque central: Oswaldo Galvan, 2 de noviembre de 2012. [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Parque_Central_de_Flores_Costa_Cuca.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). `parque.jpg` conserva el archivo original; se muestra completo y con distintos encuadres CSS.
- Símbolo sobre bandera: Municipalidad de Flores Costa Cuca, según la ficha de [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Coat_of_Flores_Costa_Cuca.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). `escudo.jpg` conserva el archivo original.

Las imágenes mantienen sus licencias propias. No se incorporaron fotografías reservadas de terceros ni imágenes de municipios homónimos.

## Documento fundacional añadido el 9 de octubre de 2026

`acuerdo-fundacion-1900.png` es una copia aportada por el propietario del sitio. Se conserva la imagen recibida, sin retoques. La procedencia archivística de esta reproducción está pendiente de identificar; no se presenta como una copia autenticada.

La sección de historia incluye ampliación de la imagen, descarga y una transcripción del texto visible. Se regularizan los saltos de línea, espacios y comillas. No se atribuyen las firmas a partir de la fotografía.

## Feria de Candelaria — actualización del 9 de octubre de 2026

La sección `#feria` documenta el día principal anual del 2 de febrero, con las fuentes de SEGEPLAN y de la historia municipal. La cuenta regresiva utiliza `America/Guatemala`, se mantiene en cero durante el 2 de febrero completo y pasa al año siguiente el día 3.

El calendario permite navegar por meses y seleccionar días con ratón o teclado. La fecha tradicional se distingue de actividades oficialmente confirmadas. `feria-data.js` mantiene `programEvents` vacío porque no se obtuvo un programa oficial de 2027 verificado. Para añadir actividades futuras, cada registro debe contener `date` (AAAA-MM-DD), `title`, `time`, `place` y `source` (anuncio oficial).

La galería separa una ilustración temática, la fotografía documental del parque en 2012 y la reproducción del acuerdo de 1900. La ilustración `candelaria-ilustracion.png` fue creada con el built-in ImageGen: tres velas marfil encendidas, luz ámbar, fondo azul petróleo, textura pintada, formato 3:2; sin textos, personas, insignias ni edificios. No representa una fotografía de la feria.

El video `Puestos de la feria 2024 en Flores Costa Cuca`, de Daniel Méndez, se carga en el reproductor oficial de YouTube cuando el visitante lo solicita. Su URL y atribución se comprobaron mediante oEmbed. Se enlaza también a la cobertura fotográfica de Guatemala.com de 2019; no se republican sus fotografías.

`feria-candelaria.ics` permite guardar la conmemoración anual del 2 de febrero. No equivale al programa oficial de actividades.

Prompt de la ilustración: «Ilustración editorial elegante de tres velas marfil encendidas como símbolo de Candelaria; cálida luz ámbar sobre fondo azul petróleo muy oscuro, detalles sutiles de pétalos claros y textura artística pintada. Composición horizontal 3:2 limpia. Sin texto, insignias oficiales, personas, edificios ni paisajes. No representar un lugar real ni aparentar una fotografía de la feria de Flores Costa Cuca».

## Publicación y edición

Sitio estático: no requiere instalación ni servidor de aplicaciones. GitHub Pages sirve la rama `main`, carpeta raíz. Se puede abrir `index.html` localmente o usar un servidor estático para una vista previa.

Este proyecto es informativo e independiente. Enlaza al portal municipal para consultar información oficial y no procesa pagos, solicitudes ni trámites.
