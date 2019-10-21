var utils = require('cordova/utils'),
  common = require('./Common'),
  Overlay = require('./Overlay');

/*****************************************************************************
 * GroundOverlay Class
 *****************************************************************************/
var GroundOverlay = function (map, groundOverlayOptions, _exec) {
  Overlay.call(this, map, groundOverlayOptions, 'GroundOverlay', _exec);

  var self = this;
  groundOverlayOptions.visible = groundOverlayOptions.visible === undefined ? true : groundOverlayOptions.visible;
  groundOverlayOptions.zIndex = groundOverlayOptions.zIndex || 1;
  groundOverlayOptions.opacity = groundOverlayOptions.opacity || 1;
  groundOverlayOptions.bounds = groundOverlayOptions.bounds || [];
  groundOverlayOptions.anchor = groundOverlayOptions.anchor || [0, 0];
  groundOverlayOptions.bearing = groundOverlayOptions.bearing || 0;

  //-----------------------------------------------
  // Sets event listeners
  //-----------------------------------------------
  self.on('visible_changed', function () {
    var visible = self.get('visible');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setVisible',
        'args': [
          self.getId(),
          visible
        ]
      }]);
  });
  self.on('image_changed', function () {
    var image = self.get('image');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setImage',
        'args': [
          self.getId(),
          image
        ]
      }]);
  });
  self.on('bounds_changed', function () {
    var bounds = self.get('bounds');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setBounds',
        'args': [
          self.getId(),
          bounds
        ]
      }]);
  });
  self.on('opacity_changed', function () {
    var opacity = self.get('opacity');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setOpacity',
        'args': [
          self.getId(),
          opacity
        ]
      }]);
  });
  self.on('clickable_changed', function () {
    var clickable = self.get('clickable');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setClickable',
        'args': [
          self.getId(),
          clickable
        ]
      }]);
  });
  self.on('bearing_changed', function () {
    var bearing = self.get('bearing');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setBearing',
        'args': [
          self.getId(),
          bearing
        ]
      }]);
  });
  self.on('zIndex_changed', function () {
    var zIndex = self.get('zIndex');
    self.exec.call(self,
      null,
      self.errorHandler,
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': map.__pgmId,
        'instance': self.__pgmId,
        'cmd': 'setZIndex',
        'args': [
          self.getId(),
          zIndex
        ]
      }]);
  });

};

utils.extend(GroundOverlay, Overlay);

GroundOverlay.prototype.setVisible = function (visible) {
  this.set('visible', visible);
};

GroundOverlay.prototype.getVisible = function () {
  return this.get('visible');
};

GroundOverlay.prototype.setImage = function (url) {
  this.set('image', url);
};

GroundOverlay.prototype.setBounds = function (points) {
  var i,
    bounds = [];
  for (i = 0; i < points.length; i++) {
    bounds.push({
      'lat': parseFloat(points[i].lat, 10),
      'lng': parseFloat(points[i].lng, 10)
    });
  }
  this.set('bounds', bounds);
};

GroundOverlay.prototype.getOpacity = function () {
  return this.get('opacity');
};

GroundOverlay.prototype.getBearing = function () {
  return this.get('bearing');
};

GroundOverlay.prototype.setOpacity = function (opacity) {
  if (!opacity && opacity !== 0) {
    console.log('opacity value must be int or double');
    return false;
  }
  this.set('opacity', opacity);
};
GroundOverlay.prototype.setBearing = function (bearing) {
  if (bearing > 360) {
    bearing = bearing - Math.floor(bearing / 360) * 360;
  }
  this.set('bearing', bearing);
};

GroundOverlay.prototype.getZIndex = function () {
  return this.get('zIndex');
};

GroundOverlay.prototype.setZIndex = function (zIndex) {
  this.set('zIndex', zIndex);
};
GroundOverlay.prototype.setClickable = function (clickable) {
  clickable = common.parseBoolean(clickable);
  this.set('clickable', clickable);
  return this;
};
GroundOverlay.prototype.getClickable = function () {
  return this.get('clickable');
};

GroundOverlay.prototype.remove = function (callback) {
  var self = this;
  if (self._isRemoved) {
    if (typeof callback === 'function') {
      return;
    } else {
      return Promise.resolve();
    }
  }
  Object.defineProperty(self, '_isRemoved', {
    value: true,
    writable: false
  });
  self.trigger(self.__pgmId + '_remove');

  var resolver = function(resolve, reject) {
    self.exec.call(self,
      function() {
        self.destroy();
        resolve.call(self);
      },
      reject.bind(self),
      'CordovaGoogleMaps',
      'cmd', [{
        'mapId': self.get('map').__pgmId,
        'instance': self.__pgmId,
        'cmd': 'remove',
        'args': [
          self.getId()
        ]
      }, {
        remove: true
      }]);
  };

  if (typeof callback === 'function') {
    resolver(callback, self.errorHandler);
  } else {
    return new Promise(resolver);
  }

};

module.exports = GroundOverlay;
