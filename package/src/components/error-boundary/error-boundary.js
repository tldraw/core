"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.ErrorBoundary = void 0;
var React = require("react");
// Copied from https://github.com/bvaughn/react-error-boundary/blob/master/src/index.tsx
// (There's an issue with esm builds of this library, so we can't use it directly.)
var changedArray = function (a, b) {
    if (a === void 0) { a = []; }
    if (b === void 0) { b = []; }
    return a.length !== b.length || a.some(function (item, index) { return !Object.is(item, b[index]); });
};
var initialState = { error: null };
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = initialState;
        _this.updatedWithError = false;
        _this.resetErrorBoundary = function () {
            var _a, _b;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            (_b = (_a = _this.props).onReset) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([_a], args, false));
            _this.reset();
        };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { error: error };
    };
    ErrorBoundary.prototype.reset = function () {
        this.updatedWithError = false;
        this.setState(initialState);
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        var _a, _b;
        (_b = (_a = this.props).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, info);
    };
    ErrorBoundary.prototype.componentDidMount = function () {
        var error = this.state.error;
        if (error !== null) {
            this.updatedWithError = true;
        }
    };
    ErrorBoundary.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b;
        var error = this.state.error;
        var resetKeys = this.props.resetKeys;
        // There's an edge case where if the thing that triggered the error
        // happens to *also* be in the resetKeys array, we'd end up resetting
        // the error boundary immediately. This would likely trigger a second
        // error to be thrown.
        // So we make sure that we don't check the resetKeys on the first call
        // of cDU after the error is set
        if (error !== null && !this.updatedWithError) {
            this.updatedWithError = true;
            return;
        }
        if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
            (_b = (_a = this.props).onResetKeysChange) === null || _b === void 0 ? void 0 : _b.call(_a, prevProps.resetKeys, resetKeys);
            this.reset();
        }
    };
    ErrorBoundary.prototype.render = function () {
        var error = this.state.error;
        var _a = this.props, fallbackRender = _a.fallbackRender, FallbackComponent = _a.FallbackComponent, fallback = _a.fallback;
        if (error !== null) {
            var props = {
                error: error,
                resetErrorBoundary: this.resetErrorBoundary
            };
            if (React.isValidElement(fallback)) {
                return fallback;
            }
            else if (typeof fallbackRender === 'function') {
                return fallbackRender(props);
            }
            else if (FallbackComponent) {
                return <FallbackComponent {...props}/>;
            }
            else {
                throw new Error('react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop');
            }
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
exports.ErrorBoundary = ErrorBoundary;
