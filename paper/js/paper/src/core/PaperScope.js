/*
 * Paper.js
 *
 * This file is part of Paper.js, a JavaScript Vector Graphics Library,
 * based on Scriptographer.org and designed to be largely API compatible.
 * http://paperjs.org/
 * http://scriptographer.org/
 *
 * Copyright (c) 2011, Juerg Lehni & Jonathan Puckey
 * http://lehni.org/ & http://jonathanpuckey.com/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

/**
 * @name PaperScope
 *
 * @class The {@code PaperScope} class represents the scope associated with a
 * Paper context. When working with PaperScript, these scopes are automatically
 * created for us, and through clever scoping the properties and methods of the
 * active scope seem to become part of the global scope.
 *
 * When working with normal JavaScript code, {@code PaperScope} objects need to
 * be manually created and handled.
 *
 * Paper classes can only be accessed through {@code PaperScope} objects. Thus
 * in PaperScript they are global, while in JavaScript, they are available on
 * the global {@link paper} object. For JavaScript you can use
 * {@link PaperScope#install(scope) } to install the Paper classes and objects
 * on the global scope. Note that when working with more than one scope, this
 * still works for classes, but not for objects like {@link PaperScope#project},
 * since they are not updated in the injected scope if scopes are switched.
 *
 * The global {@link paper} object is simply a reference to the currently active
 * {@code PaperScope}.
 */
var PaperScope = this.PaperScope = Base.extend(/** @lends PaperScope# */{

	/**
	 * Creates a PaperScope object.
	 *
	 * @name PaperScope#initialize
	 * @function
	 */
	initialize: function(script) {
		// script is only used internally, when creating scopes for PaperScript.
		// Whenever a PaperScope is created, it automatically becomes the active
		// one.
		paper = this;
		this.view = null;
		this.views = [];
		this.project = null;
		this.projects = [];
		this.tool = null;
		this.tools = [];
		// Assign an id to this canvas that's either extracted from the script
		// or automatically generated.
		this._id = script && (script.getAttribute('id') || script.src)
				|| ('paperscope-' + (PaperScope._id++));
		// Make sure the script tag also has this id now. If it already had an
		// id, we're not changing it, since it's the first option we're
		// trying to get an id from above.
		if (script)
			script.setAttribute('id', this._id);
		PaperScope._scopes[this._id] = this;
	},

	/**
	 * The version of Paper.js, as a float number.
	 *
	 * @type Number
	 */
	version: /*#=*/ options.version,

	/**
	 * The currently active project.
	 * @name PaperScope#project
	 * @type Project
	 */

	/**
	 * The list of all open projects within the current Paper.js context.
	 * @name PaperScope#projects
	 * @type Project[]
	 */

	/**
	 * The active view of the active project.
	 * @name PaperScope#view
	 * @type View
	 */

	/**
	 * The list of view of the active project.
	 * @name PaperScope#views
	 * @type View[]
	 */

	/**
	 * The reference to the active tool.
	 * @name PaperScope#tool
	 * @type Tool
	 */

	/**
	 * The list of available tools.
	 * @name PaperScope#tools
	 * @type Tool[]
	 */

	evaluate: function(code) {
		var res = PaperScript.evaluate(code, this);
		View.updateFocus();
		return res;
	},

	/**
	 * Injects the paper scope into any other given scope. Can be used for
	 * examle to inject the currently active PaperScope into the window's global
	 * scope, to emulate PaperScript-style globally accessible Paper classes and
	 * objects:
	 *
	 * @example
	 * paper.install(window);
	 */
	install: function(scope) {
		// Define project, view and tool as getters that redirect to these
		// values on the PaperScope, so they are kept up to date
		var that = this;
		Base.each(['project', 'view', 'tool'], function(key) {
			Base.define(scope, key, {
				configurable: true,
				writable: true,
				get: function() {
					return that[key];
				}
			});
		});
		// Copy over all fields from this scope to the destination.
		// Do not use Base.each, since we also want to enumerate over
		// fields on PaperScope.prototype, e.g. all classes
		for (var key in this) {
			if (!/^(version|_id|load)/.test(key) && !(key in scope))
				scope[key] = this[key];
		}
	},

	/**
	 * Sets up an empty project for us. If a canvas is provided, it also creates
	 * a {@link View} for it, both linked to this scope.
	 *
	 * @param {HTMLCanvasElement} canvas The canvas this scope should be
	 * associated with.
	 */
	setup: function(canvas) {
		// Create an empty project for the scope.
		// Make sure this is the active scope, so the created project and view
		// are automatically associated with it.
		paper = this;
		this.project = new Project();
		// Create a view for the canvas.
		if (canvas)
			this.view = new View(canvas);
	},

	clear: function() {
		// Remove all projects, views and tools.
		for (var i = this.projects.length - 1; i >= 0; i--)
			this.projects[i].remove();
		// This also removes the installed event handlers.
		for (var i = this.views.length - 1; i >= 0; i--)
			this.views[i].remove();
		for (var i = this.tools.length - 1; i >= 0; i--)
			this.tools[i].remove();
	},

	remove: function() {
		this.clear();
		delete PaperScope._scopes[this._id];
	},

	_needsRedraw: function() {
		// Make sure we're not looping through the view list each time...
		if (!this._redrawNotified) {
			for (var i = this.views.length - 1; i >= 0; i--)
				this.views[i]._redrawNeeded = true;
			this._redrawNotified = true;
		}
	},

	statics: /** @lends PaperScope */{
		_scopes: {},
		_id: 0,

		/**
		 * Retrieves a PaperScope object with the given id or associated with
		 * the passed canvas element.
		 *
		 * @param id
		 */
		get: function(id) {
			// If a script tag is passed, get the id from it.
			if (typeof id === 'object')
				id = id.getAttribute('id');
			return this._scopes[id] || null;
		},

		/**
		 * Iterates over all active scopes and calls the passed iterator
		 * function for each of them.
		 *
		 * @param iter the iterator function.
		 */
		each: function(iter) {
			Base.each(this._scopes, iter);
		}
	}
});
