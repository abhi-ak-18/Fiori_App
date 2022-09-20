sap.ui.define([
    'ats/fin/ar/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(Controller,Filter,FilterOperator){
    'use strict';
    return Controller.extend("ats.fin.ar.controller.View1",{
        onInit:function(){

            //get the router object from component js
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onGoTo: function(sFruitIndex){
           
            this.oRouter.navTo("superman",{
                fruitId: sFruitIndex
            });
            //Step 1: Get the parent object - App Con
            //var oAppCon = this.getView().getParent();
            //Step 2:Navigate to second view
            //oAppCon.to("idV2");

        },
        onListItemSelect: function(oEvent){

            //Step 1:Get the item which was selected by user
            var oSelectedItem = oEvent.getParameter("listItem");

            //Step 2:Path of the element (memory) of the selected item
            var sPath = oSelectedItem.getBindingContextPath();

            //Step 3:Get the view 2 object
            //var oSplitApp = this .getView().getParent().getParent();
            //var oV2= oSplitApp.getDetailPages()[0];

            //Step 4:Bind the element of selected item to v2 - element binding
            //oV2.bindElement(sPath);
            var sIndex = sPath.split("/")[sPath.split("/").length -1];
            this.onGoTo(sIndex);
        },
        onDeleteItem: function(oEvent){

            //Step 1:Get the object of the list item on which user clicked delete
            var itemToBeDeleted= oEvent.getParameter("listItem");

            //Step 2:Get the object of list control
            //var oList = this.getView().byId("idList");
            var oList = oEvent.getSource();
            //Step 3:Ask list control to delete the item
            oList.removeItem(itemToBeDeleted);
        },
        onSearch: function(oEvent){

            //Step 1: Get to know what was searched by user
            var sText= oEvent.getParameter("query");
            
            //Step 2: Construct a filter object
            var oFilter1= new Filter("CATEGORY",FilterOperator.Contains, sText);
            //Add another filter for type of fruit
            /* var oFilter2= new Filter("type",FilterOperator.Contains, sText);

            //Put all filters inside of an array
            var aFilters = [oFilter1,oFilter2];

            //Construct one more filter with OR
            var oFilter= new Filter({
                filters:aFilters,
                and:false
            }); */

            //Step 3: Get the list object
            var oList = this.getView().byId("idList");

            //Step 4:Inject the filter inside the binding of items
            oList.getBinding("items").filter(oFilter1);


        },
        onAddProduct:function () {

            this.oRouter.navTo("add");
            
        }

    });
});