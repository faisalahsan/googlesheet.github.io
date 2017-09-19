var GoogleSheetAPI = {

        settings:{
            fields: ['first_name','last_name','email'],
            fieldErrorColor: '#FFD9D9',
            sheet:{
                id : '1TWKn37mcWstF4f6NeSid3Bh8y1CmXSFb5I8_pNJ-93g', // Enter your Google Sheet ID here
                clid : '1027543415147-26hr7d7irebv8k9b1pr6d3kvaal7dl8q.apps.googleusercontent.com', // Enter your API Client ID here
                clis :'Lg6lNs_owLoIIw4HedOigqua', // Enter your API Client Secret here
                rtok :'1/QNeBueGkfrAJYPv-MdKfJg-GMVyppLwLnPqRMLMJHsY', // Enter your OAuth Refresh Token here, 
            }
        },

        // initiliaze the GOOGLE SHEET Module
        init: function() {
            GoogleSheetAPI.bindUI();
        },

        bindUI: function() {

            //-------------------------------------------------------------------------
            //Listing events
            //------------------------------------------------------------------------
            $(document).on('click', '#submit', function( event ){
               
               debugger 
                if( !GoogleSheetAPI.validateForm() ){
                    event.preventDefault();
                    return false;    
                }
                    GoogleSheetAPI.getAccessToken();

            });
        }, 

        validateForm: function(){

            // Check Fields
            for( i=0; i < GoogleSheetAPI.settings.fields.length; ++i) {

                var field = GoogleSheetAPI.settings.fields[i];
                $('#'+field).css('backgroundColor', 'inherit');
                var value = $('#'+field).val();       
                
                // Validate Field
                if(!value) {
                    if(field != 'message') {
                        $('#'+field).css('backgroundColor', GoogleSheetAPI.settings.fieldErrorColor);
                        return false;
                        break;
                    }
                }
            }

            return true;
        },
        getFormData : function(){
            
            var row = '';
            for( i=0; i < GoogleSheetAPI.settings.fields.length; ++i) {

                var field = GoogleSheetAPI.settings.fields[i];
                var value = $('#'+field).val();
               // Sheet Data
              row += '"'+value+'",';
            }
            row = row.slice(0, -1);   
            return '{"majorDimension":"ROWS", "values":[['+row+']]}';
        },
        clearFormData : function(){
            
            var row = '';
            for( i=0; i < GoogleSheetAPI.settings.fields.length; ++i) {

                var field = GoogleSheetAPI.settings.fields[i];
                $('#'+field).val(null);
            }
            row = row.slice(0, -1);   
            return '{"majorDimension":"ROWS", "values":[['+row+']]}';
        },
        getAccessToken: function(){
            $.ajax({
              type: "POST",
              beforeSend: function(request) {
                request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
              },
              url: GoogleSheetAPI.getAccessTokenURL(),
              success: function(response) {
                    alert("success");
                    console.log(response);
                    var accessToken = response.access_token; 
                    var sheetData = GoogleSheetAPI.getFormData();

                        // // HTTP Request Append Data
                         if(accessToken) {
                          GoogleSheetAPI.postDataToGoogleSheet( accessToken, sheetData );
                        }
              }
            });
        },
        postDataToGoogleSheet:function( accessToken, sheetData){
            $.ajax({
                type: "POST",
                beforeSend: function(request) {
                    request.setRequestHeader('Content-length', sheetData.length);
                    request.setRequestHeader('Content-type', 'application/json');
                    request.setRequestHeader('Authorization', 'OAuth ' + accessToken);
                },
                url: GoogleSheetAPI.getGoogleSheetURL(),
                data:sheetData,
                success: function(response) {
                    alert("success");
                    console.log(response);
                    GoogleSheetAPI.clearFormData();
                }
            });
        },
        getAccessTokenURL: function(){
            return 'https://www.googleapis.com/oauth2/v4/token?client_id='+GoogleSheetAPI.settings.sheet.clid+'&client_secret='+GoogleSheetAPI.settings.sheet.clis+'&refresh_token='+GoogleSheetAPI.settings.sheet.rtok+'&grant_type=refresh_token';
        },
        getGoogleSheetURL: function(){
            return 'https://sheets.googleapis.com/v4/spreadsheets/'+GoogleSheetAPI.settings.sheet.id+'/values/A1:append?includeValuesInResponse=false&insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=USER_ENTERED';
        }

};