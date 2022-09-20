sap.ui.define([
    'ats/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(Controller,MessageBox,MessageToast,Fragment,DisplayListItem,Filter,FilterOperator){
    'use strict';
    return Controller.extend("ats.fin.ar.controller.View2",{
        onInit: function(){

            //get the router object from component
            this.oRouter = this.getOwnerComponent().getRouter();

            //Step 2: I register a ROuter matced funcion which will get called everytime we navigate or reach to the detail root
            this.oRouter.getRoute("superman").attachMatched(this.herculis,this);
        },
        onSupplierSelect: function (oEvent) {
            
            //Step 1:Get the selected item objct from the table
            var oSelectedItem = oEvent.getParameter("listItem");

            //Step 2: Get the path of the selected item (memory address)
            var sPath = oSelectedItem.getBindingContextPath();

            //Extract index
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];

            //Step 3:Drill down to next screen by passing the index of supplier data
            this.oRouter.navTo("suppl",{
                supplierId: sIndex
            });
        },
        herculis: function (oEvent){

            //Step 1: Whatever is th endpoint - extract the fruit Id
            var fruitId = oEvent.getParameter("arguments").fruitId;

            //Step 2: Construct the path of the element
            var sPath = '/' + fruitId;

            //Step 3:Bind the element to my current view
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });
            //Get the object of the image
            var oImage = this.getView().byId("idImg");

            //Get the service path from manifest json
            var sServicePath = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.anubhavService.uri;

            //Construct hte address of the image / $value
            var sProdId = fruitId.split("'")[1];
            sServicePath = sServicePath + "ProductImgSet('"+sProdId+"')/$value"

            //Bind the same to the image control
            oImage.setSrc(sServicePath);
        },
        //THis global object of supplier popup will act like a remote control
        oSupplierPopup:null,
        onFilterSupplier: function(){

            //MessageBox.confirm("This funcitonaity is under construction ;)");
            var that = this;
            if (!this.oSupplierPopup) {
                
                Fragment.load({
                    fragmentName:"ats.fin.ar.fragments.popup",
                    type:"XML",
                    id:"supplier",
                    controller:this
                }).then(function(oFragment){
    
                    //inside the callback/promise , we cannot access this pointer viz. our controller object
                    //but we can access local variables of caller function
                    that.oSupplierPopup = oFragment;
                    that.oSupplierPopup.setTitle("Suppliers");
                    //Grant the access of all resources which view also has access to - model
                    //allowing parasite(fragment) to access body part (model) through immune system(view)
                    that.getView().addDependent(that.oSupplierPopup);
                    //Here oSupplierPopup is te remote control of the fragment
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/suppliers',
                        template: new DisplayListItem({
                            
                            label:'{name}',
                            value:'{city}'
                            
                        })
                        
                    });
                    that.oSupplierPopup.open();

    
                });
            } else {
                that.oSupplierPopup.open();
                
            }

        },
        oCityPopup:null,
        oField:null,
        onF4Help: function(oEvent){
            
            //MessageBox.confirm("This funcitonaity is under construction ;)");
            var that = this;
            this.oField= oEvent.getSource();
            if (!this.oCityPopup) {

                Fragment.load({
                    fragmentName:"ats.fin.ar.fragments.popup",
                    type:"XML",
                    id:"cities",
                    controller:this

                }).then(function(oFragment){
                    //inside the callback/promise , we cannot access this pointer viz. our controller object
                    //but we can access local variables of caller function
                    that.oCityPopup = oFragment;
                    that.oCityPopup.setTitle("Cities");
                    that.oCityPopup.setMultiSelect(false);
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new DisplayListItem({
                            
                            label:'{name}',
                            value:'{famousFor}'
                            
                        })
                        
                    });
                    that.oCityPopup.open();
                    
                })
                
            } else {
                
                that.oCityPopup.open();
            }
        },
        
        onConfirm:function (oEvent) {

            //Step 1: Get the selected item data
            var oSelItem = oEvent.getParameter("selectedItem");
            //Step 2:Get the data of selected item
            var sData = oSelItem.getLabel();
            //We need a safeguarding mech to prevent udpation of other popup when its changed on one popup
            var sId =oEvent.getSource().getId();
            if (sId.indexOf("cities") != -1) {
                
                //Step 3: The object of input field - set data
                this.oField.setValue(sData);

            } else {
                //Do nothing for now
            }


        },
        onSearchPopup: function(oEvent){

            //Step 1: Get the value what user searched
            var sQuery = oEvent.getParameter("value");

            //Step 2: Prepare a filter for search
            var oSFilter = new Filter("name", FilterOperator.Contains, sQuery);

            //Step 3:Inject the filter
            var oPopup = oEvent.getSource();
            oPopup.getBinding("items").filter(oSFilter);

        },

        onBack: function(){

            //this.getView().getParent().to("idEmpty");
            this.oRouter.navTo("spiderman");
        },
        onSave: function(){

            var oResource = this.getView().getModel('i18n');
            var oResourceBundle = oResource.getResourceBundle();
            MessageBox.confirm("Do you want to save?",{
                onClose: function(status){
                    if(status === "OK"){

                        var sMsgText = oResourceBundle.getText("XMSG_SUCCESS",["999"]);
                        MessageToast.show(sMsgText);
                    }
                    else{
                        
                        MessageToast.show("Oops ! Something went wrong with us :(");

                    }
                }
            });

        }

    });
});