/*! firebase-admin v9.6.0 */
"use strict";
/*!
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseInstanceIdRequestHandler = void 0;
var error_1 = require("../utils/error");
var api_request_1 = require("../utils/api-request");
var utils = require("../utils/index");
var validator = require("../utils/validator");
/** Firebase IID backend host. */
var FIREBASE_IID_HOST = 'console.firebase.google.com';
/** Firebase IID backend path. */
var FIREBASE_IID_PATH = '/v1/';
/** Firebase IID request timeout duration in milliseconds. */
var FIREBASE_IID_TIMEOUT = 10000;
/** HTTP error codes raised by the backend server. */
var ERROR_CODES = {
    400: 'Malformed instance ID argument.',
    401: 'Request not authorized.',
    403: 'Project does not match instance ID or the client does not have sufficient privileges.',
    404: 'Failed to find the instance ID.',
    409: 'Already deleted.',
    429: 'Request throttled out by the backend server.',
    500: 'Internal server error.',
    503: 'Backend servers are over capacity. Try again later.',
};
/**
 * Class that provides mechanism to send requests to the Firebase Instance ID backend endpoints.
 */
var FirebaseInstanceIdRequestHandler = /** @class */ (function () {
    /**
     * @param {FirebaseApp} app The app used to fetch access tokens to sign API requests.
     *
     * @constructor
     */
    function FirebaseInstanceIdRequestHandler(app) {
        this.app = app;
        this.host = FIREBASE_IID_HOST;
        this.timeout = FIREBASE_IID_TIMEOUT;
        this.httpClient = new api_request_1.AuthorizedHttpClient(app);
    }
    FirebaseInstanceIdRequestHandler.prototype.deleteInstanceId = function (instanceId) {
        if (!validator.isNonEmptyString(instanceId)) {
            return Promise.reject(new error_1.FirebaseInstanceIdError(error_1.InstanceIdClientErrorCode.INVALID_INSTANCE_ID, 'Instance ID must be a non-empty string.'));
        }
        return this.invokeRequestHandler(new api_request_1.ApiSettings(instanceId, 'DELETE'));
    };
    /**
     * Invokes the request handler based on the API settings object passed.
     *
     * @param {ApiSettings} apiSettings The API endpoint settings to apply to request and response.
     * @return {Promise<void>} A promise that resolves when the request is complete.
     */
    FirebaseInstanceIdRequestHandler.prototype.invokeRequestHandler = function (apiSettings) {
        var _this = this;
        return this.getPathPrefix()
            .then(function (path) {
            var req = {
                url: "https://" + _this.host + path + apiSettings.getEndpoint(),
                method: apiSettings.getHttpMethod(),
                timeout: _this.timeout,
            };
            return _this.httpClient.send(req);
        })
            .then(function () {
            // return nothing on success
        })
            .catch(function (err) {
            if (err instanceof api_request_1.HttpError) {
                var response = err.response;
                var errorMessage = (response.isJson() && 'error' in response.data) ?
                    response.data.error : response.text;
                var template = ERROR_CODES[response.status];
                var message = template ?
                    "Instance ID \"" + apiSettings.getEndpoint() + "\": " + template : errorMessage;
                throw new error_1.FirebaseInstanceIdError(error_1.InstanceIdClientErrorCode.API_ERROR, message);
            }
            // In case of timeouts and other network errors, the HttpClient returns a
            // FirebaseError wrapped in the response. Simply throw it here.
            throw err;
        });
    };
    FirebaseInstanceIdRequestHandler.prototype.getPathPrefix = function () {
        var _this = this;
        if (this.path) {
            return Promise.resolve(this.path);
        }
        return utils.findProjectId(this.app)
            .then(function (projectId) {
            if (!validator.isNonEmptyString(projectId)) {
                // Assert for an explicit projct ID (either via AppOptions or the cert itself).
                throw new error_1.FirebaseInstanceIdError(error_1.InstanceIdClientErrorCode.INVALID_PROJECT_ID, 'Failed to determine project ID for InstanceId. Initialize the '
                    + 'SDK with service account credentials or set project ID as an app option. '
                    + 'Alternatively set the GOOGLE_CLOUD_PROJECT environment variable.');
            }
            _this.path = FIREBASE_IID_PATH + ("project/" + projectId + "/instanceId/");
            return _this.path;
        });
    };
    return FirebaseInstanceIdRequestHandler;
}());
exports.FirebaseInstanceIdRequestHandler = FirebaseInstanceIdRequestHandler;
