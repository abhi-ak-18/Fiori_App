sap.ui.define([
    'ats/fin/ar/controller/BaseController',
    "sap/ui/core/routing/History"
], function(Controller,History){
    'use strict';
    return Controller.extend("ats.fin.ar.controller.View3",{
        onInit: function(){

            //get the router object from component
            this.oRouter = this.getOwnerComponent().getRouter();

            //Step 2: I register a ROuter matced funcion which will get called everytime we navigate or reach to the detail root
            this.oRouter.getRoute("suppl").attachMatched(this.herculis, this);
        },
    
        herculis: function(oEvent){

            //Step 1: Whatever is th endpoint - extract the fruit Id
            var supId = oEvent.getParameter("arguments").supplierId;

            //Step 2: Construct the path of the element
            var sPath = '/suppliers/' + supId;

            //Step 3:Bind the element to my current view
            this.getView().bindElement(sPath);

        },
        onBack: function(){

            var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.oRouter.navTo("spiderman", {}, true /*no history*/);
			}
        }
        

    });
});