/*
 *  File: app.js
 *
 *  Description:
 *      Main entry point for FlickrViewer for iPad
 *      Just call flickr.js to get photos
 *
 *  Created: 2010/12/2
 *
 *  Author: Daisuke Kobayashi  poleon.kd@gmail.com
 *
 *  Revision History:
 *      2010/12/2    Created
 *      
 */

var mainWin = Ti.UI.createWindow({
    title:'Viewer',
    backgroundColor:'#000',
    url:'flickr.js'
});

mainWin.open();
