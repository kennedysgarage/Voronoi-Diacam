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
 * @name Project
 *
 * @class A Project object in Paper.js is what usually is referred to as the
 * document: The top level object that holds all the items contained in the
 * scene graph. As the term document is already taken in the browser context,
 * it is called Project.
 *
 * Projects allow the manipluation of the styles that are applied to all newly
 * created items, give access to the selected items, and will in future versions
 * offer ways to query for items in the scene graph defining specific
 * requirements, and means to persist and load from different formats, such as
 * SVG and PDF.
 *
 * The currently active project can be accessed through the
 * {@link PaperScope#project} variable.
 *
 * An array of all open projects is accessible through the
 * {@link PaperScope#projects} variable.
 */
var Project = this.Project = PaperScopeItem.extend(/** @lends Project# */{
	_list: 'projects',
	_reference: 'project',

	// TODO: Add arguments to define pages
	/**
	 * Creates a Paper.js project.
	 *
	 * When working with PaperScript, a project is automatically created for us
	 * and the {@link PaperScope#project} variable points to it.
	 */
	initialize: function() {
		// Activate straight away so paper.project is set, as required by
		// Layer and DoumentView constructors.
		this.base(true);
		this._currentStyle = new PathStyle();
		this._selectedItems = {};
		this._selectedItemCount = 0;
		this.layers = [];
		this.symbols = [];
		this.activeLayer = new Layer();
	},

	_needsRedraw: function() {
		if (this._scope)
			this._scope._needsRedraw();
	},

	/**
	 * Activates this project, so all newly created items will be placed
	 * in it.
	 *
	 * @name Project#activate
	 * @function
	 */

	/**
	 * Removes this project from the {@link PaperScope#projects} list.
	 *
	 * @name Project#remove
	 * @function
	 */

	/**
	 * The currently active path style. All selected items and newly
	 * created items will be styled with this style.
	 *
	 * @type PathStyle
	 * @bean
	 *
	 * @example {@paperscript}
	 * project.currentStyle = {
	 * 	fillColor: 'red',
	 * 	strokeColor: 'black',
	 * 	strokeWidth: 5
	 * }
	 *
	 * // The following paths will take over all style properties of
	 * // the current style:
	 * var path = new Path.Circle(new Point(75, 50), 30);
	 * var path2 = new Path.Circle(new Point(175, 50), 20);
	 *
	 * @example {@paperscript}
	 * project.currentStyle.fillColor = 'red';
	 *
	 * // The following path will take over the fill color we just set:
	 * var path = new Path.Circle(new Point(75, 50), 30);
	 * var path2 = new Path.Circle(new Point(175, 50), 20);
	 */
	getCurrentStyle: function() {
		return this._currentStyle;
	},

	setCurrentStyle: function(style) {
		// TODO: Style selected items with the style:
		this._currentStyle.initialize(style);
	},

	/**
	 * The index of the project in the {@link PaperScope#projects} list.
	 *
	 * @type Number
	 * @bean
	 */
	getIndex: function() {
		return this._index;
	},

	/**
	 * The selected items contained within the project.
	 *
	 * @type Item[]
	 * @bean
	 */
	getSelectedItems: function() {
		// TODO: Return groups if their children are all selected,
		// and filter out their children from the list.
		// TODO: The order of these items should be that of their
		// drawing order.
		var items = [];
		Base.each(this._selectedItems, function(item) {
			items.push(item);
		});
		return items;
	},

	// TODO: Implement setSelectedItems?

	_updateSelection: function(item) {
		if (item._selected) {
			this._selectedItemCount++;
			this._selectedItems[item.getId()] = item;
		} else {
			this._selectedItemCount--;
			delete this._selectedItems[item.getId()];
		}
	},

	/**
	 * Selects all items in the project.
	 */
	selectAll: function() {
		for (var i = 0, l = this.layers.length; i < l; i++)
			this.layers[i].setSelected(true);
	},

	/**
	 * Deselects all selected items in the project.
	 */
	deselectAll: function() {
		for (var i in this._selectedItems)
			this._selectedItems[i].setSelected(false);
	},

	/**
	 * Perform a hit test on the items contained within the project at the
	 * location of the specified point.
	 * 
	 * The optional options object allows you to control the specifics of the
	 * hit test and may contain a combination of the following values:
	 * <b>options.tolerance:</b> {@code Number} - The tolerance of the hit test
	 * in points.
	 * <b>options.type:</b> Only hit test again a certain item
	 * type: {@link PathItem}, {@link Raster}, {@link TextItem}, etc.
	 * <b>options.fill:</b> {@code Boolean} - Hit test the fill of items.
	 * <b>options.stroke:</b> {@code Boolean} - Hit test the curves of path
	 * items, taking into account stroke width.
	 * <b>options.segment:</b> {@code Boolean} - Hit test for
	 * {@link Segment#point} of {@link Path} items.
	 * <b>options.handles:</b> {@code Boolean} - Hit test for the handles
	 * ({@link Segment#handleIn} / {@link Segment#handleOut}) of path segments.
	 * <b>options.ends:</b> {@code Boolean} - Only hit test for the first or
	 * last segment points of open path items.
	 * <b>options.bounds:</b> {@code Boolean} - Hit test the corners and
	 * side-centers of the bounding rectangle of items ({@link Item#bounds}).
	 * <b>options.center:</b> {@code Boolean} - Hit test the
	 * {@link Rectangle#center} of the bounding rectangle of items
	 * ({@link Item#bounds}).
	 * <b>options.guide:</b> {@code Boolean} - Hit test items that have
	 * {@link Item#guide} set to {@code true}.
	 * <b>options.selected:</b> {@code Boolean} - Only hit selected items.
	 *
	 * @param {Point} point The point where the hit test should be performed
	 * @param {Object} [options={ fill: true, stroke: true, segments: true,
	 * tolerance: true }]
	 * @return {HitResult} A hit result object that contains more
	 * information about what exactly was hit or {@code null} if nothing was
	 * hit.
	 */
	hitTest: function(point, options) {
		options = HitResult.getOptions(point, options);
		point = options.point;
		// Loop backwards, so layers that get drawn last are tested first
		for (var i = this.layers.length - 1; i >= 0; i--) {
			var res = this.layers[i].hitTest(point, options);
			if (res) return res;
		}
		return null;
	},

	/**
	 * {@grouptitle Project Hierarchy}
	 *
	 * The layers contained within the project.
	 *
	 * @name Project#layers
	 * @type Layer[]
	 */

	/**
	 * The layer which is currently active. New items will be created on this
	 * layer by default.
	 *
	 * @name Project#activeLayer
	 * @type Layer
	 */

	/**
	 * The symbols contained within the project.
	 *
	 * @name Project#symbols
	 * @type Symbol[]
	 */

	/**
	 * The views contained within the project.
	 *
	 * @name Project#views
	 * @type View[]
	 */

	/**
	 * The view which is currently active.
	 *
	 * @name Project#activeView
	 * @type View
	 */

	draw: function(ctx) {
		ctx.save();
		var param = { offset: new Point(0, 0) };
		for (var i = 0, l = this.layers.length; i < l; i++)
			Item.draw(this.layers[i], ctx, param);
		ctx.restore();

		// Draw the selection of the selected items in the project:
		if (this._selectedItemCount > 0) {
			ctx.save();
			ctx.strokeWidth = 1;
			// TODO: use Layer#color
			ctx.strokeStyle = ctx.fillStyle = '#009dec';
			param = { selection: true };
			Base.each(this._selectedItems, function(item) {
				item.draw(ctx, param);
			});
			ctx.restore();
		}
	}
});
