sap.ui.define([
    'sap/ui/core/UIComponent'
],function (UIComponent){
    'use strict';
    return UIComponent.extend("ats.fin.ar.Component",{

        //Used to link our maiffet file bcz all the app configuration will be contained inside the manifest
        metadata:{

            manifest:"json"
        },
        //Like inititalization of our component file
        init: function(){

            //Call the base class constructor
            UIComponent.prototype.init.apply(this);

            //Get router from parent class
            var oRouter = this.getRouter();

            //Scan manifest.json for routing configuration
            oRouter.initialize();
        },
        //We will inititialize view and return back
        /*createContent: function(){

            //Instantiate (create object) of root view
            var oView = new sap.ui.view({
                viewName:"ats.fin.ar.view.App",
                type: "XML",
                id: "idAppView"
            });

            //Create both views object
            var oView1 = new sap.ui.view({
                viewName:"ats.fin.ar.view.View1",
                type: "XML",
                id: "idV1"
            });
            var oView2 = new sap.ui.view({
                viewName:"ats.fin.ar.view.View2",
                type: "XML",
                id: "idV2"
            });

            //Get the container control object which is inside our Root view
            var oAppContainerControl = oView.byId("idAppCon");

            //Add the views inside the contianer control - pages , addPage
            oAppContainerControl.addMasterPage(oView1).addDetailPage(oView2);
            return oView;

        },*/
        //Destructor - any clean up code
        destroy:{}
    })
});