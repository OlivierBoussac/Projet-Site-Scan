# Guide de déploiement sur Ubuntu

## 1. Préparer le serveur Ubuntu

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y nginx curl wget git unzip

# Installer Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installer .NET 9 (méthode script officiel)
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x dotnet-install.sh
sudo ./dotnet-install.sh --channel 9.0 --install-dir /usr/share/dotnet
sudo ln -sf /usr/share/dotnet/dotnet /usr/bin/dotnet
rm dotnet-install.sh

# Vérifier l'installation
dotnet --version
```

## 2. Base de données

### Option A: SQL Server sur Linux
```bash
# Installer SQL Server
curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/mssql-server-2022.list)"
sudo apt update
sudo apt install -y mssql-server
sudo /opt/mssql/bin/mssql-conf setup
```

### Option B: PostgreSQL (recommandé pour Linux)
```bash
sudo apt install -y postgresql postgresql-contrib

# Créer la base
sudo -u postgres psql
CREATE DATABASE pss_db;
CREATE USER pss_user WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE pss_db TO pss_user;
\q
```

Si PostgreSQL, modifier `PSS_Backend.csproj` pour ajouter:
```xml
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.0" />
```

Et dans `Program.cs`, remplacer `UseSqlServer` par `UseNpgsql`.

## 3. Compiler les projets (sur ta machine locale)

### Frontend Angular
```bash
cd PSS
npm install
npm run build:prod
# Le build sera dans dist/pss/
```

### Backend .NET
```bash
cd PSS_Backend
dotnet publish -c Release -o ./publish
```

## 4. Transférer les fichiers sur le serveur

```bash
# Depuis ta machine locale
scp -r PSS/dist/pss/ user@ton-serveur:/var/www/pss/frontend/
scp -r PSS_Backend/publish/ user@ton-serveur:/var/www/pss/backend/
```

## 5. Configurer le Backend sur le serveur

### Créer le fichier de configuration production
```bash
sudo nano /var/www/pss/backend/appsettings.Production.json
```

Contenu:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=pss_db;User Id=pss_user;Password=mot_de_passe_securise;"
  },
  "OpenAI": {
    "ApiKey": "ta-cle-api-openai"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5000"
      }
    }
  }
}
```

### Créer le service systemd pour le backend
```bash
sudo nano /etc/systemd/system/pss-backend.service
```

Contenu:
```ini
[Unit]
Description=PSS Backend .NET API
After=network.target

[Service]
WorkingDirectory=/var/www/pss/backend
ExecStart=/usr/bin/dotnet /var/www/pss/backend/PSS_Backend.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=pss-backend
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

### Activer et démarrer le service
```bash
sudo systemctl daemon-reload
sudo systemctl enable pss-backend
sudo systemctl start pss-backend
sudo systemctl status pss-backend
```

## 6. Configurer le Frontend SSR

### Créer le service systemd pour le frontend
```bash
sudo nano /etc/systemd/system/pss-frontend.service
```

Contenu:
```ini
[Unit]
Description=PSS Frontend Angular SSR
After=network.target

[Service]
WorkingDirectory=/var/www/pss/frontend
ExecStart=/usr/bin/node /var/www/pss/frontend/server/server.mjs
Restart=always
RestartSec=10
User=www-data
Environment=NODE_ENV=production
Environment=PORT=4000

[Install]
WantedBy=multi-user.target
```

### Activer et démarrer
```bash
sudo systemctl daemon-reload
sudo systemctl enable pss-frontend
sudo systemctl start pss-frontend
```

## 7. Configurer Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/pss
```

Contenu:
```nginx
server {
    listen 2932;  # Port exposé sur ta Freebox
    server_name gbhome31.freeboxos.fr;  # Ton domaine

    # Frontend Angular SSR
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy MangaDex API (évite les erreurs CORS)
    location /mangadex-api/ {
        proxy_pass https://api.mangadex.org/;
        proxy_http_version 1.1;
        proxy_set_header Host api.mangadex.org;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }

    # Proxy images MangaDex (évite le hotlink blocking)
    location /mangadex-uploads/ {
        proxy_pass https://uploads.mangadex.org/;
        proxy_http_version 1.1;
        proxy_set_header Host uploads.mangadex.org;
        proxy_set_header Referer "https://mangadex.org/";
        proxy_ssl_server_name on;
    }
}
```

### Activer le site
```bash
sudo ln -s /etc/nginx/sites-available/pss /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Configurer HTTPS avec Let's Encrypt (optionnel)

Note: Si tu utilises un port personnalisé (2932), Let's Encrypt nécessite que le port 80 soit aussi accessible pour la validation.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gbhome31.freeboxos.fr
```

## 9. Appliquer les migrations de base de données

```bash
cd /var/www/pss/backend
dotnet PSS_Backend.dll --migrate  # ou faire manuellement
```

Ou sur ta machine locale avant déploiement:
```bash
dotnet ef database update --connection "ta-connection-string-production"
```

## 10. Vérifier que tout fonctionne

```bash
# Vérifier les services
sudo systemctl status pss-backend
sudo systemctl status pss-frontend
sudo systemctl status nginx

# Voir les logs
sudo journalctl -u pss-backend -f
sudo journalctl -u pss-frontend -f
```

## Commandes utiles

```bash
# Redémarrer les services
sudo systemctl restart pss-backend
sudo systemctl restart pss-frontend
sudo systemctl restart nginx

# Voir les logs en temps réel
sudo journalctl -u pss-backend -f
sudo journalctl -u pss-frontend -f
```

---

## 11. Mise à jour en production

### Option A: Via le montage thinclient (depuis le serveur)

**1. Sur ta machine Windows** - Recompile les projets :
```bash
# Frontend
cd PSS
npm run build:prod

# Backend
cd ../PSS_Backend
dotnet publish -c Release -o ./publish
```

**2. Sur le serveur Ubuntu** - Copie et redémarre :
```bash
# Arrêter les services
sudo systemctl stop pss-frontend
sudo systemctl stop pss-backend

# Copier le frontend
cp -r /home/olboussac/thinclient_drives/C:/Users/olbou/Documents/Projet-Site-Scan/PSS/dist/pss/* /tmp/frontend_update
sudo rm -rf /var/www/pss/frontend/*
sudo cp -r /tmp/frontend_update/* /var/www/pss/frontend/
rm -rf /tmp/frontend_update

# Copier le backend
cp -r /home/olboussac/thinclient_drives/C:/Users/olbou/Documents/Projet-Site-Scan/PSS_Backend/publish/* /tmp/backend_update
sudo rm -rf /var/www/pss/backend/*
sudo cp -r /tmp/backend_update/* /var/www/pss/backend/
rm -rf /tmp/backend_update

# Remettre les permissions
sudo chown -R www-data:www-data /var/www/pss

# Redémarrer les services
sudo systemctl start pss-backend
sudo systemctl start pss-frontend

# Vérifier que tout fonctionne
sudo systemctl status pss-backend
sudo systemctl status pss-frontend
```

### Option B: Via SCP (depuis Windows PowerShell)

**1. Recompile les projets :**
```powershell
cd C:\Users\olbou\Documents\Projet-Site-Scan

# Frontend
cd PSS
npm run build:prod

# Backend
cd ..\PSS_Backend
dotnet publish -c Release -o ./publish
```

**2. Transfère les fichiers :**
```powershell
cd C:\Users\olbou\Documents\Projet-Site-Scan

# Frontend
scp -r PSS/dist/pss/* olboussac@192.168.0.146:/tmp/frontend_update/

# Backend
scp -r PSS_Backend/publish/* olboussac@192.168.0.146:/tmp/backend_update/
```

**3. Sur le serveur, applique les mises à jour :**
```bash
# Arrêter les services
sudo systemctl stop pss-frontend
sudo systemctl stop pss-backend

# Mettre à jour le frontend
sudo rm -rf /var/www/pss/frontend/*
sudo cp -r /tmp/frontend_update/* /var/www/pss/frontend/
rm -rf /tmp/frontend_update

# Mettre à jour le backend
sudo rm -rf /var/www/pss/backend/*
sudo cp -r /tmp/backend_update/* /var/www/pss/backend/
rm -rf /tmp/backend_update

# Permissions
sudo chown -R www-data:www-data /var/www/pss

# Redémarrer
sudo systemctl start pss-backend
sudo systemctl start pss-frontend
```

### Mise à jour rapide (frontend seulement)

Si tu n'as modifié que le frontend Angular:

**Sur Windows:**
```powershell
cd C:\Users\olbou\Documents\Projet-Site-Scan\PSS
npm run build:prod
```

**Sur le serveur Ubuntu:**
```bash
# Arrêter le service
sudo systemctl stop pss-frontend

# Copier les fichiers via thinclient
mkdir -p /tmp/frontend_update
cp -r /home/olboussac/thinclient_drives/C:/Users/olbou/Documents/Projet-Site-Scan/PSS/dist/pss/* /tmp/frontend_update/
sudo cp -r /tmp/frontend_update/* /var/www/pss/frontend/
rm -rf /tmp/frontend_update

# Permissions et redémarrage
sudo chown -R www-data:www-data /var/www/pss/frontend
sudo systemctl start pss-frontend
sudo systemctl status pss-frontend
```

### Mise à jour rapide (backend seulement)

Si tu n'as modifié que le backend .NET :

**Sur Windows:**
```powershell
cd C:\Users\olbou\Documents\Projet-Site-Scan\PSS_Backend
dotnet publish -c Release -o publish
```

**Sur le serveur Ubuntu:**
```bash
# Arrêter le service
sudo systemctl stop pss-backend

# S'assurer que le dossier .dotnet existe (évite erreur permission)
sudo mkdir -p /var/www/.dotnet
sudo chown -R www-data:www-data /var/www/.dotnet

# Copier les fichiers via thinclient
mkdir -p /tmp/backend_update
cp -r /home/olboussac/thinclient_drives/C:/Users/olbou/Documents/Projet-Site-Scan/PSS_Backend/publish/* /tmp/backend_update/
sudo cp -r /tmp/backend_update/* /var/www/pss/backend/
rm -rf /tmp/backend_update

# Permissions et redémarrage
sudo chown -R www-data:www-data /var/www/pss/backend
sudo systemctl start pss-backend
sudo systemctl status pss-backend
```

### Vérification après mise à jour

```bash
# Vérifier les services
sudo systemctl status pss-backend
sudo systemctl status pss-frontend

# Vérifier les ports
sudo ss -tlnp | grep -E '4000|5000'

# Consulter les logs si erreur
sudo journalctl -u pss-frontend -n 50
sudo journalctl -u pss-backend -n 50
```

---

## Configuration du Firewall

```bash
sudo ufw allow 2932  # Port de ton application
sudo ufw allow 22    # SSH
sudo ufw enable
```

---

## Résolution de problèmes courants

### Erreur "Permission denied" sur /var/www/.dotnet

Si le backend échoue avec une erreur de permission sur `/var/www/.dotnet`:

```bash
sudo mkdir -p /var/www/.dotnet
sudo chown -R www-data:www-data /var/www/.dotnet
sudo systemctl restart pss-backend
```

### Erreur CORS avec MangaDex API

Le frontend utilise un proxy Nginx (`/mangadex-api/`) pour éviter les erreurs CORS.
Vérifie que la configuration Nginx contient bien la section `location /mangadex-api/`.

### Backend ne démarre pas

```bash
# Voir les logs détaillés
sudo journalctl -u pss-backend -n 100 --no-pager

# Vérifier que le fichier appsettings.Production.json est correct
cat /var/www/pss/backend/appsettings.Production.json

# Tester manuellement
cd /var/www/pss/backend
sudo -u www-data dotnet PSS_Backend.dll
```

### Frontend affiche "Bad Gateway"

```bash
# Vérifier que le service tourne
sudo systemctl status pss-frontend

# Vérifier que le fichier server.mjs existe
ls -la /var/www/pss/frontend/server/

# Voir les logs
sudo journalctl -u pss-frontend -n 50
```
