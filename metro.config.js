/* eslint-disable no-undef */
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
	// [Web-only]: Enables CSS support in Metro.
	isCSSEnabled: true,
});

config.watcher.additionalExts.push('mjs', 'cjs');

module.exports = config;
