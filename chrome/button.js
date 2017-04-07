/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

VaultShortcut = {
	Launch: () => {
		let prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.vaultshortcut.");
		
		let firefoxPath = prefs.getCharPref("firefox-path") || "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
		let lastPassUrl = prefs.getCharPref("lastpass-url") || "resource://support-at-lastpass-dot-com/data/vault.html";
		
		let _nsIFile = Components.Constructor("@mozilla.org/file/local;1", "nsIFile", "initWithPath");
		let process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		process.init(new _nsIFile(firefoxPath));
		let run = "runw" in process ? process.runw : process.run;
		run.call(process, false, [lastPassUrl], 1);
	}
}