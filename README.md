# For Developers

Generally, client-side installations would be done on your own shell and server-side installations would be done on Linux.


# For Client Side

This section would need `npm`, the package manager of Node.js. \
You could get it here: https://nodejs.org/en/download

## Installing Dependencies

```
cd saln-client
npm install
```

To run: 
```
npm run dev
```

# For Server Side

This is done on Linux to mimic behavior on DigitalOcean, in which we will be using a Linux Ubuntu server.

## Installing MySQL in Linux

**To install MySQL:** 
```
sudo apt update
sudo apt install mysql-server -y
```

To start MySQL Server: `sudo service mysql start` \
To check status: `sudo service mysql status` \
To login locally: `sudo mysql -u root -p` \
To stop MySQL Server: `sudo service mysql stop`

## Installing PHP/Laravel in Linux 

**To install PHP:**
```
sudo apt update && sudo apt upgrade -y
sudo apt install php php-cli php-mbstring php-xml php-bcmath php-json php-zip php-curl php-mysql unzip curl git -y
```

To check PHP version: `php -v`

**To install Composer (PHP Package manager):**
```
sudo apt install composer -y
```

To check Composer version: `composer -v`

**To install Laravel:**
```
composer global require laravel/installer
echo 'export PATH="$PATH:$HOME/.config/composer/vendor/bin"' >> ~/.bashrc
source ~/.bashrc
```

**Local Configurations**

On mysql, create a DB for laravel to connect to. \
A lot of this part will be changed, but for now, we will just avoid exceptions when booting the server. This is just for local testing purposes and will be updated for deployment versions.
``` sql
CREATE DATABASE saln_app_DB;
CREATE USER 'saln_user'@'localhost' IDENTIFIED BY 'saln_password';
GRANT ALL PRIVILEGES ON saln.* TO 'saln_user'@'localhost';
FLUSH PRIVILEGES;
```

Open `saln-server/.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saln
DB_USERNAME=saln_user
DB_PASSWORD=saln_password
```

Then on Linux, run
```
php artisan migrate
php artisan serve
```
You should see some Laravel screen on http://127.0.0.1:8000
