
kmoyse@kmoyse-Precision-T1700:~/akgsworkspace/kwp-angular2$ npm run build

> kwp-angular2@1.0.0 build /home/kmoyse/akgsworkspace/kwp-angular2
> rm -rf lib && npm run tsc:src


> kwp-angular2@1.0.0 tsc:src /home/kmoyse/akgsworkspace/kwp-angular2
> tsc -p src

kmoyse@kmoyse-Precision-T1700:~/akgsworkspace/kwp-angular2$ ls
angular-cli.json  components.d.ts  components.js  dist  e2e  karma.conf.js  lib  node_modules  package.json  protractor.conf.js  README.md  src  tslint.json
kmoyse@kmoyse-Precision-T1700:~/akgsworkspace/kwp-angular2$ npm adduser
Username: akigrafsoft
Password: 
Email: (this IS public) akigrafsoft@gmail.com
Logged in as akigrafsoft on https://registry.npmjs.org/.
kmoyse@kmoyse-Precision-T1700:~/akgsworkspace/kwp-angular2$ npm publish
+ kwp-angular2@1.0.0

Consume it !  :
npm install kwp-angular2

OR to install it loccaly only :

cd ~/akgsworkspace/KWebAngular2/src/main/webapp/node_modules/kwp-angular2
cp -r ~/akgsworkspace/kwp-angular2/lib .
cp  ~/akgsworkspace/kwp-angular2/auth.* .
cp  ~/akgsworkspace/kwp-angular2/calendar.* .
cp  ~/akgsworkspace/kwp-angular2/configuration.* .
cp  ~/akgsworkspace/kwp-angular2/files.* .
cp  ~/akgsworkspace/kwp-angular2/jnlp.* .
cp  ~/akgsworkspace/kwp-angular2/maps.* .
cp  ~/akgsworkspace/kwp-angular2/mongodb.* .
cp  ~/akgsworkspace/kwp-angular2/pagedlist.* .
cp  ~/akgsworkspace/kwp-angular2/pipes.* .
cp  ~/akgsworkspace/kwp-angular2/users.* .
    