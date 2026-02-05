# Eco Riego - Aplicación de Riego Inteligente

## Descripción general

Eco Riego es una aplicación web de vanguardia creada con Angular que permite a los usuarios supervisar y gestionar de forma remota los sistemas de riego de sus plantas. La aplicación cuenta con un panel de control en tiempo real que muestra métricas vitales de la planta, como la humedad, la temperatura y la luz, a través de atractivos medidores visuales. Los usuarios pueden configurar los programas de riego, seleccionar entre varios tipos de plantas y recibir información sobre el estado para garantizar una salud óptima de las plantas y, al mismo tiempo, conservar el agua.

## Diseño, estilo y características

*   **Arquitectura moderna**: Construida con los últimos componentes independientes de Angular, lo que garantiza un diseño modular y eficiente.
*   **Gestión de estado reactiva**: Utiliza señales de Angular para una gestión de estado reactiva y un flujo de datos sin interrupciones.
*   **Panel de control interactivo**: Un panel de control dinámico con la posibilidad de cambiar el nombre de la planta sobre la marcha.
*   **Panel de configuración desplegable**: Un panel de configuración lateral que se puede alternar para un acceso rápido a los ajustes.
*   **Estilo moderno**: Una interfaz de usuario limpia y moderna con variables CSS para facilitar la personalización del tema. Utiliza una paleta de colores verdes para un ambiente ecológico.
*   **Diseño responsivo**: Diseñado para funcionar a la perfección en diferentes tamaños de pantalla.
*   **Iconografía**: Incluye iconos SVG para una interfaz de usuario nítida y escalable.
*   **Componentes de medición**: Medidores visuales para una representación clara de las métricas de salud de las plantas.
*   **Selección de plantas**: Permite a los usuarios seleccionar entre diferentes tipos de plantas para supervisar.
*   **Servicio de estado centralizado**: Un servicio gestiona el estado de la aplicación, incluida la planta seleccionada actualmente.
*   **Sistema de notificaciones**: Un sistema de notificaciones para alertar a los usuarios.
*   **Lógica de estado dinámica**: La aplicación determina y muestra de forma inteligente el estado de salud de la planta en función de sus métricas.

## Plan actual: Fase 5 - Persistencia de datos y maquetación final

1.  **`localStorage`**: Utilizaré `localStorage` para conservar el estado de la aplicación, como la planta seleccionada y los nombres de las plantas personalizados, de modo que persistan entre las visitas.
2.  **Refinar el `PlantService`**: Modificaré el `PlantService` para leer y escribir en el `localStorage`.
3.  **Pulir la interfaz de usuario**: Haré un pulido final de la interfaz de usuario, los estilos y las animaciones para que la aplicación resulte más atractiva y profesional.
4.  **Limpieza final**: Haré una revisión final de todo el código base, eliminando cualquier código de depuración innecesario y garantizando la coherencia.
