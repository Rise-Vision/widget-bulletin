var RiseVision = RiseVision || {};
RiseVision.Bulletin = RiseVision.Bulletin || {};
RiseVision.Bulletin.Settings = {};

RiseVision.Bulletin.Settings = function() {
    var prefs = new gadgets.Prefs();

    this.folderID = prefs.getString("folderID");
    this.fileID = prefs.getString("fileID");
    this.refreshInterval = prefs.getInt("refreshInterval") == 0 ? 5 : prefs.getInt("refreshInterval");
    //Change this to proper URL.
    this.editorURL = window.location.protocol + "//" + window.location.host + "/" + "Bulletin-Editor/editor.html?";
    this.bulletin = new RiseVision.Bulletin({
        "fileID" : this.fileID
    });
}
RiseVision.Bulletin.Settings.prototype.init = function() {
    var self = this, prefs;

    gadgets.rpc.register("rscmd_getSettings", this.getSettings);

    $("#select").click(function() {
        if (auth.oauthToken) {
            var request, view, picker;

            //Try to find the Bulletins folder on Google Drive.
            request = gapi.client.request({
                "path" : "drive/v2/files",
                "method" : "GET",
                "params" : {
                    "q" : "mimeType = 'application/vnd.google-apps.folder' and title = 'Bulletins' and trashed = false"
                }
            });

            request.execute(function(resp) {
                var origin = "http://rva.risevision.com/";

                if (resp.items.length > 0) {
                    //Show the files in the first Bulletins folder, if there is more than one.
                    view = new google.picker.DocsView(google.picker.ViewId.FOLDERS).setParent(resp.items[0].id);
                    $("#error").hide();
                }
                else {
                    $("#error").text("No Bulletins found").show();

                    return;
                }

                view.setMimeTypes("text/html");

                picker = new google.picker.PickerBuilder().setAppId("726689182011").setOrigin(origin).setOAuthToken(auth.oauthToken).addView(view).setCallback(function(data) {
                    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                        var doc = data[google.picker.Response.DOCUMENTS][0];
                        settings.folderID = doc.parentId;
                        settings.fileID = doc.id;
                        settings.bulletin.setFolderID(doc.parentId);
                        settings.bulletin.setFileID(doc.id);

                        if (doc.parentId != null) {
                            $("#edit").attr("href", settings.editorURL + "folderID=" + doc.parentId + "&fileID=" + doc.id).show();
                        }
                        else {
                            $("#edit").attr("href", settings.editorURL + "fileID=" + doc.id).show();
                        }

                        settings.bulletin.getResolution(function(width, height) {
                            prefs = new gadgets.Prefs();

                            $("#name").text(doc.name + " (" + width + " x " + height + ")").addClass("spacer");
                            $("#error").hide();

                            if ((width != prefs.getInt("rsW")) || (height != prefs.getInt("rsH"))) {
                                $("#error").text("The Placeholder and Bulletin have different resolutions.").show();
                            }
                        });
                    }
                }).build();

                picker.setVisible(true);
            });
        }
    });

    $("#new").on("click", function() {
        $("#newBulletin").show();
    });

    $("#save").on("click", function() {
        self.getSettings();
    });

    $("#saveName").on("click", function() {
        self.bulletin.setName($.trim($("#bulletinName").val()));
        self.folderID = null;
        self.bulletin.setFolderID(null);

        $("#newBulletin").hide();
        $("#error").hide();

        window.open(self.editorURL + "name=" + encodeURIComponent($.trim($("#bulletinName").val())))
    });

    $("#cancelName").on("click", function() {
        $("#newBulletin").hide();
    });

    $("#refreshInterval").val(this.refreshInterval);

    //Get the bulletin from Google Drive.
    if (this.fileID != "") {
        gapi.client.load("drive", "v2", function() {
            var request = gapi.client.drive.files.get({
                "fileId" : self.fileID
            });

            request.execute(function(resp) {
                if (resp.error != null) {
                    console.log("Unable to get Bulletin from Google Drive " + resp.error.message);
                }
                else {
                    if (resp.parents != null) {
                        self.folderID = resp.parents[0].id;
                        self.bulletin.setFolderID(resp.parents[0].id);
                        $("#edit").attr("href", self.editorURL + "folderID=" + resp.parents[0].id + "&fileID=" + self.fileID).show();
                    }
                    else {
                        $("#edit").attr("href", self.editorURL + "fileID=" + self.fileID).show();
                    }

                    self.bulletin.getResolution(function(width, height) {
                        prefs = new gadgets.Prefs();

                        $("#name").text(resp.title + " (" + width + " x " + height + ")").addClass("spacer");
                        $("#error").hide();

                        if ((width != prefs.getInt("rsW")) || (height != prefs.getInt("rsH"))) {
                            $("#error").text("The Placeholder and Bulletin have different resolutions.").show();
                        }
                    });
                }

                $("#wrapper").show();
            });
        });
    }
    else {
        $("#wrapper").show();
    }
}
RiseVision.Bulletin.Settings.prototype.onBulletinCreated = function(params) {
    this.folderID = params.folderID;
    this.fileID = params.fileID;

    $("#name").text($("#bulletinName").val() + " (" + params.width + " x " + params.height + ")").addClass("spacer");
    $("#edit").attr("href", this.editorURL + "folderID=" + params.folderID + "&fileID=" + params.fileID).show();

    if ((width != prefs.getInt("rsW")) || (height != prefs.getInt("rsH"))) {
        $("#error").text("The Placeholder and Bulletin have different resolutions.").show();
    }
}
RiseVision.Bulletin.Settings.prototype.getSettings = function() {
    var params = "", settings = null;

    params = "up_folderID=" + this.folderID + "&up_fileID=" + this.fileID + "&up_refreshInterval=" + $("#refreshInterval").val();

    var settings = {
        params : params,
        additionalParams : ""
    };

    gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
}