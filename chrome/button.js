/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

VaultShortcut = {
	Launch: function () {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.vault-shortcut.");
		
		var exePath, lastPassUrl;
		var browser = prefs.getCharPref("browser");
		
		switch (browser) {
			case "vivaldi":
				exePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
				lastPassUrl = "chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/vault.html";
				break;
			case "chrome":
				exePath = "C:\\Program Files (x86)\\Vivaldi\\Application\\vivaldi.exe";
				lastPassUrl = "chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/vault.html";
				break;
			case "ie":
				exePath = "C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe";
				lastPassUrl = "C:\\Users\\ischemm\\AppData\\LocalLow\\LastPass\\newvault\\vault.html";
				break;
			case "firefox":
			default:
				exePath = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
				lastPassUrl = "resource://support-at-lastpass-dot-com/data/vault.html";
				break;
		}
		
		exePath = prefs.getCharPref("exe-path") || exePath;
		lastPassUrl = prefs.getCharPref("lastpass-url") || lastPassUrl;
		
		var _nsIFile = Components.Constructor("@mozilla.org/file/local;1", "nsIFile", "initWithPath");
		var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		process.init(new _nsIFile(exePath));
		var run = "runw" in process ? process.runw : process.run;
		run.call(process, false, [lastPassUrl], 1);
	}
}