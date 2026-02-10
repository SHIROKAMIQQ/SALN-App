# Digital Ocean VM Setup

This assumes you have:
- Digital Ocean Droplet (Ubuntu 24)
- SendGrid setup, for sending emails 

You should also get the `saln-server/.env` file from the developers.

Upon pulling the repository, you may want to check these files for production code:
- `saln-client/src/api/config.js`
- `saln-server/config/cors.php`
- `saln-server/config/mail.php`
- `saln-server/.env`

# Installing Git
Install git and then clone the code repository. 
```bash
sudo apt install git -y
cd /var/www
git clone https://github.com/SHIROKAMIQQ/SALN-App.git
cd SALN-App
```
Now, you should have `/var/www/SALN-App` directory.


# Installing npm

Firstly, install npm, the package manager of Node.js. \
You could get it here: [https://nodejs.org/en/download](https://nodejs.org/en/download)
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.13.0".

# Verify npm version:
npm -v # Should print "11.6.2".
```

## Installing Node dependencies
Then, we could simply install the client-side's Node.js dependencies:
```bash
cd /var/www/SALN-App/saln-client
npm install
```

# Serving Client

## Build Dist
Normally in a development environment, we simply run `npm run dev`. This is just for the dev environment since browsers need to serve static JS files. \
Run `npm run build` to get the static js files of the current MarkoJS code of `saln-client`. \
The output will be in `saln-client/dist`.

## Process Manager
For this setup, we have the MarkoJS client served by a Node server. This is usually done by `npm run build` then `node dist/index.mjs`.
But, this disconnects once the terminal gets terminated. 
Process manager 2 (`pm2`) allows us to keep this process alive.
```bash
cd /var/www/SALN-App/saln-client
npm install -g pm2
pm2 -v
pm2 start dist/index.mjs --name saln-client
pm2 save
pm2 startup
```

Additionally, you have these tools for checking logs and active processes from pm2: `pm2 list`, `pm2 logs saln-client`, `pm2 status`.

# Installing PHP

## Install PHP 8.4+
```bash
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.4 php8.4-cli php8.4-common php8.4-mbstring php8.4-xml php8.4-curl php8.4-mysql php8.4-zip php8.4-gd php8.4-intl -y
sudo apt install php8.2-fpm php8.2-mbstring php8.2-bcmath php8.2-curl php8.2-xml php8.2-mysql unzip composer -y

```

## Install Composer
Composer is PHP's package manager
```bash
sudo apt install composer
```

## Install Laravel
Laravel is the PHP Framework to be used for the backend server side of the web app.
```bash
composer global require laravel/installer
echo 'export PATH="$PATH:$HOME/.config/composer/vendor/bin"' >> ~/.bashrc
source ~/.bashrc
```

# Installing PHP dependencies
In `SALN-App/saln-server`, install required PHP packages:
```bash
cd saln-server
composer install
```

# Install MySQL
To install MySQL Server:
```bash
sudo apt update
sudo apt install mysql-server -y
```
To start MySQL Server: `sudo service mysql start` \
To check status: `sudo service mysql status` \
To login locally: `sudo mysql -u root -p` \
To stop MySQL Server: `sudo service mysql stop`

# Configuring Server-Side

## Database Setup
Then, create `saln_app_DB` in MySQL and a user for Laravel migrations to use.
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE saln_app_DB;
CREATE USER 'saln_user'@'localhost' IDENTIFIED BY 'saln_password';
GRANT ALL PRIVILEGES ON saln_app_DB.* TO 'saln_user'@'localhost';
FLUSH PRIVILEGES;
```

Get the `saln-server/.env` file from the developers. \
Then, paste it into Digital Ocean VM via `sudo nano ~/SALN-App/saln-server/.env`.

Setup the database tables from Laravel's migrations
```bash
php artisan migrate:fresh
```

## Crontab
This part sets up the cron job for scheduled tasks (like deleting 5-day old SALN Forms).
```bash
crontab -e
```
Then put this line on the bottom of the file
```
* * * * * cd /var/www/SALN-App/saln-server && php artisan schedule:run >> /dev/null 2>&1
```

# NGINX Setup

## Installing NGINX

Install NGINX
```bash
sudo apt install nginx -y
```

Then, we want nginx to work on port 80, but apache2 might already be in there. So, we disable apache2 since we have no use for it in this app.
```bash
sudo ss -tulpn | grep :80
sudo service apache2 stop
sudo systemctl disable apache2
sudo ss -tulpn | grep :80
sudo service nginx start
sudo service nginx status
```

## NGINX Config

For the client side routing, we do two things. On the browser, we listen on port `80`. 
But, since our MarkoJS client is being served on port `3000` by a Node server, we proxy it over to port `3000`. 
If we see `/api/`, we proxy it over to port `82`, where the Laravel server-side logic is. 
Additionally, this is declares the SSL certificates for port `80`, which allows HTTPS protocol.
```bash
sudo nano /etc/nginx/sites-available/saln-client
```
```nginx
server {
    listen 80;
    server_name lamig-saln.online www.lamig-saln.online;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name lamig-saln.online www.lamig-saln.online;

    ssl_certificate /etc/letsencrypt/live/lamig-saln.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lamig-saln.online/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # --------- MARKOJS FRONTEND ---------
    location / {
        proxy_pass http://127.0.0.1:3000/;  # Node MarkoJS server
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # --------- LARAVEL BACKEND ---------
    location /api/ {
        proxy_pass http://127.0.0.1:82;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optional: serve Laravel static assets correctly
    location /storage/ {
        root /var/www/SALN-App/saln-server/public;
    }

    # Protect hidden files
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

For the server side routing:
```
sudo nano /etc/nginx/sites-available/saln-server
```
```nginx
server {
    listen 82;
    server_name _;

    root /var/www/SALN-App/saln-server/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash 
sudo ln -s /etc/nginx/sites-available/saln-client /etc/nginx/sites-enabled
sudo ln -s /etc/nginx/sites-available/saln-server /etc/nginx/sites-enabled
```

For checking nginx logs: open `/var/log/nginx/error.log` \
To clear nginx logs: `sudo trunctate -s 0 /var/log/nginx/error.log`

Additionally, we need to give nginx (www-data group) permissions to read/traverse through SALN-App. \
We also want to give Laravel write permissions for the saln-server's logs and cache.
```bash
sudo chown -R www-data:www-data /var/www/SALN-App

# Directories: readable + traversable
sudo find /var/www/SALN-App -type d -exec chmod 755 {} \;
# Files: readable
sudo find /var/www/SALN-App -type f -exec chmod 644 {} \;

# Give Laravel write access to storage (logs) and cache
sudo chmod -R 775 /var/www/SALN-App/saln-server/storage
sudo chmod -R 775 /var/www/SALN-App/saln-server/bootstrap/cache
```

**ALWAYS** run `sudo systemctl reload nginx` when making changes to the nginx config files. 

# SSL Certificate
Do notice that the [NGINX Config](#NGINX-Config) for client has SSL certificates. For the sake of documentation, this is how we got them.

This assumes you have `snap` installed. Try `snap --version`.

```bash
snap install --classic certbot
certbot --nginx
sudo systemctl reload nginx
``` 