sap.ui.define([
    'ats/fin/ar/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/Fragment',
    'sap/m/DisplayListItem'
], function(Controller,JSONModel,MessageToast,MessageBox,Fragment,DisplayListItem){
    'use strict';
    return Controller.extend("ats.fin.ar.controller.Add",{
        onInit: function (){

            this.setMode("Create");
            var oJSONModel = new JSONModel();
            //local model with already tested payload which needs to be sent to odata service
            oJSONModel.setData({
                "prodData": { 
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR", 
                    "CATEGORY": "Notebooks", 
                    "NAME" : "", 
                    "SUPPLIER_ID" : "0100000051", 
                    "SUPPLIER_NAME" : "TECUM", 
                    "DESCRIPTION" : "", 
                    "PRICE" : "00.00", 
                    "CURRENCY_CODE" : "EUR", 
                    "DIM_UNIT" : "CM", 
                    "TAX_TARIF_CODE" : "1"
                }
            });
            this.getView().setModel(oJSONModel, "zkas");
            this.oLocalModel = oJSONModel;
        },
        mode: "Create",
        prodId : "",
        onClear : function(){
            this.oLocalModel.setData({
                "prodData": { 
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR", 
                    "CATEGORY": "Notebooks", 
                    "NAME" : "", 
                    "SUPPLIER_ID" : "0100000051", 
                    "SUPPLIER_NAME" : "TECUM", 
                    "DESCRIPTION" : "", 
                    "PRICE" : "00.00", 
                    "CURRENCY_CODE" : "EUR", 
                    "DIM_UNIT" : "CM", 
                    "TAX_TARIF_CODE" : "1"
                }
            });
            this.setMode("Create");
        },
        onSave: function(){

            //Step 1: Prepare payload and perform pre-checks
            var payload = this.oLocalModel.getProperty("/prodData");
            if(!payload.PRODUCT_ID || !payload.NAME){
                MessageBox.error("Please enter correct data!");
                return;
            }
            //Step 2: Get the odata model object
            var oDataModel = this.getView().getModel();
            //Step 3: Trigger the POST request to send data from fiori app to SAP
            if( this.mode === "Create"){

                oDataModel.create("/ProductSet",payload,{
                    //Step 4: Handle callbacks
                    success: function(){
                        
                        MessageToast.show("The record have been saved to SAP S4hana server");
                    },
                    error: function(oError){
    
                        var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                        MessageBox.error("Oops ! Save has been rejected. Error : " + errorMessage);
                    }
                });
            } 
            else {

                oDataModel.update("/ProductSet('"+ this.prodId+ "')",payload,{
                    //Step 4: Handle callbacks
                    success: function(){
                        
                        MessageToast.show("The record have been updated to SAP S4hana server");
                    },
                    error: function(oError){
    
                        var errorMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                        MessageBox.error("Oops ! Update has been rejected. Error : " + errorMessage);
                    }
                });
            }
            

            
        },
        setMode: function(sMode){

            this.mode= sMode;
            if(sMode === "Create"){
                this.getView().byId("name").setEnabled(true);
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("idDelete").setEnabled(false);
            }
            else{
                
                this.getView().byId("name").setEnabled(false);
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("idDesc").focus();
                this.getView().byId("idDelete").setEnabled(true);
            }

        },
        //oField: null,
        oSupplierPopup: null,
        onF4Supplier: function (oEvent){

            //this.oField= oEvent.getSource();
            var that = this;
            if (!this.oSupplierPopup) {

                Fragment.load({
                    fragmentName:'ats.fin.ar.fragments.popup',
                    type: 'XML',
                    id: 'supplier',
                    controller: this

                }).then(function(oFragment){
                    //inside the callback/promise , we cannot access this pointer viz. our controller object
                    //but we can access local variables of caller function
                    that.oSupplierPopup = oFragment;
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.setTitle("Select Supplier");
                    that.oSupplierPopup.setMultiSelect(false);
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/SupplierSet',
                        template: new DisplayListItem({
                            
                            label:'{COMPANY_NAME}',
                            value:'{BP_ID}'
                            
                        })
                        
                    });
                    that.oSupplierPopup.open();
                    
                });
                
            } else {
                
                that.oSupplierPopup.open();
            }
        },
        onDelete: function(){
            //Step 1: get the odata model object
            var oDataModel = this.getView().getModel();

            //Step 2: call delete - remove function
            var that = this;
            oDataModel.remove("/ProductSet('"+this.prodId+"')",{
                success: function (){
                    //Step 3: handle call back
                    MessageToast.show("Delete is now finished");
                    that.onClear();

                }
            })

        },
        
        onConfirm:function (oEvent) {

            //Step 1: Get the selected item data
            var oSelItem = oEvent.getParameter("selectedItem");
            //Step 2:Get the data of selected item
            var sData = oSelItem.getValue();              
            //Step 3: The object of input field - set data
                this.oLocalModel.setProperty("/prodData/SUPPLIER_ID", sData);
                this.oLocalModel.setProperty("/prodData/SUPPLIER_NAME",oSelItem.getLabel());
            },
        onLoadExp: function () {

            //Step 1: Get the odata model object
            var oDataModel= this.getView().getModel();
            //Step 2: Call function import in odata
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct", {
                urlParameters: {
                    "I_CATEGORY" : this.getView().byId("category").getSelectedKey()
                },
                success: function (data){
                    //Step 3: Success response - set this to local model
                    that.oLocalModel.setProperty("/prodData",data);
                    that.prodId = data.PRODUCT_ID;
                    that.setMode("Edit");
                }
            });
            //Step 3: Handle response, set local model, change mode to edit
        },
        onLoadSingle: function(oEvent){

            //Step 1: Get the ID of the product entered by the user
            this.prodId = oEvent.getSource().getValue();
            this.prodId = this.prodId.toUpperCase();
            //Step 2: Send a GET SINGLE call to our odata using model
            var oDataModel = this.getView().getModel();
            //we cannot this pointer inside callback , so we create a local variable in funciton which can be accessed as 'this' inside callbacks
            var that = this;
            oDataModel.read("/ProductSet('"+ this.prodId +"')",{
                success: function (data){
                    //Step 3: Success response - set this to local model
                    that.oLocalModel.setProperty("/prodData",data);
                    that.setMode("Edit");

                },
                error: function(){
                    //Step 4: Handle error
                    MessageToast.show("The product does not exist");
                    that.setMode("Create");
                }
            })
        }
    });
});