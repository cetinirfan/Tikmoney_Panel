/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="node" />
import * as grpcProtoLoader from '@grpc/proto-loader';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import * as grpc from '@grpc/grpc-js';
import { OutgoingHttpHeaders } from 'http';
import * as protobuf from 'protobufjs';
import * as gax from './gax';
export interface GrpcClientOptions extends GoogleAuthOptions {
    auth?: GoogleAuth;
    grpc?: GrpcModule;
}
export interface MetadataValue {
    equals: Function;
}
export interface Metadata {
    new (): Metadata;
    set: (key: {}, value?: {} | null) => void;
    clone: () => Metadata;
    value: MetadataValue;
    get: (key: {}) => {};
}
export declare type GrpcModule = typeof grpc;
export interface ClientStubOptions {
    protocol?: string;
    servicePath?: string;
    port?: number;
    sslCreds?: grpc.ChannelCredentials;
    [index: string]: string | number | undefined | {};
}
export declare class ClientStub extends grpc.Client {
    [name: string]: Function;
}
export declare class GrpcClient {
    auth: GoogleAuth;
    grpc: GrpcModule;
    grpcVersion: string;
    fallback: boolean;
    private static protoCache;
    /**
     * Key for proto cache map. We are doing our best to make sure we respect
     * the options, so if the same proto file is loaded with different set of
     * options, the cache won't be used.  Since some of the options are
     * Functions (e.g. `enums: String` - see below in `loadProto()`),
     * they will be omitted from the cache key.  If the cache breaks anything
     * for you, use the `ignoreCache` parameter of `loadProto()` to disable it.
     */
    private static protoCacheKey;
    /**
     * In rare cases users might need to deallocate all memory consumed by loaded protos.
     * This method will delete the proto cache content.
     */
    static clearProtoCache(): void;
    /**
     * A class which keeps the context of gRPC and auth for the gRPC.
     *
     * @param {Object=} options - The optional parameters. It will be directly
     *   passed to google-auth-library library, so parameters like keyFile or
     *   credentials will be valid.
     * @param {Object=} options.auth - An instance of google-auth-library.
     *   When specified, this auth instance will be used instead of creating
     *   a new one.
     * @param {Object=} options.grpc - When specified, this will be used
     *   for the 'grpc' module in this context. By default, it will load the grpc
     *   module in the standard way.
     * @constructor
     */
    constructor(options?: GrpcClientOptions);
    /**
     * Creates a gRPC credentials. It asks the auth data if necessary.
     * @private
     * @param {Object} opts - options values for configuring credentials.
     * @param {Object=} opts.sslCreds - when specified, this is used instead
     *   of default channel credentials.
     * @return {Promise} The promise which will be resolved to the gRPC credential.
     */
    _getCredentials(opts: ClientStubOptions): Promise<grpc.ChannelCredentials>;
    /**
     * Loads the gRPC service from the proto file(s) at the given path and with the
     * given options. Caches the loaded protos so the subsequent loads don't do
     * any disk reads.
     * @param filename The path to the proto file(s).
     * @param options Options for loading the proto file.
     * @param ignoreCache Defaults to `false`. Set it to `true` if the caching logic
     *   incorrectly decides that the options object is the same, or if you want to
     *   re-read the protos from disk for any other reason.
     */
    loadFromProto(filename: string | string[], options: grpcProtoLoader.Options, ignoreCache?: boolean): grpc.GrpcObject;
    /**
     * Load gRPC proto service from a filename looking in googleapis common protos
     * when necessary. Caches the loaded protos so the subsequent loads don't do
     * any disk reads.
     * @param {String} protoPath - The directory to search for the protofile.
     * @param {String|String[]} filename - The filename(s) of the proto(s) to be loaded.
     *   If omitted, protoPath will be treated as a file path to load.
     * @param ignoreCache Defaults to `false`. Set it to `true` if the caching logic
     *   incorrectly decides that the options object is the same, or if you want to
     *   re-read the protos from disk for any other reason.
     * @return {Object<string, *>} The gRPC loaded result (the toplevel namespace
     *   object).
     */
    loadProto(protoPath: string, filename?: string | string[], ignoreCache?: boolean): grpc.GrpcObject;
    static _resolveFile(protoPath: string, filename: string): string;
    metadataBuilder(headers: OutgoingHttpHeaders): (abTests?: {} | undefined, moreHeaders?: OutgoingHttpHeaders | undefined) => grpc.Metadata;
    /**
     * A wrapper of {@link constructSettings} function under the gRPC context.
     *
     * Most of parameters are common among constructSettings, please take a look.
     * @param {string} serviceName - The fullly-qualified name of the service.
     * @param {Object} clientConfig - A dictionary of the client config.
     * @param {Object} configOverrides - A dictionary of overriding configs.
     * @param {Object} headers - A dictionary of additional HTTP header name to
     *   its value.
     * @return {Object} A mapping of method names to CallSettings.
     */
    constructSettings(serviceName: string, clientConfig: gax.ClientConfig, configOverrides: gax.ClientConfig, headers: OutgoingHttpHeaders): any;
    /**
     * Creates a gRPC stub with current gRPC and auth.
     * @param {function} CreateStub - The constructor function of the stub.
     * @param {Object} options - The optional arguments to customize
     *   gRPC connection. This options will be passed to the constructor of
     *   gRPC client too.
     * @param {string} options.servicePath - The name of the server of the service.
     * @param {number} options.port - The port of the service.
     * @param {grpcTypes.ClientCredentials=} options.sslCreds - The credentials to be used
     *   to set up gRPC connection.
     * @return {Promise} A promise which resolves to a gRPC stub instance.
     */
    createStub(CreateStub: typeof ClientStub, options: ClientStubOptions): Promise<ClientStub>;
    /**
     * Creates a 'bytelength' function for a given proto message class.
     *
     * See {@link BundleDescriptor} about the meaning of the return value.
     *
     * @param {function} message - a constructor function that is generated by
     *   protobuf.js. Assumes 'encoder' field in the message.
     * @return {function(Object):number} - a function to compute the byte length
     *   for an object.
     */
    static createByteLengthFunction(message: {
        encode: (obj: {}) => {
            finish: () => Array<{}>;
        };
    }): (obj: {}) => number;
}
export declare class GoogleProtoFilesRoot extends protobuf.Root {
    constructor(...args: Array<{}>);
    resolvePath(originPath: string, includePath: string): string;
    static _findIncludePath(originPath: string, includePath: string): string;
}
