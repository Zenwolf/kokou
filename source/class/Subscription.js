/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function (global) {

var kokou = global.kokou = (global.kokou || {});

function Subscription(target, clientId) {
    this._target = target;
    this._clientId = clientId;
    this._isActive = true;
}

Subscription.prototype = {

    cancel: function() {
        if (!this._isActive) {
            return;
        }

        this._target.unbind(this._clientId);
        this._isActive = false;
    }

};

} (this));
