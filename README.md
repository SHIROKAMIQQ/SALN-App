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

## Local Configurations
Create `saln-client/.env` and put this line inside.
```
VITE_API_BASE_URL=http://localhost:8000/api
```
This acts as the base URL for API calls to the server. This will be changed for production.

## Run Client
`npm run dev` must be run in the `saln-client` directory.

```
cd saln-client
npm run dev
```

You should see a Marko page at (usually) http://localhost:3000

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
composer install
```

**Local Configurations**

On mysql, create a DB for laravel to connect to. \
A lot of this part will be changed, but for now, we will just avoid exceptions when booting the server. This is just for local testing purposes and will be updated for deployment versions.
``` sql
CREATE DATABASE saln_app_DB;
CREATE USER 'saln_user'@'localhost' IDENTIFIED BY 'saln_password';
GRANT ALL PRIVILEGES ON saln_app_DB.* TO 'saln_user'@'localhost';
FLUSH PRIVILEGES;
```

Open `saln-server/.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saln_app_DB
DB_USERNAME=saln_user
DB_PASSWORD=saln_password
```

Then on Linux, run
```
php artisan key:generate
php artisan migrate:fresh
```

This part sets up the cron job for scheduled tasks (like deleting 5-day old SALN Forms). \
On WSL run this to open up a text editor in your shell which will edit the cron job file:
```
crontab -e
```
Then put on the bottom of the file
```
* * * * * cd /Path/to/saln-app/saln-server && php artisan schedule:run >> /dev/null 2>&1
```
Then to exit: `Ctrl+O`, `ENTER`, `CtrlX`. To test if the scheduler works, run `php artisan schdule:run`, or more specifically, `php artisan saln:cleanup`.  

# Run Server
`php artisan serve` must be run inside the `saln-server` folder using a Linux shell.

```
cd saln-server
php artisan serve
```

You should see some Laravel screen at (usually) http://127.0.0.1:8000
