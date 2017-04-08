/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

VaultShortcut = {
	Launch: function () {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.vault-shortcut.");
		
		var exePaths = [], lastPassUrl = "";
		var browser = prefs.getCharPref("browser");
		  
		switch (browser) {
			case "chrome":
				exePaths = [
					"/usr/local/bin/google-chrome",
					"/usr/bin/google-chrome",
					"/usr/local/bin/chromium",
					"/usr/bin/chromium",
					"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
					"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
				];
				lastPassUrl = "chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/vault.html";
				break;
			case "vivaldi":
				exePaths = [
					"/usr/local/bin/vivaldi",
					"/usr/bin/vivaldi",
					"C:\\Program Files\\Vivaldi\\Application\\vivaldi.exe",
					"C:\\Program Files (x86)\\Vivaldi\\Application\\vivaldi.exe",
				];
				lastPassUrl = "chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/vault.html";
				break;
			case "ie":
				exePaths = [
					"C:\\Program Files\\Internet Explorer\\iexplore.exe",
					"C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe",
				];
				var env = Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment);
				var appdata = env.get("USERPROFILE")
				if (appdata) {
					lastPassUrl = appdata + "\\AppData\\LocalLow\\LastPass\\newvault\\vault.html";
				}
				
				break;
			case "firefox":
				exePaths = [
					"/usr/local/bin/firefox",
					"/usr/bin/firefox",
					"C:\\Program Files\\Mozilla Firefox\\firefox.exe",
					"C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
				];
				lastPassUrl = "resource://support-at-lastpass-dot-com/data/vault.html";
				break;
		}
		
		if (prefs.getCharPref("exe-path")) {
			exePaths = [prefs.getCharPref("exe-path")];
		}
		lastPassUrl = prefs.getCharPref("lastpass-url") || lastPassUrl;
		
		var _nsIFile = Components.Constructor("@mozilla.org/file/local;1", "nsILocalFile", "initWithPath");
		
		var file;
		for (var i=0; i<exePaths.length; i++) {
			try {
				file = new _nsIFile(exePaths[i]);
				if (file.isFile()) break;
			} catch (e) {
				file = null;
			}
		}
		
		if (file == null || !file.isFile()) {
			var title = "Vault Shortcut";
			var message = "The selected browser could not be found. Please check the Vault Shortcut settings in Add-on Manager.";
			try {
				Components.classes['@mozilla.org/alerts-service;1']
					.getService(Components.interfaces.nsIAlertsService)
					.showAlertNotification(null, title, message, false, '', null);
			} catch (e) {
				Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
					.getService(Components.interfaces.nsIPromptService)
					.alert(null, title, message);
			}
		} else {
			var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
			process.init(file);
			var run = "runw" in process ? process.runw : process.run;
			run.call(process, false, [lastPassUrl], 1);
		}
	}
}