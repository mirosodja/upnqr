# Program za pripravo Upn QR nalogov
[Univerzalni plačilni nalogi - UPN QR program](https://potep.in/upnqr/) lahko brezplačno uporabljate na navedeni povezavi. Generira pdf datoteko za tiskanje standardnih A4 Upn QR nalogov na laserskem tiskalniku oziroma zip datoteko z Upn QR nalogi v pdf datotekah in je namenjen pošiljanju preko elektronske pošte (glej tudi [pomoč](https://potep.in/upnqr/help) na domači strani programa).

Več o uporabljenih programih oziroma modulih spodaj, mogoče samo še to v slovenščini, da je del programa, ki teče v brskalniku sprogramiran v Angular - ju, na serverju, kjer se pripravijo pdf oziroma zip datoteke pa v pythonu. Vsi podatki, ki so potrebni za generiranje pdf datotek so v IndexDB na vašem računalniku. Povedati je treba še to, da je bilo preizkušenih več paketov za generiranje QR code, vendar je samo Segno PyPI paket uspel zadostiti zahtevi, ki je za [UPN QR - Univerzalne plačilne naloge](https://upn-qr.si/) zapisana v [Priročniku za programerje](https://upn-qr.si/uploads/files/NavodilaZaProgramerjeUPNQR.pdf) za kodno tabelo in ta je ISO 8859-2 (Latin 2). 

# About Angular frontend
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.3.
## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# About python backend
Pdf files with the corresponding code are generated on the server in python with the [Segno PyPI package](https://pypi.org/project/segno/). The code is in the "backend" folder, it also contains the "conf+service" folder, which contains files for configuring the Apache server to run python in wsgi mode and running gunicorn as a service. Segno PyPI package generates QR code which pass the test in program [PreveriUPNQR22](https://upn-qr.si/sl/preveriupnqr). Fonts for generates pdf file for printing is [FreeMono.ttf](https://www.gnu.org/software/freefont/index.html).

## Preparing apache, python
Enabling Apache wsgi module and add confuguration file for backend with alias:
```console
sudo a2enmod wsgi
```
```console
sudo nano /etc/apache2/conf-available/upnqr.conf
```
Copy content of ./backend/conf+service/upnqr.conf into /etc/apache2/conf-available/upnqr.conf
```console
sudo ls -
```
```console
sudo nano /etc/apache2/conf-available/upnqr.conf
```
```console
sudo ln -s /etc/apache2/conf-available/upnqr.conf /etc/apache2/conf-enabled/upnqr.conf
```
Restart apache:
```console
sudo systemctl restart apache2.service
```
Preparing python virtual env:
```console
cd /home/user/CRUD/upnqr_services/
```
```console
python -m venv env
```
```console
source env/bin/activate
```
```console
python -m pip install -r requirements.txt
```
```console
pip install gunicorn
```
```console
deactivate
```
Preparing gunicorn service:
```console
sudo nano /etc/systemd/system/upnqr.service
```
Then copy content of ./backend/conf+service/upnqr.service in /etc/systemd/system/upnqr.service, start and enable service:
```console
sudo systemctl start upnqr
```
```console
sudo systemctl enable upnqr
```





