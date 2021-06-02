sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
 ], function (Controller, MessageToast, ResourceModel, Filter,  FilterOperator) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.CheckoutBookTable", {

      onInit : function () {
         // set i18n model on view
         var i18nModel = new ResourceModel({
            bundleName: "org.ubb.books.i18n.i18n"
         });
         this.getView().setModel(i18nModel, "i18n");
      },

      onBookBook(oEvent) {
            const aSelectedContexts = this.byId("searchedBookTable").getSelectedContexts();
            const sPath = aSelectedContexts[0].getPath();

            var selRow = this.byId("searchedBookTable").getModel().getProperty(sPath);
            var availableVal = parseInt(selRow.NoAvailableBooks);

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var successMsg = oBundle.getText("checkoutSuccess", [sRecipient]);
            var errorBackMsg = oBundle.getText("checkoutBackError", [sRecipient]);
            var errorFrontMsg = oBundle.getText("checkoutFrontError", [sRecipient]);

            if(availableVal > 0 ) {
               selRow.NoAvailableBooks = parseInt(selRow.NoAvailableBooks) - 1;

               var oBook =  {
                  Isbn: selRow.Isbn,
                  Title: "",
                  Author: "",
                  Published: selRow.Published,
                  Language: "",
                  NoAvailableBooks: 0
              };

               this.getView().getModel().create("/CheckoutBook", oBook, {
                  success: function () {
                     MessageToast.show(successMsg);
                  },
                  error: function () {
                     MessageToast.show(errorBackMsg);
                  }
               }); 
            } else {
               MessageToast.show(errorFrontMsg);
            }
      }, 

      onSearchButtonPressed(oEvent){
         var isbn = this.byId("inputISBN").getValue();
         var title = this.byId("inputTitle").getValue();
         var author = this.byId("inputAuthor").getValue();
         var language = this.byId("inputLanguage").getValue();
         var dateStart = this.byId("inputDateStart").getValue();
         var dateEnd = this.byId("inputDateEnd").getValue();

         var aFilter = [];
         var oList = this.getView().byId("searchedBookTable");
         var oBinding = oList.getBinding("items");

         if (isbn) {
             aFilter.push(new Filter("Isbn", FilterOperator.Contains, isbn))
         }
         if (author) {
              aFilter.push(new Filter("Author", FilterOperator.Contains, author));
         }
         if (title) {
              aFilter.push(new Filter("Title", FilterOperator.Contains, title));
         }
         if (dateStart && dateEnd) {
              var filter = new Filter("Published", FilterOperator.BT, dateStart, dateEnd);
              aFilter.push(filter);
         }
         if (language) {
              aFilter.push(new Filter("Language", FilterOperator.Contains, language));
         }
         oBinding.filter(aFilter);
     }

    });
 });