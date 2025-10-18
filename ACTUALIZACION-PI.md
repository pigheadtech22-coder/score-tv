# 🔄 Actualización en Raspberry Pi

## 📋 Nuevas dependencias agregadas

Esta actualización incluye nuevas características que requieren las siguientes dependencias:

- ✅ **html2canvas** v1.4.1 - Para capturas de pantalla sin bordes negros
- ✅ **qrcode** v1.5.4 - Para generación de códigos QR con texto

## 🚀 Comando de actualización

Para actualizar en la Raspberry Pi, ejecuta:

```bash
chmod +x update-pi.sh && ./update-pi.sh
```

## 📦 Instalación manual de dependencias (si es necesario)

Si el script automático falla, puedes instalar manualmente:

```bash
# Ir al directorio del proyecto
cd /opt/marcador-tv

# Instalar dependencias específicas
npm install html2canvas qrcode @types/qrcode

# Reconstruir la aplicación
npm run build

# Reiniciar servicio
sudo systemctl restart marcador-tv
```

## ✨ Nuevas características incluidas

- 🖼️ **Capturas optimizadas**: Sin bordes negros en imágenes descargadas
- 📸 **Captura completa**: Incluye header (torneo/fase) y footer (tiempo)
- 🎨 **Modal redesñado**: Layout horizontal sin scroll vertical
- 👥 **Fotos más grandes**: Jugadores más visibles en resultado final
- 🏆 **Diseño limpio**: Eliminación de textos redundantes
- 📊 **Sets destacados**: Mejor visualización del detalle por sets
- 📱 **QR mejorado**: Códigos QR con texto legible

## 🔍 Verificación de instalación

Después de la actualización, verifica que todo funcione:

```bash
# Ver estado del servicio
sudo systemctl status marcador-tv

# Ver logs en tiempo real
sudo journalctl -u marcador-tv -f

# Verificar dependencias
cd /opt/marcador-tv && npm list html2canvas qrcode
```

## 🌐 Acceso a la aplicación

Una vez actualizado, la aplicación estará disponible en:
- **Local**: http://localhost:5173
- **Red**: http://[IP-DE-LA-PI]:5173

## 🆘 Solución de problemas

Si hay problemas después de la actualización:

```bash
# Reinstalar dependencias
cd /opt/marcador-tv
rm -rf node_modules package-lock.json
npm install

# Reconstruir y reiniciar
npm run build
sudo systemctl restart marcador-tv
```

## 📞 Comandos útiles

```bash
# Ver logs del servicio
sudo journalctl -u marcador-tv --no-pager -n 50

# Reiniciar servicio
sudo systemctl restart marcador-tv

# Parar servicio
sudo systemctl stop marcador-tv

# Iniciar servicio
sudo systemctl start marcador-tv

# Estado del servicio
sudo systemctl status marcador-tv
```