/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

VaultShortcut = {
	Launch: function () {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.vault-shortcut.");
		
		var exePaths = [], macBundleId = "", lastPassUrl = "";
		var browser = prefs.getCharPref("browser");
		  
		switch (browser) {
			case "chrome":
				exePaths = [
					"/usr/local/bin/google-chrome",
					"/usr/bin/google-chrome",
					"/usr/local/bin/chromium-browser",
					"/usr/bin/chromium-browser",
					"/usr/local/bin/chromium",
					"/usr/bin/chromium",
					"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
					"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
				];
				macBundleId = "com.google.Chrome";
				lastPassUrl = "chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/vault.html";
				break;
			case "vivaldi":
				exePaths = [
					"/usr/local/bin/vivaldi",
					"/usr/bin/vivaldi",
					"C:\\Program Files\\Vivaldi\\Application\\vivaldi.exe",
					"C:\\Program Files (x86)\\Vivaldi\\Application\\vivaldi.exe",
				];
				macBundleId = "com.vivaldi.Vivaldi";
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
				macBundleId = "org.mozilla.firefox";
				lastPassUrl = "resource://support-at-lastpass-dot-com/data/vault.html";
				break;
		}
		
		var showNotFoundMessage = function () {
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
		};
		
		var os = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
		var _nsIFile = Components.Constructor("@mozilla.org/file/local;1", "nsILocalFile", "initWithPath");
		var exePathPref = prefs.getCharPref("exe-path");
		
		if (os == "Darwin" && macBundleId && !exePathPref) {
			var openExe = new _nsIFile("/usr/bin/open");
			if (openExe.isFile()) {
				var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
				process.init(openExe);
				process.runwAsync(["-b", macBundleId, "--args", lastPassUrl], 4, {
					observe: function (subject, topic, data) {
						if (topic == "process-failed" || subject.exitValue != 0) {
							showNotFoundMessage();
						}
					}
				});
				return;
			}
		}
		
		if (exePathPref) {
			exePaths = [exePathPref];
		}
		lastPassUrl = prefs.getCharPref("lastpass-url") || lastPassUrl;
		
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
			showNotFoundMessage();
		} else {
			var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
			process.init(file);
			process.runw(false, [lastPassUrl], 1);
		}
	}
}
