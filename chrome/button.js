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
					"/usr/local/bin/chrome",
					"/usr/bin/chrome",
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
		
		var _nsIFile = Components.Constructor("@mozilla.org/file/local;1", "nsIFile", "initWithPath");
		var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		
		var file;
		for (var i=0; i<exePaths.length; i++) {
			try {
				file = new _nsIFile(exePaths[i]);
				if (file.isFile()) break;
			} catch (e) {}
		}
		
		if (file === null || !file.isFile()) {
			// TODO: show error message and quit
		}
		
		process.init(file);
		var run = "runw" in process ? process.runw : process.run;
		run.call(process, false, [lastPassUrl], 1);
	}
}