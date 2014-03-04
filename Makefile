BOWER=bower_components

all: vendors

vendors: vendor/angular/ vendor/bootstrap/ vendor/font-awesome/

vendor/angular/:
	mkdir -p vendor/angular
	cp $(BOWER)/angular/angular.js vendor/angular/

vendor/bootstrap/:
	mkdir -p vendor/bootstrap/css
	cp $(BOWER)/bootstrap/dist/css/bootstrap.css vendor/bootstrap/css/

vendor/font-awesome/:
	mkdir -p vendor/font-awesome
	cp -r $(BOWER)/font-awesome/fonts vendor/font-awesome/
	cp -r $(BOWER)/font-awesome/css vendor/font-awesome/
