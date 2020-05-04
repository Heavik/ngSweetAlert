/**
 @fileOverview

 @toc

 */

(function (root, factory) {
    "use strict";

    /*global define*/
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'sweetalert'], factory);  // AMD
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('angular'), require('sweetalert')); // Node
    } else {
        factory(root.angular, root.swal);					// Browser
    }

}(this, function (angular, swal) {  
    "use strict";

    angular.module('oitozero.ngSweetAlert', [])
        .factory('SweetAlert', ['$rootScope', 'SweetAlertConfig', function ($rootScope, SweetAlertConfig) {
            function changeTypeProperty(config) {
                if(config.type === 'input') {
                    config.input = 'text';
                } else {
                    config.icon = config.type;
                }
                delete config.type;
                return config;
            }

            function hasProp(config, propName) {
                return config.hasOwnProperty(propName);   
            }
            
            function remapConfiguration(config) {
                if(hasProp(config, 'type')) {
                    config = changeTypeProperty(config);
                }
                if(hasProp(config, 'dangerMode')) {
                    if(config.dangerMode) {
                        config.confirmButtonColor = '#e50000';
                    } 
                    delete config.dangerMode;
                }
                config = Object.assign({}, SweetAlertConfig, config);
                return config;
            }
            
            function promiseWrap(func) {
                return new Promise(function(resolve, reject) {
                    $rootScope.$evalAsync(function () {
                        return func(resolve);
                    });
                });
            }

            function onResolve(resolve) {
                return function(result) {
                    resolve(result);
                }
            }
            
            //public methods
            var self = {

                swal: function (arg1, arg2) {

                    //merge with default config
                    var arg1 = remapConfiguration(arg1);

                    return promiseWrap(function (resolve) {
                        if (typeof(arg2) === 'function') {
                            return swal.fire(arg1).then(function(result) {
                                if(result && result.dismiss) {
                                    result = false;
                                } else {
                                    result = result ? result.value : undefined;
                                }
                                $rootScope.$evalAsync(function() {
                                    arg2(result);
                                    resolve(result);
                                });
                            });
                        } else {
                            return swal.fire(arg1).then(onResolve(resolve));
                        }
                    });
                },
                fire: function(config) {
                    config = remapConfiguration(config);
                    return promiseWrap(function(resolve) {
                        return swal.fire(config).then(onResolve(resolve));
                    });
                },
                success: function (title, message) {
                    return promiseWrap(function(resolve) {
                        swal.fire({ title: title, text: message, icon: 'success' }).then(onResolve(resolve));
                    });
                },
                error: function (title, message) {
                    return promiseWrap(function(resolve) {
                        swal.fire({ title: title, text: message, icon: 'error' }).then(onResolve(resolve));
                    });
                },
                warning: function (title, message) {
                    return promiseWrap(function(resolve) {
                        swal.fire({ title: title, text: message, icon: 'warning' }).then(onResolve(resolve));
                    });
                },
                info: function (title, message) {
                    return promiseWrap(function(resolve) {
                        swal.fire({ title: title, text: message, icon: 'info' }).then(onResolve(resolve));
                    });
                },
                showInputError: function (message) {
                    return promiseWrap(function(resolve) {
                        swal.showValidationMessage(message).then(onResolve(resolve));
                    });
                },
                close: function () {
                    $rootScope.$evalAsync(function () {
                        swal.close();
                    });
                }
            };

            return self;
        }]).constant('SweetAlertConfig', {
            title: '',
            titleText: '',
            html: '',
            text: '',
            icon: undefined,
            iconHtml: undefined,
            footer: '',
            backdrop: true,
            toast: false,
            target: 'body',
            input: undefined,
            width: undefined,
            padding: undefined,
            background: undefined,
            position: 'center',
            grow: false,
            customClass: undefined,
            timer: undefined,
            timerProgressBar: false,
            heightAuto: true,
            allowOutsideClick: true,
            allowEscapeKey: true,
            allowEnterKey: true,
            stopKeydownPropagation: true,
            keydownListenerCapture: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            confirmButtonColor: undefined,
            cancelButtonColor: undefined,
            confirmButtonAriaLabel: '',
            cancelButtonAriaLabel: '',
            buttonsStyling: true,
            reverseButtons: true,
            focusConfirm: true,
            focusCancel: false,
            showCloseButton: false,
            closeButtonHtml: '&times;',
            closeButtonAriaLabel: 'Close this dialog',
            showLoaderOnConfirm: false,
            scrollbarPadding: true,
            preConfirm: undefined,
            imageUrl: undefined,
            imageWidth: undefined,
            imageHeight: undefined,
            imageAlt: '',
            inputPlaceholder: '',
            inputValue: '',
            inputOptions: {},
            inputAutoTrim: true,
            inputAttributes: {},
            inputValidator: undefined,
            validationMessage: undefined,
            progressSteps: [],
            currentProgressStep: undefined,
            progressStepsDistance: '40px',
            onBeforeOpen: undefined,
            onOpen: undefined,
            onRender: undefined,
            onClose: undefined,
            onAfterClose: undefined,
            onDestroy: undefined
    });
}));
